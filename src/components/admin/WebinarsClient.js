"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateWebinar } from "@/app/[lang]/admin/webinars/actions";
import WebinarFormModal from "./WebinarFormModal";

const STATUS_LABEL = { draft: "Nháp", published: "Đã đăng", closed: "Đã đóng" };
const STATUS_STYLE = {
  draft: "text-yellow-700 bg-yellow-50",
  published: "text-green-700 bg-green-50",
  closed: "text-slate-500 bg-slate-100",
};

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
}

function formatPrice(p) {
  return Number(p ?? 0).toLocaleString("vi-VN") + "đ";
}

export default function WebinarsClient({ initialWebinars }) {
  const router = useRouter();
  const [webinars, setWebinars] = useState(initialWebinars);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingWebinar, setEditingWebinar] = useState(null);

  function refresh() {
    startTransition(() => router.refresh());
  }

  function openCreate() {
    setModalMode("create");
    setEditingWebinar(null);
    setModalOpen(true);
  }

  function openEdit(webinar) {
    setModalMode("edit");
    setEditingWebinar(webinar);
    setModalOpen(true);
  }

  async function handleStatusChange(webinar, status) {
    setWebinars((prev) => prev.map((w) => (w.id === webinar.id ? { ...w, status } : w)));
    const res = await updateWebinar(webinar.id, { status });
    if (res?.error) refresh();
  }

  function handleSaved() {
    setModalOpen(false);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
            Quản lý Webinar
          </h1>
          <p className="font-body-md text-slate-subtext mt-1">
            Tạo, sửa và đổi trạng thái webinar hiển thị trên trang public
          </p>
        </div>
        <button
          onClick={openCreate}
          disabled={isPending}
          className="bg-primary-container text-white px-5 py-3 rounded-full font-button-text text-button-text uppercase tracking-wider shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tạo webinar mới
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tiêu đề</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Slug</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Lịch</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Giá</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Chỗ</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Trạng thái</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {webinars.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-mist-bg transition-colors"
                >
                  <td className="p-4 font-body-md text-ink-text font-bold max-w-[220px] truncate">{w.title}</td>
                  <td className="p-4 font-body-md text-slate-subtext">{w.slug}</td>
                  <td className="p-4 font-body-md text-slate-subtext whitespace-nowrap">
                    {formatDate(w.scheduled_at)}
                  </td>
                  <td className="p-4 font-body-md text-slate-subtext whitespace-nowrap">{formatPrice(w.price)}</td>
                  <td className="p-4 font-body-md text-slate-subtext whitespace-nowrap">
                    {w.seats_left ?? "—"}/{w.seats_total ?? "—"}
                  </td>
                  <td className="p-4">
                    <select
                      value={w.status}
                      disabled={isPending}
                      onChange={(e) => handleStatusChange(w, e.target.value)}
                      className={`border border-border-subtle rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-primary-container ${STATUS_STYLE[w.status] ?? ""}`}
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openEdit(w)}
                      className="w-9 h-9 rounded-full bg-mist-bg text-slate-subtext hover:text-primary-container hover:bg-primary-container/10 transition-colors inline-flex items-center justify-center"
                      title="Sửa webinar"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {webinars.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">event</span>
            <p className="font-body-lg text-slate-subtext">Chưa có webinar nào</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <WebinarFormModal
          mode={modalMode}
          webinar={editingWebinar}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
