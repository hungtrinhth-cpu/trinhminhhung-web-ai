"use client";

export default function ZaloPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-6"
      style={{ animation: "fadeIn 0.3s ease-out" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass-card w-full max-w-[520px] rounded-2xl relative p-10 shadow-2xl flex flex-col items-center"
        style={{ animation: "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-text opacity-40 hover:opacity-100 transition-opacity p-2"
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Success Icon */}
        <div className="mb-5 w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text uppercase text-center mb-3">
          ĐĂNG KÝ THÀNH CÔNG!
        </h2>

        {/* Description */}
        <p className="font-body-lg text-slate-subtext text-center max-w-[380px] mb-8 leading-relaxed">
          Quà tặng đã được gửi vào email của bạn. Hãy tham gia nhóm Zalo cộng đồng AI SME để nhận lịch học tập và giao lưu trực tiếp cùng anh Hùng Trịnh.
        </p>

        {/* QR Code */}
        <div className="mb-8 p-4 rounded-xl border border-primary-container/20 bg-white/50 shadow-inner group">
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
            <span className="material-symbols-outlined text-7xl text-primary-container/30">qr_code_2</span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="#"
          className="w-full py-4 px-8 bg-primary-container text-white font-button-text text-button-text uppercase rounded-full text-center shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">groups</span>
          THAM GIA NHÓM ZALO CỘNG ĐỒNG
        </a>

        {/* Footer label */}
        <p className="mt-5 font-label-eyebrow text-label-eyebrow text-slate-subtext/50 uppercase tracking-widest">
          AI SME COMMUNITY • HUNG TRINH AI
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.9) translateY(20px); opacity: 0 } to { transform: scale(1) translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
