"use client";

import { useState } from "react";

export default function ConsultModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          source: "Tư vấn chiến lược AI",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gửi thất bại, vui lòng thử lại");
        setSending(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    }
    setSending(false);
  };

  if (!isOpen) return null;

  return (
    /* Backdrop — overflow-y-auto so the card is scrollable when the soft keyboard
       pushes viewport height below the card's natural height.
       pt-[env(safe-area-inset-top,1rem)] guards notch / Dynamic Island in landscape. */
    <div
      className="fixed inset-0 z-[200] bg-black/50 flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto pt-[max(1rem,env(safe-area-inset-top,1rem))]"
      style={{ animation: "fadeIn 0.25s ease-out" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card
          max-h-[calc(100dvh-2rem)] + overflow-y-auto: card itself scrolls on very
          short viewports (dvh accounts for browser chrome and on-screen keyboard).
          flex-col on mobile so left panel stacks above form. */}
      <div
        className="relative w-full max-w-[860px] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto"
        style={{ animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Close button — 44×44 touch target, top edge clear of notch */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-[max(0.75rem,env(safe-area-inset-top,0.75rem))] right-3 z-10 w-11 h-11 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Left panel — compact banner on mobile, full sidebar on md+.
            max-h-[180px] md:max-h-none collapses it on mobile so the form
            is visible without heavy scrolling past a decorative block. */}
        <div className="bg-ink-text md:w-[340px] shrink-0 p-6 md:p-10 flex flex-col justify-between max-h-[180px] md:max-h-none overflow-hidden">
          <div className="space-y-3 md:space-y-6">
            {/* Brand */}
            <div className="font-headline-sub text-headline-sub font-black text-pure-white">
              Hung Trinh AI
            </div>

            <div>
              <p className="font-label-eyebrow text-label-eyebrow text-primary-container uppercase tracking-widest mb-2 md:mb-3">
                Miễn phí · 30 phút
              </p>
              <h2 className="font-headline-section text-headline-section-mobile text-pure-white leading-tight uppercase">
                TƯ VẤN{" "}
                <span className="text-primary-container">CHIẾN LƯỢC</span>{" "}
                AI
              </h2>
            </div>

            {/* Description — hidden on mobile to keep the banner compact */}
            <p className="hidden md:block font-body-lg text-pure-white/60 leading-relaxed">
              Để lại thông tin để nhận cuộc gọi tư vấn trực tiếp từ chuyên gia trong vòng 30 phút.
            </p>
          </div>

          {/* Bullet list — hidden on mobile, shown on md+ sidebar */}
          <ul className="hidden md:flex flex-col space-y-3 mt-8">
            {[
              "Bảo mật thông tin 100%",
              "Không spam quảng cáo",
              "Tư vấn giải pháp miễn phí",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 font-body-md text-pure-white/80">
                <span
                  className="material-symbols-outlined text-primary-container text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 bg-pure-white p-6 md:p-10">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
              <span
                className="material-symbols-outlined text-6xl text-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <h3 className="font-headline-section text-headline-section-mobile text-ink-text">
                Đã nhận thông tin!
              </h3>
              <p className="font-body-lg text-slate-subtext max-w-xs">
                Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút trong giờ làm việc.
              </p>
              {/* py-3.5 → 14px top+bottom = 28px + line-height ≈ 44px+ touch target */}
              <button
                type="button"
                onClick={onClose}
                className="mt-4 bg-primary-container text-white px-8 py-3.5 rounded-full font-button-text text-button-text hover:scale-105 transition-transform"
              >
                Đóng
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-1 h-6 bg-primary-container inline-block mr-3 align-middle rounded-full" />
                <span className="font-headline-sub text-headline-sub text-ink-text align-middle">
                  Thông Tin Liên Hệ
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* min-h-[44px] on inputs ensures tap targets meet HIG / Material minimum */}
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Họ và tên của bạn"
                  className="w-full px-5 py-3.5 min-h-[44px] rounded-xl border border-border-subtle bg-mist-bg font-body-lg text-ink-text placeholder:text-slate-subtext/40 focus:outline-none focus:border-primary-container transition-all"
                />
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="Số điện thoại (Zalo)"
                  className="w-full px-5 py-3.5 min-h-[44px] rounded-xl border border-border-subtle bg-mist-bg font-body-lg text-ink-text placeholder:text-slate-subtext/40 focus:outline-none focus:border-primary-container transition-all"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="Email doanh nghiệp (nếu có)"
                  className="w-full px-5 py-3.5 min-h-[44px] rounded-xl border border-border-subtle bg-mist-bg font-body-lg text-ink-text placeholder:text-slate-subtext/40 focus:outline-none focus:border-primary-container transition-all"
                />
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Lời nhắn (Tùy chọn)..."
                  className="w-full px-5 py-3.5 rounded-xl border border-border-subtle bg-mist-bg font-body-lg text-ink-text placeholder:text-slate-subtext/40 focus:outline-none focus:border-primary-container transition-all resize-none"
                />
                {error && <p className="text-error text-sm text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-ink-text text-white rounded-xl font-button-text text-button-text uppercase tracking-[0.1em] hover:bg-primary-container transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-60"
                >
                  {sending ? "ĐANG GỬI..." : "GỬI THÔNG TIN NGAY"}
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    send
                  </span>
                </button>
                <p className="text-center font-body-md text-slate-subtext/50 text-xs">
                  *Bằng việc gửi thông tin, bạn đồng ý để Hung Trinh AI liên hệ tư vấn.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.93) translateY(16px); opacity: 0 } to { transform: scale(1) translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
