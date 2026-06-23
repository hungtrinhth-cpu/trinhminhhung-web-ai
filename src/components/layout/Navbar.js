"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ConsultModal from "@/components/ui/ConsultModal";

export default function Navbar({ dict, lang, mode = "public" }) {
  const pathname = usePathname();
  // SSR-safe initializer: read actual scroll position on first paint
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 20
  );
  const [showConsult, setShowConsult] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close courses dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdownOpen]);

  // Lock body scroll when any mobile menu is open
  useEffect(() => {
    const anyOpen = menuOpen || adminMenuOpen || portalMenuOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, adminMenuOpen, portalMenuOpen]);

  const toggleLang = () => {
    const newLang = lang === "vi" ? "en" : "vi";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    window.location.href = newPath;
  };

  const closeMenu = () => setMenuOpen(false);
  const closeAdminMenu = () => setAdminMenuOpen(false);
  const closePortalMenu = () => setPortalMenuOpen(false);

  // ─────────────────────────────────────────────
  // ADMIN MODE
  // ─────────────────────────────────────────────
  if (mode === "admin") {
    return (
      <>
        <nav className="fixed top-0 w-full z-50 bg-glass-bg backdrop-blur-md border-b border-border-subtle shadow-sm">
          <div className="flex justify-between items-center w-full px-6 py-4 mx-auto max-w-[1440px]">
            {/* Logo + badge */}
            <div className="flex items-center gap-3">
              <Link
                href={`/${lang}`}
                className="font-headline-sub text-headline-sub font-black text-ink-text whitespace-nowrap"
              >
                Hung Trinh AI
              </Link>
              <span className="font-label-eyebrow text-label-eyebrow text-primary-container border border-primary-container/30 bg-primary-container/10 px-2 py-0.5 rounded-full uppercase">
                CRM Admin
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex gap-6 items-center">
              <Link
                href={`/${lang}/admin`}
                className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors"
              >
                Tổng quan
              </Link>
              <Link
                href={`/${lang}/admin/leads`}
                className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors"
              >
                Quản lý CRM
              </Link>
              <Link
                href={`/${lang}/admin/transactions`}
                className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors"
              >
                Giao dịch
              </Link>
              <Link
                href={`/${lang}/admin/blog`}
                className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors"
              >
                Blog
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                href={`/${lang}`}
                className="hidden md:flex font-button-text text-button-text text-slate-subtext hover:text-ink-text transition-colors items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Xem website
              </Link>
              <button className="hidden md:flex bg-ink-text text-white px-4 py-2 rounded-full font-button-text text-button-text hover:opacity-80 transition-opacity items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Đăng xuất
              </button>
              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-black/5 transition"
                onClick={() => setAdminMenuOpen((o) => !o)}
                aria-label="Menu"
                aria-expanded={adminMenuOpen}
              >
                <span className="material-symbols-outlined text-[24px] text-ink-text">
                  {adminMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Admin mobile drawer */}
        {adminMenuOpen && (
          <div className="fixed inset-0 top-[65px] z-40 bg-white/95 backdrop-blur-xl overflow-y-auto md:hidden flex flex-col px-6 py-8 gap-2">
            <Link
              href={`/${lang}/admin`}
              onClick={closeAdminMenu}
              className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
            >
              Tổng quan
            </Link>
            <Link
              href={`/${lang}/admin/leads`}
              onClick={closeAdminMenu}
              className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
            >
              Quản lý CRM
            </Link>
            <Link
              href={`/${lang}/admin/transactions`}
              onClick={closeAdminMenu}
              className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
            >
              Giao dịch
            </Link>
            <Link
              href={`/${lang}/admin/blog`}
              onClick={closeAdminMenu}
              className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
            >
              Blog
            </Link>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={`/${lang}`}
                onClick={closeAdminMenu}
                className="font-button-text text-button-text text-slate-subtext hover:text-ink-text transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Xem website
              </Link>
              <button className="bg-ink-text text-white px-4 py-3 rounded-full font-button-text text-button-text hover:opacity-80 transition-opacity flex items-center justify-center gap-1 w-full">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────
  // PORTAL MODE
  // ─────────────────────────────────────────────
  if (mode === "portal") {
    return (
      <>
        <nav className="fixed top-0 w-full z-50 bg-glass-bg backdrop-blur-md border-b border-border-subtle shadow-sm">
          <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 mx-auto max-w-[1440px]">
            {/* Logo + badge */}
            <div className="flex items-center gap-3">
              <Link
                href={`/${lang}`}
                className="font-headline-sub text-headline-sub font-black text-ink-text whitespace-nowrap"
              >
                Hung Trinh AI
              </Link>
              <span className="font-label-eyebrow text-label-eyebrow text-secondary border border-secondary/30 bg-secondary/10 px-2 py-0.5 rounded-full uppercase">
                Học Viên
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex gap-6 items-center">
              <Link
                href={`/${lang}/portal`}
                className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors"
              >
                Khóa học của tôi
              </Link>
              <Link
                href={`/${lang}/khoa-hoc`}
                className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors"
              >
                Khám phá
              </Link>
              <Link
                href={`/${lang}/blog`}
                className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors"
              >
                Blog
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container/30 cursor-pointer hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/anh-hung.jpg"
                  alt="Hùng Trịnh"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-black/5 transition"
                onClick={() => setPortalMenuOpen((o) => !o)}
                aria-label="Menu"
                aria-expanded={portalMenuOpen}
              >
                <span className="material-symbols-outlined text-[24px] text-ink-text">
                  {portalMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Portal mobile drawer */}
        {portalMenuOpen && (
          <div className="fixed inset-0 top-[65px] z-40 bg-white/95 backdrop-blur-xl overflow-y-auto md:hidden flex flex-col px-6 py-8 gap-2">
            <Link
              href={`/${lang}/portal`}
              onClick={closePortalMenu}
              className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
            >
              Khóa học của tôi
            </Link>
            <Link
              href={`/${lang}/khoa-hoc`}
              onClick={closePortalMenu}
              className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
            >
              Khám phá
            </Link>
            <Link
              href={`/${lang}/blog`}
              onClick={closePortalMenu}
              className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
            >
              Blog
            </Link>
          </div>
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────
  // PUBLIC MODE
  // ─────────────────────────────────────────────
  const courseItems = [
    { label: "ĐÀO TẠO DOANH NGHIỆP", href: `/${lang}/khoa-hoc` },
    { label: "KHOÁ HỌC AI CHO CÁ NHÂN", href: `/${lang}/khoa-hoc` },
    { label: "KHOÁ HỌC E-LEARNING", href: `/${lang}/khoa-hoc` },
    { label: "HỌC LIỆU SỐ", href: `/${lang}/tai-lieu` },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-border-subtle shadow-lg shadow-black/5"
            : "bg-glass-bg backdrop-blur-md border-transparent"
        }`}
      >
        <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-5 mx-auto max-w-[1440px]">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="font-headline-sub text-headline-sub font-black text-ink-text whitespace-nowrap"
          >
            Hung Trinh AI
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            <Link
              href={`/${lang}`}
              className="font-button-text text-button-text uppercase tracking-wider text-primary-container border-b-2 border-primary-container pb-1 whitespace-nowrap"
            >
              {dict?.navigation?.home ?? "TRANG CHỦ"}
            </Link>
            <Link
              href={`/${lang}#about`}
              className="font-button-text text-button-text uppercase tracking-wider text-ink-text hover:text-primary-container transition-colors whitespace-nowrap"
            >
              {dict?.navigation?.about ?? "VỀ TÔI"}
            </Link>

            {/* Courses dropdown — controlled state for touch + keyboard support */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="font-button-text text-button-text uppercase tracking-wider text-ink-text hover:text-primary-container transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {dict?.navigation?.courses ?? "KHÓA ĐÀO TẠO AI"}
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown panel */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 transition-all duration-200 z-[60] ${
                  dropdownOpen
                    ? "visible opacity-100 translate-y-0 pointer-events-auto"
                    : "invisible opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                {/* Arrow notch */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-border-subtle shadow-sm" />
                {/* Menu card */}
                <div className="bg-white rounded-xl shadow-xl shadow-black/10 border border-border-subtle overflow-hidden mt-2">
                  {courseItems.map((item, i) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 px-5 py-4 font-button-text text-button-text text-ink-text hover:text-primary-container hover:bg-primary-container/5 transition-all duration-150 group/item ${
                        i < courseItems.length - 1 ? "border-b border-border-subtle" : ""
                      }`}
                    >
                      <span className="w-0.5 h-5 bg-primary-container rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={`/${lang}/blog`}
              className="font-button-text text-button-text uppercase tracking-wider text-ink-text hover:text-primary-container transition-colors whitespace-nowrap"
            >
              {dict?.navigation?.blogs ?? "BLOG"}
            </Link>
            <Link
              href={`/${lang}/tai-lieu`}
              className="font-button-text text-button-text uppercase tracking-wider text-ink-text hover:text-primary-container transition-colors whitespace-nowrap"
            >
              {dict?.navigation?.resources ?? "THƯ VIỆN"}
            </Link>
            <button
              onClick={() => setShowConsult(true)}
              className="font-button-text text-button-text uppercase tracking-widest transition-all px-5 py-2 rounded-full bg-visun-orange text-white hover:bg-sunset"
            >
              ĐĂNG KÝ TƯ VẤN
            </button>
          </div>

          {/* Right-side actions — always visible */}
          <div className="flex items-center gap-3">
            {/* Language toggle — desktop only */}
            <button
              onClick={toggleLang}
              className="hidden md:inline font-button-text text-button-text opacity-60 hover:opacity-100"
            >
              {lang === "vi" ? "EN | VI" : "VI | EN"}
            </button>

            {/* Portal CTA — responsive label + padding */}
            <Link
              href={`/${lang}/portal`}
              className="hidden sm:inline-block bg-visun-blue text-white rounded-full font-button-text text-button-text hover:bg-deep-blue hover:scale-105 transition-all duration-300 active:scale-95 px-6 py-3 shadow-md shadow-visun-blue/20"
            >
              {dict?.navigation?.portal ?? "VÀO CỔNG HỌC VIÊN"}
            </Link>

            {/* Mobile: NHẬN TƯ VẤN shortcut next to portal */}
            <button
              onClick={() => setShowConsult(true)}
              className="hidden sm:inline-block md:hidden font-button-text text-button-text uppercase px-4 py-2.5 rounded-full border border-visun-blue/30 transition-colors"
              style={{ color: "#1A56A8" }}
              aria-label="Nhận tư vấn"
            >
              TƯ VẤN
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-black/5 transition"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span className="material-symbols-outlined text-[24px] text-ink-text">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — public mode */}
      {menuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 bg-white/95 backdrop-blur-xl overflow-y-auto md:hidden flex flex-col px-6 py-8 gap-2">
          <Link
            href={`/${lang}`}
            onClick={closeMenu}
            className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-primary-container border-b border-border-subtle py-3"
          >
            {dict?.navigation?.home ?? "TRANG CHỦ"}
          </Link>
          <Link
            href={`/${lang}#about`}
            onClick={closeMenu}
            className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
          >
            {dict?.navigation?.about ?? "VỀ TÔI"}
          </Link>

          {/* Courses section — flat list on mobile */}
          <div className="border-b border-border-subtle py-3">
            <p className="font-label-eyebrow text-label-eyebrow text-slate-subtext uppercase tracking-widest mb-3">
              {dict?.navigation?.courses ?? "KHÓA ĐÀO TẠO AI"}
            </p>
            <div className="flex flex-col gap-1 pl-2">
              {courseItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center min-h-[44px] font-button-text text-button-text text-ink-text hover:text-primary-container transition-colors py-2 gap-2"
                >
                  <span className="w-1 h-4 bg-primary-container/40 rounded-full shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={`/${lang}/blog`}
            onClick={closeMenu}
            className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
          >
            {dict?.navigation?.blogs ?? "BLOG"}
          </Link>
          <Link
            href={`/${lang}/tai-lieu`}
            onClick={closeMenu}
            className="flex items-center min-h-[48px] font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors border-b border-border-subtle py-3"
          >
            {dict?.navigation?.resources ?? "THƯ VIỆN"}
          </Link>

          {/* CTA buttons */}
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={() => { closeMenu(); setShowConsult(true); }}
              className="w-full py-4 rounded-full bg-visun-orange text-white font-button-text text-button-text uppercase tracking-widest transition-colors hover:bg-sunset"
            >
              ĐĂNG KÝ TƯ VẤN
            </button>
            <Link
              href={`/${lang}/portal`}
              onClick={closeMenu}
              className="w-full py-4 rounded-full bg-visun-blue text-white font-button-text text-button-text uppercase tracking-widest text-center hover:bg-deep-blue transition-colors"
            >
              {dict?.navigation?.portal ?? "VÀO CỔNG HỌC VIÊN"}
            </Link>
          </div>

          {/* Language toggle at bottom */}
          <div className="mt-auto pt-6">
            <button
              onClick={() => { toggleLang(); closeMenu(); }}
              className="font-button-text text-button-text opacity-60 hover:opacity-100 py-2 transition-opacity"
            >
              {lang === "vi" ? "EN | VI" : "VI | EN"}
            </button>
          </div>
        </div>
      )}

      <ConsultModal isOpen={showConsult} onClose={() => setShowConsult(false)} />
    </>
  );
}
