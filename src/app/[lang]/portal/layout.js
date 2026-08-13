"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useParams } from "next/navigation";

const sidebarItems = [
  { icon: "dashboard", label: "Tổng quan", href: "" },
  { icon: "school", label: "Khóa học của tôi", href: "/khoa-hoc" },
  { icon: "smart_toy", label: "AI Trợ giảng", href: "/ai-chat", disabled: true },
  { icon: "emoji_events", label: "Chứng chỉ", href: "/chung-chi", disabled: true },
  { icon: "settings", label: "Cài đặt", href: "/cai-dat" },
];

export default function PortalLayout({ children }) {
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-mist-bg overflow-x-hidden">
      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside className="w-[280px] bg-pure-white border-r border-border-subtle flex flex-col shrink-0 fixed top-0 left-0 h-full z-40 hidden md:flex">
        <div className="px-6 py-6 border-b border-border-subtle">
          <Link href={`/${lang}`} className="font-headline-sub text-headline-sub font-black text-ink-text block mb-1">
            Hung Trinh AI
          </Link>
          <span className="font-label-eyebrow text-label-eyebrow text-primary-container uppercase">Cổng Học Viên</span>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {sidebarItems.map((item) => {
            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  title="Sắp ra mắt"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-body-md text-slate-subtext/40 cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wide">Sắp ra mắt</span>
                </div>
              );
            }
            const href = `/${lang}/portal${item.href}`;
            const isActive = pathname === href || (item.href === "" && pathname === `/${lang}/portal`);
            return (
              <Link
                key={item.label}
                href={href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-body-md transition-all ${
                  isActive
                    ? "bg-primary-container/10 text-primary-container font-bold"
                    : "text-slate-subtext hover:bg-primary-container/5 hover:text-primary-container"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary-container rounded-r-full" />
                )}
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <div className="glass-card p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/30 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-hung.jpg" alt="Hùng Trịnh" className="w-full h-full object-cover object-top" />
            </div>
            <div className="min-w-0">
              <p className="font-button-text text-sm text-ink-text truncate">Anh Minh Hùng</p>
              <p className="font-body-md text-xs text-slate-subtext">Học viên</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Drawer overlay ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink-text/40" />

          {/* Drawer panel */}
          <aside
            className="absolute top-0 left-0 h-full w-[280px] bg-pure-white flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 border-b border-border-subtle flex items-center justify-between">
              <div>
                <Link
                  href={`/${lang}`}
                  className="font-headline-sub text-headline-sub font-black text-ink-text block mb-1"
                  onClick={() => setDrawerOpen(false)}
                >
                  Hung Trinh AI
                </Link>
                <span className="font-label-eyebrow text-label-eyebrow text-primary-container uppercase">Cổng Học Viên</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-subtext hover:bg-mist-bg transition-colors shrink-0"
                aria-label="Đóng menu"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4 flex-1">
              {sidebarItems.map((item) => {
                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      title="Sắp ra mắt"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-body-md text-slate-subtext/40 cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      {item.label}
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wide">Sắp ra mắt</span>
                    </div>
                  );
                }
                const href = `/${lang}/portal${item.href}`;
                const isActive = pathname === href || (item.href === "" && pathname === `/${lang}/portal`);
                return (
                  <Link
                    key={item.label}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-body-md transition-all ${
                      isActive
                        ? "bg-primary-container/10 text-primary-container font-bold"
                        : "text-slate-subtext hover:bg-primary-container/5 hover:text-primary-container"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary-container rounded-r-full" />
                    )}
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border-subtle">
              <div className="glass-card p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/30 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/anh-hung.jpg" alt="Hùng Trịnh" className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="font-button-text text-sm text-ink-text truncate">Anh Minh Hùng</p>
                  <p className="font-body-md text-xs text-slate-subtext">Học viên</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 ml-0 md:ml-[280px] overflow-y-auto min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-pure-white/80 backdrop-blur-md border-b border-border-subtle px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-subtext hover:bg-mist-bg transition-colors shrink-0 mr-3"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          <h2 className="font-headline-sub text-headline-sub text-ink-text truncate min-w-0 flex-1">Cổng Học Viên</h2>

          <Link
            href={`/${lang}`}
            className="font-button-text text-button-text text-slate-subtext hover:text-primary-container transition-colors flex items-center gap-1 shrink-0 ml-3"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>
        </header>

        {/* Content — extra bottom padding on mobile to clear the bottom nav bar */}
        <div className="p-4 md:p-8 pb-20 md:pb-8">{children}</div>
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="flex md:hidden fixed bottom-0 inset-x-0 z-50 bg-pure-white border-t border-border-subtle safe-area-pb">
        {sidebarItems.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-slate-subtext/30"
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span className="text-[9px] font-bold uppercase leading-tight text-center px-0.5 line-clamp-1">
                  {item.label}
                </span>
              </div>
            );
          }
          const href = `/${lang}/portal${item.href}`;
          const isActive = pathname === href || (item.href === "" && pathname === `/${lang}/portal`);
          return (
            <Link
              key={item.label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                isActive ? "text-primary-container" : "text-slate-subtext"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-[9px] font-bold uppercase leading-tight text-center px-0.5 line-clamp-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
