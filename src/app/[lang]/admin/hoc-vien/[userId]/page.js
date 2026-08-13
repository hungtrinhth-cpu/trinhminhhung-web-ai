import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSessionProfile } from "@/lib/queries/profiles";
import { getStudentDetail } from "@/lib/queries/enrollments";

const STATUS_LABEL = { pending: "Chờ xử lý", paid: "Đã thanh toán", failed: "Thất bại" };
const STATUS_STYLE = {
  pending: "text-yellow-700 bg-yellow-50",
  paid: "text-green-700 bg-green-50",
  failed: "text-red-700 bg-red-50",
};
const ROLE_LABEL = { admin: "Admin", team_leader: "Trưởng nhóm", sales: "Sales", student: "Học viên" };

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
}

export default async function AdminStudentDetailPage({ params }) {
  const { lang, userId } = await params;
  const { profile } = await getSessionProfile();
  if (profile?.role !== "admin") {
    redirect(`/${lang}/admin`);
  }

  const student = await getStudentDetail(userId);
  if (!student) notFound();

  const { profile: studentProfile, enrollments } = student;

  return (
    <div className="space-y-8">
      <Link
        href={`/${lang}/admin/hoc-vien`}
        className="inline-flex items-center gap-2 text-slate-subtext hover:text-primary-container transition-colors text-sm font-bold"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Quay lại danh sách học viên
      </Link>

      <div className="glass-card rounded-xl p-6 md:p-8">
        <h1 className="font-headline-section text-headline-section-mobile text-ink-text mb-1">
          {studentProfile.full_name || studentProfile.email}
        </h1>
        <p className="font-body-md text-slate-subtext">{studentProfile.email}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <span className="text-slate-subtext">
            Vai trò: <span className="font-bold text-ink-text">{ROLE_LABEL[studentProfile.role] ?? studentProfile.role}</span>
          </span>
          <span className="text-slate-subtext">
            Tham gia: <span className="font-bold text-ink-text">{formatDate(studentProfile.created_at)}</span>
          </span>
        </div>
      </div>

      <div>
        <h2 className="font-headline-sub text-headline-sub text-ink-text mb-4">
          Khóa học đã đăng ký ({enrollments.length})
        </h2>

        {enrollments.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">school</span>
            <p className="font-body-lg text-slate-subtext">Học viên chưa đăng ký khóa học nào</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-slate-subtext text-xs uppercase tracking-wide">
                  <th className="p-4 font-bold">Khóa học</th>
                  <th className="p-4 font-bold">Trạng thái</th>
                  <th className="p-4 font-bold">Tiến độ</th>
                  <th className="p-4 font-bold">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id} className="border-b border-border-subtle last:border-0">
                    <td className="p-4 text-ink-text font-bold">{e.courseTitle}</td>
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
