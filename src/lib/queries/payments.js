import { createClient } from "@/lib/supabase/server";

/**
 * Fetch a payment order the current user owns (RLS scopes to owner/admin).
 */
export async function getPaymentOrderById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_orders")
    .select("id, subscription_id, order_code, amount, description, qr_url, bank_account, bank_code, status, created_at")
    .eq("id", id)
    .single();
  if (error) {
    return null;
  }
  return data;
}
