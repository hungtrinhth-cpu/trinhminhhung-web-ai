import Link from "next/link";

export default function Footer({ lang }) {
  return (
    <footer className="w-full bg-ink-text text-pure-white">

      {/* Newsletter bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-headline-sub text-headline-sub text-pure-white">Đăng ký nhận kiến thức AI miễn phí</p>
            <p className="font-body-md text-pure-white/50 mt-1">Mỗi tuần một bài học AI thực chiến, gửi thẳng vào hộp thư của bạn.</p>
          </div>
          <div className="relative w-full md:w-[380px] shrink-0">
            <input
              className="w-full bg-white/5 border border-white/15 rounded-full px-6 py-4 font-body-md text-pure-white placeholder:text-white/30 focus:outline-none focus:border-primary-container transition-all"
              placeholder="Email của bạn"
              type="email"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-container text-white px-6 py-2.5 rounded-full font-button-text text-button-text hover:scale-105 transition-transform active:scale-95">
              GỬI
            </button>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Col 1 — Brand */}
          <div className="space-y-5">
            <div className="font-headline-sub text-headline-sub font-black text-pure-white">Hung Trinh AI</div>
            <p className="font-body-md text-pure-white/50 leading-relaxed max-w-xs">
              Kiến tạo tương lai cùng trí tuệ nhân tạo. Đào tạo, chuyển giao và vận hành AI chuyên nghiệp cho doanh nghiệp SME Việt Nam.
            </p>
            <div className="flex gap-3 pt-2">
              {/* Facebook */}
              <a href="#" title="Facebook" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200" style={{ background: "#1877F2" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" title="Instagram" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200" style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" title="TikTok" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200" style={{ background: "#010101" }}>
                <svg width="16" height="18" viewBox="0 0 24 27" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" title="LinkedIn" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200" style={{ background: "#0A66C2" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" title="YouTube" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200" style={{ background: "#FF0000" }}>
                <svg width="20" height="14" viewBox="0 0 24 17" fill="white"><path d="M23.495 2.205a3.02 3.02 0 00-2.127-2.136C19.505 0 12 0 12 0S4.495 0 2.632.069a3.02 3.02 0 00-2.127 2.136C0 4.07 0 8 0 8s0 3.93.505 5.795a3.02 3.02 0 002.127 2.136C4.495 16.5 12 16.5 12 16.5s7.505 0 9.368-.569a3.02 3.02 0 002.127-2.136C24 11.93 24 8 24 8s0-3.93-.505-5.795zM9.545 11.57V4.43L15.818 8l-6.273 3.57z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Dịch vụ */}
          <div className="space-y-4">
            <h4 className="font-button-text text-button-text text-primary-container uppercase tracking-widest">Dịch vụ</h4>
            {[
              { label: "Đào tạo AI nội bộ", href: `/${lang}/khoa-hoc` },
              { label: "Chuyển giao công nghệ", href: `/${lang}/khoa-hoc` },
              { label: "Tư vấn chiến lược AI", href: `/${lang}/khoa-hoc` },
              { label: "Xây dựng trợ lý AI", href: `/${lang}/khoa-hoc` },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block font-body-md text-pure-white/50 hover:text-pure-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Hỗ trợ */}
          <div className="space-y-4">
            <h4 className="font-button-text text-button-text text-primary-container uppercase tracking-widest">Hỗ trợ</h4>
            {[
              { label: "Chính sách bảo mật", href: `/${lang}/privacy` },
              { label: "Điều khoản dịch vụ", href: `/${lang}/terms` },
              { label: "Liên hệ hỗ trợ", href: `/${lang}/contact` },
              { label: "FAQ", href: `/${lang}/faq` },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block font-body-md text-pure-white/50 hover:text-pure-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Col 4 — Liên hệ */}
          <div className="space-y-4">
            <h4 className="font-button-text text-button-text text-primary-container uppercase tracking-widest">Hung Trinh AI</h4>
            {[
              { icon: "location_on", text: "Hà Nội, Việt Nam" },
              { icon: "mail", text: "contact.visun@gmail.com" },
              { icon: "phone", text: "0986 315 286" },
              { icon: "schedule", text: "Thứ 2 – Thứ 6, 8:00 – 17:00" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5 shrink-0">{item.icon}</span>
                <span className="font-body-md text-pure-white/50">{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body-md text-pure-white/30 text-sm">© 2026 Hung Trinh AI. All rights reserved.</p>
          <p className="font-label-eyebrow text-label-eyebrow text-pure-white/20 uppercase tracking-widest">
            AI Training • Consulting • Automation
          </p>
        </div>
      </div>

    </footer>
  );
}
