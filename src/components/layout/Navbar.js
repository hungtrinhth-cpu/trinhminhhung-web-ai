"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ConsultModal from "@/components/ui/ConsultModal";

export default function Navbar({ dict, lang, mode = "public" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showConsult, setShowConsult] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "vi" ? "en" : "vi";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    window.location.href = newPath;
  };

  if (mode === "admin") {
    return (
      <nav className="fixed top-0 w-full z-50 bg-glass-bg backdrop-blur-md border-b border-border-subtle shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 mx-auto max-w-[1440px]">
          <div className="flex items-center gap-3">
            <Link href={`/${lang}`} className="font-headline-sub text-headline-sub font-black text-ink-text">
              Hung Trinh AI
            </Link>
            <span className="font-label-eyebrow text-label-eyebrow text-primary-container border border-primary-container/30 bg-primary-container/10 px-2 py-0.5 rounded-full uppercase">
              CRM Admin
            </span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Link href={`/${lang}/admin`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
              Tổng quan
            </Link>
            <Link href={`/${lang}/admin/leads`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
              Quản lý CRM
            </Link>
            <Link href={`/${lang}/admin/transactions`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
              Giao dịch
            </Link>
            <Link href={`/${lang}/admin/blog`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/${lang}`} className="font-button-text text-button-text text-slate-subtext hover:text-ink-text transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              Xem website
            </Link>
            <button className="bg-ink-text text-white px-4 py-2 rounded-full font-button-text text-button-text hover:opacity-80 transition-opacity flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>
    );
  }

  if (mode === "portal") {
    return (
      <nav className="fixed top-0 w-full z-50 bg-glass-bg backdrop-blur-md border-b border-border-subtle shadow-sm">
        <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 mx-auto max-w-[1440px]">
          <div className="flex items-center gap-3">
            <Link href={`/${lang}`} className="font-headline-sub text-headline-sub font-black text-ink-text">
              Hung Trinh AI
            </Link>
            <span className="font-label-eyebrow text-label-eyebrow text-secondary border border-secondary/30 bg-secondary/10 px-2 py-0.5 rounded-full uppercase">
              Học Viên
            </span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Link href={`/${lang}/portal`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
              Khóa học của tôi
            </Link>
            <Link href={`/${lang}/khoa-hoc`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
              Khám phá
            </Link>
            <Link href={`/${lang}/blog`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container/30 cursor-pointer hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-hung.jpg" alt="Hùng Trịnh" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
    <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
      scrolled
        ? "bg-white/90 backdrop-blur-xl border-border-subtle shadow-lg shadow-black/5"
        : "bg-glass-bg backdrop-blur-md border-transparent"
    }`}>
      <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 mx-auto max-w-[1440px]">
        <Link href={`/${lang}`} className="font-headline-sub text-headline-sub font-black text-ink-text">
          Hung Trinh AI
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href={`/${lang}`} className="font-button-text text-button-text uppercase tracking-widest text-primary-container border-b-2 border-primary-container pb-1">
            {dict?.navigation?.home ?? "TRANG CHỦ"}
          </Link>
          <Link href={`/${lang}#about`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
            {dict?.navigation?.about ?? "VỀ TÔI"}
          </Link>
          {/* Courses dropdown */}
          <div className="relative group">
            <button className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors flex items-center gap-1">
              {dict?.navigation?.courses ?? "KHÓA ĐÀO TẠO AI"}
              <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-200">expand_more</span>
            </button>

            {/* Dropdown panel */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-50">
              {/* Arrow notch */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-border-subtle shadow-sm" />
              {/* Menu card */}
              <div className="bg-white rounded-xl shadow-xl shadow-black/10 border border-border-subtle overflow-hidden mt-2">
                {[
                  { label: "ĐÀO TẠO DOANH NGHIỆP", href: `/${lang}/khoa-hoc` },
                  { label: "KHOÁ HỌC AI CHO CÁ NHÂN", href: `/${lang}/khoa-hoc` },
                  { label: "KHOÁ HỌC E-LEARNING", href: `/${lang}/khoa-hoc` },
                  { label: "HỌC LIỆU SỐ", href: `/${lang}/tai-lieu` },
                ].map((item, i) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-5 py-4 font-button-text text-button-text text-ink-text hover:text-primary-container hover:bg-primary-container/5 transition-all duration-150 group/item ${i < 3 ? "border-b border-border-subtle" : ""}`}
                  >
                    <span className="w-0.5 h-5 bg-primary-container rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href={`/${lang}/blog`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
            {dict?.navigation?.blogs ?? "BLOG"}
          </Link>
          <Link href={`/${lang}/tai-lieu`} className="font-button-text text-button-text uppercase tracking-widest text-ink-text hover:text-primary-container transition-colors">
            {dict?.navigation?.resources ?? "TÀI LIỆU"}
          </Link>
          <button
            onClick={() => setShowConsult(true)}
            className="font-button-text text-button-text uppercase tracking-widest transition-colors px-4 py-2 rounded-full border border-visun-blue/30 hover:bg-visun-blue hover:text-white"
            style={{ color: "#1A56A8" }}
          >
            NHẬN TƯ VẤN
          </button>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleLang} className="hidden md:inline font-button-text text-button-text opacity-60 hover:opacity-100">
            {lang === "vi" ? "EN | VI" : "VI | EN"}
          </button>
          <Link href={`/${lang}/portal`} className="bg-primary-container text-white px-6 py-3 rounded-full font-button-text text-button-text hover:scale-105 transition-transform duration-300 active:scale-95">
            {dict?.navigation?.portal ?? "VÀO CỔNG HỌC VIÊN"}
          </Link>
        </div>
      </div>

    </nav>
    <ConsultModal isOpen={showConsult} onClose={() => setShowConsult(false)} />
    </>
  );
}
