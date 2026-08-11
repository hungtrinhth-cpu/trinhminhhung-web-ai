"use client";

import { useState, useEffect } from "react";
import { updateLead } from "@/app/[lang]/admin/leads/actions";

export default function LeadDetailModal({ isOpen, lead, lists, stages, onClose, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lead) {
      setForm({
        first_name: lead.first_name ?? "",
        last_name: lead.last_name ?? "",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        list_id: lead.list_id ?? "",
        stage_id: lead.stage_id ?? "",
      });
      setError(null);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!form.first_name.trim()) {
      setError("Vui lòng nhập tên khách hàng");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await updateLead(lead.id, form);
    setSaving(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    onSaved?.();
    onClose();
  }

  const field =
    "w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary-container";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-text/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between sticky top-0 bg-white">
          <h2 className="font-headline-sub text-headline-sub font-bold text-ink-text">
            Chi tiết khách hàng
          </h2>
          <button onClick={onClose} className="text-slate-subtext hover:text-ink-text">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Tên</label>
              <input className={field} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
            </div>
            <div>
              <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Họ (tùy chọn)</label>
              <input className={field} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Email</label>
            <input className={field} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>

          <div>
            <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Số điện thoại</label>
            <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>

          <div>
            <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">folder</span> Danh sách
            </label>
            <select className={field} value={form.list_id} onChange={(e) => set("list_id", e.target.value)}>
              <option value="">— Chưa có danh sách —</option>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Giai đoạn</label>
            <select className={field} value={form.stage_id} onChange={(e) => set("stage_id", e.target.value)}>
              <option value="">— Chưa phân loại —</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="font-button-text text-button-text text-sm text-slate-subtext hover:text-ink-text px-4 py-2">
            Hủy
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="bg-primary-container text-white px-6 py-2.5 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
