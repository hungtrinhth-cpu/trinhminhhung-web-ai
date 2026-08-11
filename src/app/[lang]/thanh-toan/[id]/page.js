import CheckoutClient from "@/components/CheckoutClient";
import { getPaymentOrderById } from "@/lib/queries/payments";
import { getSessionProfile } from "@/lib/queries/profiles";
import { createClient } from "@/lib/supabase/server";
import { VIETQR_ACCOUNT, VIETQR_BANK, buildVietQRUrl } from "@/lib/vietqr";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveItemTitle(order) {
  if (!order?.subscription_id) return "Đăng ký";
  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("item_type, item_id")
    .eq("id", order.subscription_id)
    .single();
  if (!sub) return "Đăng ký";
  const table = sub.item_type === "webinar" ? "webinars" : "courses";
  const { data: item } = await supabase
    .from(table)
    .select("title")
    .eq("id", sub.item_id)
    .single();
  return item?.title ?? "Đăng ký";
}

export default async function CheckoutPage({ params }) {
  const { lang, id } = await params;

  // Real order?
  if (UUID_RE.test(id)) {
    const order = await getPaymentOrderById(id);
    if (order) {
      const [{ profile, user }, title] = await Promise.all([
        getSessionProfile(),
        resolveItemTitle(order),
      ]);
      return (
        <CheckoutClient
          lang={lang}
          orderId={order.id}
          title={title}
          amount={order.amount}
          qrUrl={order.qr_url}
          orderCode={order.order_code}
          bankAccount={order.bank_account || VIETQR_ACCOUNT}
          bankName={order.bank_code || VIETQR_BANK || "Ngân hàng"}
          customerName={profile?.full_name || ""}
          customerEmail={profile?.email || user?.email || ""}
          initialStatus={order.status}
        />
      );
    }
  }

  // Demo fallback (no real order found).
  const demoAmount = 499000;
  const demoCode = "HTADEMO01";
  return (
    <CheckoutClient
      lang={lang}
      orderId={null}
      title="AI Agent Thực Chiến 2025"
      amount={demoAmount}
      qrUrl={buildVietQRUrl({ amount: demoAmount, memo: demoCode })}
      orderCode={demoCode}
      bankAccount={VIETQR_ACCOUNT}
      bankName={VIETQR_BANK || "Ngân hàng"}
      customerName=""
      customerEmail=""
      initialStatus="pending"
    />
  );
}
