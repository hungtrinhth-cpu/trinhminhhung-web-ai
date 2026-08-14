import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPayosSignature } from "@/lib/payos";
import { notifyWebinarPaid } from "@/lib/notifications";

/**
 * Tolerant field extraction across PayOS / Casso / VietQR webhook shapes.
 * We mainly need: the transfer memo (carries our order code) and the amount.
 */
function extractPayment(body) {
  const data = body?.data ?? body ?? {};
  const memo =
    data.description ??
    data.content ??
    data.addInfo ??
    data.note ??
    body?.description ??
    "";
  const amount = Number(
    data.amount ?? data.transferAmount ?? data.value ?? body?.amount ?? 0
  );
  return { memo: String(memo), amount };
}

export async function POST(request) {
  // ── 1. Verify the PayOS signature — fail closed if unconfigured ──
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
  if (!checksumKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!verifyPayosSignature(body?.data, body?.signature, checksumKey)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const { memo, amount } = extractPayment(body);
  if (!memo) {
    return NextResponse.json({ error: "no_memo" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // ── 2. Find the matching pending order by order_code embedded in memo ──
  const { data: orders } = await supabase
    .from("payment_orders")
    .select("id, subscription_id, order_code, amount, status, item_type, item_id, user_id")
    .eq("status", "pending");

  const match = (orders ?? []).find((o) =>
    memo.toUpperCase().includes(o.order_code.toUpperCase())
  );

  if (!match) {
    // No matching order — acknowledge so the gateway stops retrying, but flag.
    return NextResponse.json({ ok: true, matched: false });
  }

  // Optional amount sanity check (allow if gateway omitted amount).
  if (amount > 0 && Math.abs(amount - Number(match.amount)) > 1) {
    return NextResponse.json(
      { ok: false, reason: "amount_mismatch", expected: match.amount, got: amount },
      { status: 202 }
    );
  }

  const now = new Date().toISOString();

  // ── 3. Mark the order paid — conditioned on it still being "pending" and
  // checking the affected row count. PayOS has no transaction-id dedup table
  // (unlike the SePay route's sepay_webhook_events), so a retried/duplicate
  // delivery — or a race against another webhook call for the same order —
  // must be caught here: only the call that actually wins the pending→paid
  // transition proceeds to grant access / send the Zoom email. A losing call
  // (0 rows affected) means someone else already completed this order. ──
  const { data: updatedOrders } = await supabase
    .from("payment_orders")
    .update({ status: "paid", paid_at: now, webhook_payload: body, updated_at: now })
    .eq("id", match.id)
    .eq("status", "pending")
    .select("id");

  if (!updatedOrders || updatedOrders.length === 0) {
    return NextResponse.json({ ok: true, matched: true, alreadyProcessed: true, order: match.order_code });
  }

  // ── 4. Mark the subscription paid (DB trigger decrements webinar seats) ──
  if (match.subscription_id) {
    await supabase
      .from("subscriptions")
      .update({ payment_status: "paid" })
      .eq("id", match.subscription_id);
  }

  // ── 5. Email the Zoom link if this is a webinar purchase ──
  await notifyWebinarPaid(supabase, match);

  return NextResponse.json({ ok: true, matched: true, order: match.order_code });
}
