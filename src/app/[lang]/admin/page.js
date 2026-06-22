import Link from "next/link";
import { mockStats, mockChartData, mockCampaigns, mockTransactions } from "@/lib/mock-data";

export default async function AdminDashboard({ params }) {
  const { lang } = await params;
  const maxChart = Math.max(...mockChartData.map((d) => d.value));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">Tổng quan</h1>
        <p className="font-body-md text-slate-subtext mt-1">Hung Trinh AI — Tháng 6/2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {Object.values(mockStats).map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-6 space-y-2">
            <p className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">{stat.label}</p>
            <p className="text-2xl font-black text-ink-text">{stat.value}</p>
            <p className={`font-body-md text-sm flex items-center gap-1 ${stat.trend === "up" ? "text-green-600" : "text-error"}`}>
              <span className="material-symbols-outlined text-sm">{stat.trend === "up" ? "trending_up" : "trending_down"}</span>
              {stat.change} so với tháng trước
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-headline-sub text-headline-sub text-ink-text">Doanh thu 6 tháng (triệu đ)</h3>
          <div className="flex items-end gap-2 h-40">
            {mockChartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary-container/80 rounded-t-lg transition-all duration-500 hover:bg-primary-container"
                  style={{ height: `${(d.value / maxChart) * 100}%` }}
                />
                <span className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="glass-card rounded-xl p-6 space-y-5">
          <h3 className="font-headline-sub text-headline-sub text-ink-text">Hiệu suất chiến dịch</h3>
          <div className="space-y-4">
            {mockCampaigns.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-slate-subtext text-sm">{c.name}</span>
                  <span className="font-button-text text-ink-text text-sm">{c.leads} leads</span>
                </div>
                <div className="w-full h-2 bg-mist-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.color} rounded-full transition-all duration-700`}
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle">
          <h3 className="font-headline-sub text-headline-sub text-ink-text">Giao dịch gần nhất</h3>
          <Link href={`/${lang}/admin/transactions`} className="font-button-text text-button-text text-primary-container text-sm hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="divide-y divide-border-subtle">
          {mockTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-mist-bg transition-colors">
              <div>
                <p className="font-button-text text-ink-text text-sm">{tx.name}</p>
                <p className="font-body-md text-slate-subtext text-xs">{tx.course} • {tx.time} {tx.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-button-text text-ink-text">{tx.amount.toLocaleString("vi-VN")}đ</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tx.status === "paid" ? "bg-primary-container/10 text-primary-container" :
                  tx.status === "pending" ? "bg-secondary/10 text-secondary" :
                  "bg-error/10 text-error"
                }`}>
                  {tx.status === "paid" ? "Đã TT" : tx.status === "pending" ? "Chờ" : "Thất bại"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
