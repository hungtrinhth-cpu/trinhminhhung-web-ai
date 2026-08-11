import { createClient } from "@/lib/supabase/server";

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

function startOfPrevMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString();
}

/**
 * Aggregate admin dashboard metrics from real tables. Everything is computed
 * defensively so a missing/empty table yields zeros rather than throwing.
 */
export async function getDashboardStats() {
  const supabase = await createClient();
  const monthStart = startOfMonth();
  const prevMonthStart = startOfPrevMonth();

  const [{ data: leads }, { data: subs }, { data: lists }] = await Promise.all([
    supabase.from("leads").select("id, created_at, list_id"),
    supabase
      .from("subscriptions")
      .select("id, amount, payment_status, created_at, user_id, item_type")
      .order("created_at", { ascending: false }),
    supabase.from("lead_lists").select("id, name"),
  ]);

  const leadRows = leads ?? [];
  const subRows = subs ?? [];
  const listRows = lists ?? [];

  // ── Leads ──
  const newLeadsThisMonth = leadRows.filter((l) => l.created_at >= monthStart).length;
  const newLeadsPrevMonth = leadRows.filter(
    (l) => l.created_at >= prevMonthStart && l.created_at < monthStart
  ).length;
  const leadsDelta = newLeadsThisMonth - newLeadsPrevMonth;

  // ── Revenue & orders (paid subscriptions) ──
  const paidSubs = subRows.filter((s) => s.payment_status === "paid");
  const revenueThisMonth = paidSubs
    .filter((s) => s.created_at >= monthStart)
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const revenuePrevMonth = paidSubs
    .filter((s) => s.created_at >= prevMonthStart && s.created_at < monthStart)
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const revenuePct =
    revenuePrevMonth > 0
      ? Math.round(((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100)
      : 0;

  const ordersThisMonth = paidSubs.filter((s) => s.created_at >= monthStart).length;

  // ── Revenue by month (last 6 months, in millions for the chart) ──
  const now = new Date();
  const revenueByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const total = paidSubs
      .filter((s) => {
        const c = new Date(s.created_at);
        return c >= from && c < to;
      })
      .reduce((sum, s) => sum + Number(s.amount || 0), 0);
    revenueByMonth.push({
      month: `T${from.getMonth() + 1}`,
      value: Math.round(total / 1_000_000),
    });
  }

  // ── Conversion: paid subscriptions / total leads ──
  const conversion =
    leadRows.length > 0 ? Math.round((paidSubs.length / leadRows.length) * 100) : 0;

  // ── Campaign performance: leads per list ──
  const listName = {};
  for (const l of listRows) listName[l.id] = l.name;
  const counts = {};
  for (const l of leadRows) {
    if (l.list_id) counts[l.list_id] = (counts[l.list_id] ?? 0) + 1;
  }
  const maxCount = Math.max(1, ...Object.values(counts));
  const campaigns = Object.entries(counts)
    .map(([id, count]) => ({
      name: listName[id] ?? "Không tên",
      leads: count,
      percent: Math.round((count / maxCount) * 100),
    }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 5);

  // ── Recent transactions (need names) ──
  const recent = subRows.slice(0, 5);
  const userIds = [...new Set(recent.map((s) => s.user_id).filter(Boolean))];
  let nameById = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);
    for (const p of profiles ?? []) {
      nameById[p.id] = p.full_name || p.email || "Học viên";
    }
  }
  const recentTransactions = recent.map((s) => ({
    id: s.id,
    name: nameById[s.user_id] ?? "Học viên",
    itemType: s.item_type === "webinar" ? "Webinar" : "Khóa học",
    amount: Number(s.amount || 0),
    status: s.payment_status,
    date: s.created_at,
  }));

  return {
    revenue: { value: revenueThisMonth, pct: revenuePct },
    newLeads: { value: newLeadsThisMonth, delta: leadsDelta },
    orders: { value: ordersThisMonth },
    conversion: { value: conversion },
    revenueByMonth,
    campaigns,
    recentTransactions,
  };
}
