import { createClient } from "@/lib/supabase/server";
import { getAllPaymentOrders } from "@/lib/queries/payments";
import TransactionsClient from "@/components/admin/TransactionsClient";

const ITEM_TYPE_LABEL = { webinar: "Webinar", course: "Khóa học", subscription: "Gói đăng ký" };

export default async function TransactionsPage() {
  const orders = await getAllPaymentOrders();
  const supabase = await createClient();

  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))];
  const webinarIds = [
    ...new Set(orders.filter((o) => o.item_type === "webinar" && o.item_id).map((o) => o.item_id)),
  ];

  const [{ data: profiles }, webinarTitleResult] = await Promise.all([
    userIds.length
      ? supabase.from("profiles").select("id, full_name, email").in("id", userIds)
      : Promise.resolve({ data: [] }),
    webinarIds.length
      ? supabase.from("webinars").select("id, title").in("id", webinarIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileById = {};
  for (const p of profiles ?? []) profileById[p.id] = p;

  const webinarTitleById = {};
  for (const w of webinarTitleResult.data ?? []) webinarTitleById[w.id] = w.title;

  const enriched = orders.map((o) => {
    const profile = profileById[o.user_id];
    let itemTitle = ITEM_TYPE_LABEL[o.item_type] ?? o.item_type ?? "—";
    if (o.item_type === "webinar" && webinarTitleById[o.item_id]) {
      itemTitle = webinarTitleById[o.item_id];
    }
    return {
      ...o,
      customerName: profile?.full_name || profile?.email || "—",
      customerEmail: profile?.email || "",
      itemTitle,
      itemTypeLabel: ITEM_TYPE_LABEL[o.item_type] ?? o.item_type ?? "—",
    };
  });

  return <TransactionsClient initialOrders={enriched} />;
}
