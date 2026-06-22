"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useParams } from "next/navigation";

const sidebarItems = [
  { icon: "dashboard", label: "Tổng quan", href: "" },
  { icon: "group", label: "Quản lý CRM", href: "/leads" },
  { icon: "campaign", label: "Chiến dịch & Webinar", href: "/campaigns" },
  { icon: "article", label: "Quản lý nội dung", href: "/blog" },
  { icon: "payments", label: "Giao dịch", href: "/transactions" },
];

export default function AdminLayout({ children }) {
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
          <span className="font-label-eyebrow text-label-eyebrow text-primary-container uppercase">CRM Admin</span>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {sidebarItems.map((item) => {
            const href = `/${lang}/admin${item.href}`;
            const isActive = item.href === "" ? pathname === `/${lang}/admin` : pathname.startsWith(href);
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

        <div className="p-4 border-t border-border-subtle space-y-2">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 px-4 py-2 font-body-md text-slate-subtext hover:text-primary-container transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            Xem website
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 font-body-md text-slate-subtext hover:text-error transition-colors text-sm w-full">
            <span className="material-symbols-outlined text-base">logout</span>
            Đăng xuất
          </button>
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
                <span className="font-label-eyebrow text-label-eyebrow text-primary-container uppercase">CRM Admin</span>
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
                const href = `/${lang}/admin${item.href}`;
                const isActive = item.href === "" ? pathname === `/${lang}/admin` : pathname.startsWith(href);
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

            <div className="p-4 border-t border-border-subtle space-y-2">
              <Link
                href={`/${lang}`}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 px-4 py-2 font-body-md text-slate-subtext hover:text-primary-container transition-colors text-sm"
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                Xem website
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 font-body-md text-slate-subtext hover:text-error transition-colors text-sm w-full">
                <span className="material-symbols-outlined text-base">logout</span>
                Đăng xuất
              </button>
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
            aria-label="Mở menu quản trị"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          {/* Title (mobile only) */}
          <span className="md:hidden font-headline-sub text-headline-sub text-ink-text truncate min-w-0 flex-1">
            CRM Admin
          </span>

          {/* Spacer on desktop so avatar stays right */}
          <div className="hidden md:flex flex-1" />

          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container/30 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anh-hung.jpg" alt="Hùng Trịnh" className="w-full h-full object-cover object-top" />
          </div>
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
