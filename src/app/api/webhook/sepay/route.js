import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySepaySignature } from "@/lib/sepay";
import { notifyWebinarPaid } from "@/lib/notifications";

const UNIQUE_VIOLATION = "23505";

export async function POST(request) {
  // ── 1. Fail closed if unconfigured ──
  const secret = process.env.SEPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // Raw body bytes are required for HMAC verification — must NOT parse
  // then re-serialize (whitespace/key-order changes would break the check).
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-sepay-signature");
  const timestampHeader = request.headers.get("x-sepay-timestamp");

  const verification = verifySepaySignature(rawBody, signatureHeader, timestampHeader, secret);
  if (!verification.valid) {
    console.error("sepay webhook: rejected —", verification.reason);
    return NextResponse.json({ success: false }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const transactionId = String(payload?.id ?? "").trim();
  const code = String(payload?.code ?? "").trim();
  const content = String(payload?.content ?? "").trim();
  const transferType = payload?.transferType;
  const transferAmount = Number(payload?.transferAmount ?? 0);
  // SePay's `code` is meant to be the already-isolated payment code, but in
  // practice it can come through empty or with extra surrounding text (e.g.
  // Sandbox Simulate transactions that don't match SePay's own recognized
  // code pattern) — fall back to searching the raw transfer content too, and
  // match by substring rather than exact equality, mirroring the PayOS
  // webhook's tolerant matching for the same reason.
  const matchText = `${code} ${content}`.toUpperCase();

  if (!transactionId) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const supabase = createAdminClient();

  // ── 2. Dedup via DB unique constraint (not memory — serverless has no
  // shared state between invocations, and SePay retries/replays). ──
  const { error: insertErr } = await supabase
    .from("sepay_webhook_events")
    .insert({ sepay_transaction_id: transactionId, payload });

  if (insertErr) {
    if (insertErr.code === UNIQUE_VIOLATION) {
      // Already processed this exact transaction id — ack without redoing
      // side effects (order update, Zoom email).
      return NextResponse.json({ success: true });
    }
    console.error("sepay webhook: failed to record event —", insertErr.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  // Only incoming transfers with some payment reference can fulfil an order.
  if (transferType !== "in" || !matchText.trim()) {
    return NextResponse.json({ success: true });
  }

  // ── 3. Match the pending order by SePay's `code`/`content` field ──
  const { data: orders } = await supabase
    .from("payment_orders")
    .select("id, subscription_id, order_code, amount, status, item_type, item_id, user_id")
    .eq("status", "pending");

  const match = (orders ?? []).find((o) => matchText.includes(o.order_code.toUpperCase()));

  if (!match) {
    // No matching order — ack so SePay stops retrying; nothing to flag,
    // this is a normal case (unrelated incoming transfer).
    return NextResponse.json({ success: true });
  }

  if (transferAmount > 0 && Math.abs(transferAmount - Number(match.amount)) > 1) {
    console.error("sepay webhook: amount mismatch —", {
      orderCode: match.order_code,
      expected: match.amount,
      got: transferAmount,
    });
    await supabase
      .from("sepay_webhook_events")
      .update({ order_id: match.id })
      .eq("sepay_transaction_id", transactionId);
    // Ack anyway — this is a data issue to review manually, not a transient
    // failure SePay retrying would fix.
    return NextResponse.json({ success: true });
  }

  const now = new Date().toISOString();

  // ── 4. Mark the order paid ──
  await supabase
    .from("payment_orders")
    .update({ status: "paid", paid_at: now, webhook_payload: payload, updated_at: now })
    .eq("id", match.id)
    .eq("status", "pending");

  // ── 5. Same access-grant + notification logic as admin mark-paid / PayOS webhook ──
  if (match.subscription_id) {
    await supabase.from("subscriptions").update({ payment_status: "paid" }).eq("id", match.subscription_id);
  }
  await notifyWebinarPaid(supabase, match);

  await supabase
    .from("sepay_webhook_events")
    .update({ order_id: match.id, matched: true })
    .eq("sepay_transaction_id", transactionId);

  return NextResponse.json({ success: true });
}
