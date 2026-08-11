import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Shared secret the payment gateway must present. Configure in env.
const WEBHOOK_SECRET =
  process.env.PAYMENT_WEBHOOK_SECRET || process.env.PAYOS_API_KEY || "";

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
  // ── 1. Authenticate the webhook ──
  const provided =
    request.headers.get("x-webhook-secret") ||
    new URL(request.url).searchParams.get("secret") ||
    "";

  if (!WEBHOOK_SECRET || provided !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { memo, amount } = extractPayment(body);
  if (!memo) {
    return NextResponse.json({ error: "no_memo" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // ── 2. Find the matching pending order by order_code embedded in memo ──
  const { data: orders } = await supabase
    .from("payment_orders")
    .select("id, subscription_id, order_code, amount, status")
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

  // ── 3. Mark the order paid ──
  await supabase
    .from("payment_orders")
    .update({ status: "paid", paid_at: now, webhook_payload: body, updated_at: now })
    .eq("id", match.id);

  // ── 4. Mark the subscription paid (DB trigger decrements webinar seats) ──
  if (match.subscription_id) {
    await supabase
      .from("subscriptions")
      .update({ payment_status: "paid" })
      .eq("id", match.subscription_id);
  }

  return NextResponse.json({ ok: true, matched: true, order: match.order_code });
}
