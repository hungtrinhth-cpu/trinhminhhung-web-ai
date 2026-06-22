"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const sidebarItems = [
  { icon: "dashboard", label: "Tổng quan", href: "" },
  { icon: "school", label: "Khóa học của tôi", href: "/khoa-hoc" },
  { icon: "smart_toy", label: "AI Trợ giảng", href: "/ai-chat" },
  { icon: "emoji_events", label: "Chứng chỉ", href: "/chung-chi" },
  { icon: "settings", label: "Cài đặt", href: "/cai-dat" },
];

export default function PortalLayout({ children }) {
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang;

  return (
    <div className="flex min-h-screen bg-mist-bg">
      {/* Sidebar */}
      <aside className="w-[280px] bg-pure-white border-r border-border-subtle flex flex-col shrink-0 fixed top-0 left-0 h-full z-40 hidden md:flex">
        <div className="px-6 py-6 border-b border-border-subtle">
          <Link href={`/${lang}`} className="font-headline-sub text-headline-sub font-black text-ink-text block mb-1">
            Hung Trinh AI
          </Link>
          <span className="font-label-eyebrow text-label-eyebrow text-primary-container uppercase">Cổng Học Viên</span>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {sidebarItems.map((item) => {
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

      {/* Main Content */}
      <main className="flex-1 md:ml-[280px] overflow-y-auto min-h-screen">
        <header className="sticky top-0 z-30 bg-pure-white/80 backdrop-blur-md border-b border-border-subtle px-8 py-4 flex items-center justify-between">
          <h2 className="font-headline-sub text-headline-sub text-ink-text">Cổng Học Viên</h2>
          <Link
            href={`/${lang}`}
            className="font-button-text text-button-text text-slate-subtext hover:text-primary-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Trang chủ
          </Link>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
