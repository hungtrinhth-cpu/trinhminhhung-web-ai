"use client";

import { useState } from "react";
import { mockTransactions } from "@/lib/mock-data";

const STATUS_LABELS = { paid: "Đã thanh toán", pending: "Chờ xử lý", failed: "Thất bại" };
const STATUS_STYLES = {
  paid: "bg-primary-container/10 text-primary-container",
  pending: "bg-secondary/10 text-secondary",
  failed: "bg-error/10 text-error",
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = mockTransactions.filter((tx) => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.course.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || tx.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const total = mockTransactions.length;
  const paid = mockTransactions.filter((t) => t.status === "paid").length;
  const pending = mockTransactions.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">Giao dịch</h1>
      </div>

      {/* Stats Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: `Tổng: ${total} GD`, color: "bg-ink-text/5 text-ink-text border-ink-text/10" },
          { label: `Đã thanh toán: ${paid}`, color: "bg-primary-container/5 text-primary-container border-primary-container/10" },
          { label: `Chờ: ${pending}`, color: "bg-secondary/5 text-secondary border-secondary/10" },
        ].map((chip) => (
          <div key={chip.label} className={`px-4 py-2 rounded-full border flex items-center gap-2 font-label-eyebrow text-label-eyebrow uppercase ${chip.color}`}>
            {chip.label}
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] glass-card flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle">
          <span className="material-symbols-outlined text-slate-subtext/60">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm giao dịch..."
            className="bg-transparent flex-1 font-body-md text-ink-text placeholder:text-slate-subtext/40 focus:outline-none"
          />
        </div>
        {/* w-full sm:w-auto: stretch to full width when it wraps on mobile */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto glass-card px-4 py-2 rounded-xl border border-border-subtle font-body-md text-ink-text focus:outline-none focus:border-primary-container bg-white"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="paid">Đã thanh toán</option>
          <option value="pending">Chờ xử lý</option>
          <option value="failed">Thất bại</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filtered.map((tx) => (
          <div key={tx.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary-container/20 transition-all">
            <div className="flex-1 space-y-1 min-w-0">
              <p className="font-label-eyebrow text-label-eyebrow text-slate-subtext/50 uppercase">ID: #{tx.id}</p>
              <p className="font-headline-sub text-headline-sub text-ink-text text-sm truncate">{tx.name}</p>
              <p className="font-body-md text-slate-subtext text-xs truncate">{tx.course} • {tx.time} — {tx.date}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <p className="text-lg font-black text-ink-text">{tx.amount.toLocaleString("vi-VN")}đ</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_STYLES[tx.status]}`}>
                {STATUS_LABELS[tx.status]}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">search_off</span>
            <p className="font-body-lg text-slate-subtext">Không tìm thấy giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
