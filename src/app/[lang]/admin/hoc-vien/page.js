import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionProfile } from "@/lib/queries/profiles";
import { getAllEnrollments, getEnrollmentDashboardStats } from "@/lib/queries/enrollments";

const STATUS_LABEL = { pending: "Chờ xử lý", paid: "Đã thanh toán", failed: "Thất bại" };
const STATUS_STYLE = {
  pending: "text-yellow-700 bg-yellow-50",
  paid: "text-green-700 bg-green-50",
  failed: "text-red-700 bg-red-50",
};

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
}

// Manual grouping instead of toLocaleString("vi-VN") — avoids the same
// server/browser ICU-data hydration mismatch class documented in
// TransactionsClient.js's formatAmount().
function formatVND(n) {
  const v = Math.round(Number(n) || 0);
  return `${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
}

export default async function AdminStudentsPage({ params }) {
  const { lang } = await params;
  const { profile } = await getSessionProfile();
  if (profile?.role !== "admin") {
    redirect(`/${lang}/admin`);
  }

  const [enrollments, stats] = await Promise.all([getAllEnrollments(), getEnrollmentDashboardStats()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
          Học viên
        </h1>
        <p className="font-body-md text-slate-subtext mt-1">
          Danh sách học viên đã đăng ký khóa học, trạng thái thanh toán và tiến độ học.
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {[
          { label: "Tổng học viên (đã TT)", value: String(stats.totalStudents) },
          { label: "Enrollment: Đã TT / Chờ / Thất bại", value: `${stats.byStatus.paid} / ${stats.byStatus.pending} / ${stats.byStatus.failed}` },
          {
            label: "Conversion checkout→paid",
            value: stats.checkoutConversion.pct === null ? "—" : `${stats.checkoutConversion.pct}%`,
            sub: `${stats.checkoutConversion.paidOrders}/${stats.checkoutConversion.totalOrders} đơn`,
          },
          { label: "Tiến độ học trung bình", value: stats.avgProgress === null ? "—" : `${stats.avgProgress}%` },
        ].map((k) => (
          <div key={k.label} className="glass-card rounded-xl p-4 sm:p-6 space-y-1">
            <p className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">{k.label}</p>
            <p className="text-2xl font-black text-ink-text">{k.value}</p>
            {k.sub && <p className="text-xs text-slate-subtext">{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Revenue by course */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border-subtle">
          <h3 className="font-headline-sub text-headline-sub text-ink-text">Doanh thu theo khóa học</h3>
        </div>
        {stats.revenueByCourse.length === 0 ? (
          <p className="p-6 font-body-md text-slate-subtext/60 text-sm">Chưa có doanh thu.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-slate-subtext text-xs uppercase tracking-wide">
                  <th className="p-4 font-bold">Khóa học</th>
                  <th className="p-4 font-bold">Học viên đã TT</th>
                  <th className="p-4 font-bold">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {stats.revenueByCourse.map((c) => (
                  <tr key={c.courseId} className="border-b border-border-subtle last:border-0">
                    <td className="p-4 text-ink-text">{c.title}</td>
                    <td className="p-4 text-slate-subtext">{c.paidCount}</td>
                    <td className="p-4 text-ink-text font-bold">{formatVND(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {enrollments.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">group</span>
            <p className="font-body-lg text-slate-subtext">Chưa có học viên nào đăng ký khóa học</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-slate-subtext text-xs uppercase tracking-wide">
                  <th className="p-4 font-bold">Học viên</th>
                  <th className="p-4 font-bold">Khóa học</th>
                  <th className="p-4 font-bold">Trạng thái</th>
                  <th className="p-4 font-bold">Tiến độ</th>
                  <th className="p-4 font-bold">Ngày đăng ký</th>
                  <th className="p-4 font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id} className="border-b border-border-subtle last:border-0 hover:bg-mist-bg transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-ink-text">{e.studentName}</div>
                      <div className="text-xs text-slate-subtext">{e.studentEmail}</div>
                    </td>
                    <td className="p-4 text-ink-text">{e.courseTitle}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[e.paymentStatus] ?? ""}`}>
                        {STATUS_LABEL[e.paymentStatus] ?? e.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      {e.totalLessons > 0 ? (
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <div className="w-20 h-1.5 bg-mist-bg rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-primary-container rounded-full"
                              style={{ width: `${e.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-subtext shrink-0">
                            {e.completedLessons}/{e.totalLessons} ({e.progress}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-subtext/60">Chưa có dữ liệu</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-subtext text-xs">{formatDate(e.createdAt)}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/${lang}/admin/hoc-vien/${e.userId}`}
                        className="text-primary-container hover:underline text-xs font-bold whitespace-nowrap"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
