"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markOrderPaid } from "@/app/[lang]/admin/transactions/actions";

const STATUS_LABEL = { pending: "Chờ xử lý", paid: "Đã thanh toán", failed: "Thất bại", expired: "Hết hạn" };
const STATUS_STYLE = {
  pending: "text-yellow-700 bg-yellow-50",
  paid: "text-green-700 bg-green-50",
  failed: "text-red-700 bg-red-50",
  expired: "text-slate-500 bg-slate-100",
};

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
}

function formatAmount(a) {
  return Number(a ?? 0).toLocaleString("vi-VN") + "đ";
}

function formatMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") return "—";
  const entries = Object.entries(metadata).filter(([, v]) => v);
  if (!entries.length) return "—";
  return entries.map(([k, v]) => `${k}=${v}`).join(", ");
}

export default function TransactionsClient({ initialOrders }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [markingId, setMarkingId] = useState(null);
  const [rowError, setRowError] = useState({});

  function refresh() {
    startTransition(() => router.refresh());
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        !q ||
        o.order_code?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.itemTitle?.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  const total = orders.length;
  const paid = orders.filter((o) => o.status === "paid").length;
  const pending = orders.filter((o) => o.status === "pending").length;

  async function handleMarkPaid(order) {
    if (!confirm(`Đánh dấu đơn ${order.order_code} là đã thanh toán?`)) return;
    setMarkingId(order.id);
    setRowError((prev) => ({ ...prev, [order.id]: "" }));

    try {
      const res = await markOrderPaid(order.id);

      if (res?.error) {
        setRowError((prev) => ({ ...prev, [order.id]: res.error }));
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "paid", paid_at: new Date().toISOString() } : o))
      );
      refresh();
    } catch (err) {
      // Guard against any unexpected exception (network error, etc.) so the
      // button never gets stuck in "Đang lưu..." with no feedback at all.
      setRowError((prev) => ({ ...prev, [order.id]: err?.message || "Có lỗi không xác định, vui lòng thử lại" }));
    } finally {
      setMarkingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
          Giao dịch
        </h1>
        <p className="font-body-md text-slate-subtext mt-1">Đơn hàng thật từ payment_orders</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: `Tổng: ${total} GD`, color: "bg-ink-text/5 text-ink-text border-ink-text/10" },
          { label: `Đã thanh toán: ${paid}`, color: "bg-primary-container/5 text-primary-container border-primary-container/10" },
          { label: `Chờ: ${pending}`, color: "bg-secondary/5 text-secondary border-secondary/10" },
        ].map((chip) => (
          <div
            key={chip.label}
            className={`px-4 py-2 rounded-full border flex items-center gap-2 font-label-eyebrow text-label-eyebrow uppercase ${chip.color}`}
          >
            {chip.label}
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] glass-card flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle">
          <span className="material-symbols-outlined text-slate-subtext/60">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, mã đơn, webinar..."
            className="bg-transparent flex-1 font-body-md text-ink-text placeholder:text-slate-subtext/40 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto glass-card px-4 py-2 rounded-xl border border-border-subtle font-body-md text-ink-text focus:outline-none focus:border-primary-container bg-white"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="paid">Đã thanh toán</option>
          <option value="failed">Thất bại</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Mã đơn</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Khách hàng</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Nội dung</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Loại</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Số tiền</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tracking</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tạo lúc</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Thanh toán lúc</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Trạng thái</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border-subtle last:border-0 hover:bg-mist-bg transition-colors align-top">
                  <td className="p-4 font-body-md text-ink-text font-bold whitespace-nowrap">{o.order_code}</td>
                  <td className="p-4 font-body-md text-ink-text">
                    <div>{o.customerName}</div>
                    {o.customerEmail && <div className="text-xs text-slate-subtext">{o.customerEmail}</div>}
                  </td>
                  <td className="p-4 font-body-md text-slate-subtext max-w-[200px] truncate">{o.itemTitle}</td>
                  <td className="p-4 font-body-md text-slate-subtext whitespace-nowrap">{o.itemTypeLabel}</td>
                  <td className="p-4 font-body-md text-ink-text font-bold whitespace-nowrap">{formatAmount(o.amount)}</td>
                  <td className="p-4 font-body-md text-slate-subtext text-xs max-w-[220px] truncate" title={formatMetadata(o.metadata)}>
                    {formatMetadata(o.metadata)}
                  </td>
                  <td className="p-4 font-body-md text-slate-subtext whitespace-nowrap">{formatDateTime(o.created_at)}</td>
                  <td className="p-4 font-body-md text-slate-subtext whitespace-nowrap">{formatDateTime(o.paid_at)}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_STYLE[o.status] ?? ""}`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {o.status === "pending" && (
                      <button
                        onClick={() => handleMarkPaid(o)}
                        disabled={markingId === o.id || isPending}
                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary-container/10 text-primary-container hover:bg-primary-container hover:text-white transition-colors disabled:opacity-60 whitespace-nowrap"
                      >
                        {markingId === o.id ? "Đang lưu..." : "Đánh dấu đã thanh toán"}
                      </button>
                    )}
                    {rowError[o.id] && <p className="text-error text-xs mt-1 max-w-[180px]">{rowError[o.id]}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">search_off</span>
            <p className="font-body-lg text-slate-subtext">Không tìm thấy giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
