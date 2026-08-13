"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMyProfile } from "../actions";

export default function PortalSettingsClient({ profile, email }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    setSaving(true);
    try {
      const res = await updateMyProfile({ full_name: fullName });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err?.message || "Có lỗi không xác định, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-headline-section text-headline-section-mobile text-ink-text mb-2">
          Cài đặt
        </h1>
        <p className="font-body-lg text-slate-subtext">Thông tin tài khoản của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Email</label>
          <input
            type="email"
            value={email ?? ""}
            disabled
            className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-slate-subtext"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Họ tên</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
          />
        </div>

        {error && (
          <div className="text-error text-sm text-center bg-error/5 border border-error/20 rounded-lg py-2 px-3">
            {error}
          </div>
        )}
        {saved && !error && (
          <div className="text-primary-container text-sm text-center bg-primary-container/5 border border-primary-container/20 rounded-lg py-2 px-3">
            Đã lưu.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
