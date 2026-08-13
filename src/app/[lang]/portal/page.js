import Link from "next/link";
import { getMyCourses } from "@/lib/queries/subscriptions";
import { getSessionProfile } from "@/lib/queries/profiles";

export default async function PortalHome({ params }) {
  const { lang } = await params;
  const [courses, { profile }] = await Promise.all([
    getMyCourses(),
    getSessionProfile(),
  ]);

  const totalLessons = courses.reduce((s, c) => s + c.lessonsCount, 0);
  const completedLessons = courses.reduce((s, c) => s + c.completedCount, 0);
  const certificates = courses.filter((c) => c.progress === 100).length;
  const firstName = profile?.full_name?.split(" ").slice(-1)[0] ?? "";

  // Course to feature in "Tiếp tục học": the in-progress (not finished,
  // has lessons) course with the most recent activity — completing a
  // lesson, or enrollment date if nothing's been completed yet.
  const continueCourse = courses
    .filter((c) => c.lessonsCount > 0 && c.progress < 100)
    .sort((a, b) => (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? ""))[0];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="glass-card p-6 md:p-8 rounded-xl">
        <h1 className="font-headline-section text-headline-section-mobile text-ink-text mb-2">
          Chào mừng trở lại{firstName ? `, ${firstName}` : ""}! 👋
        </h1>
        <p className="font-body-lg text-slate-subtext">
          {courses.length > 0
            ? `Bạn đang theo học ${courses.length} khóa. Tiếp tục hành trình học AI của bạn.`
            : "Bạn chưa đăng ký khóa học nào. Khám phá các khóa học để bắt đầu."}
        </p>
      </div>

      {/* Continue Learning hero */}
      {continueCourse && (
        <div className="section-blue-banner rounded-xl p-6 md:p-8 text-pure-white">
          <p className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-white/70 mb-2">
            Tiếp tục học
          </p>
          <h2 className="font-headline-sub text-headline-sub mb-1">{continueCourse.title}</h2>
          {continueCourse.nextLessonTitle && (
            <p className="font-body-md text-white/80 mb-4">{continueCourse.nextLessonTitle}</p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-white/70">
                  {continueCourse.completedCount}/{continueCourse.lessonsCount} bài
                </span>
                <span className="font-bold">{continueCourse.progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${continueCourse.progress}%` }}
                />
              </div>
            </div>
            <Link
              href={
                continueCourse.nextLessonId
                  ? `/${lang}/portal/bai-hoc/${continueCourse.nextLessonId}`
                  : `/${lang}/khoa-hoc/${continueCourse.slug}`
              }
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-visun-orange text-white px-6 py-3 rounded-full font-button-text text-button-text text-sm hover:scale-105 hover:bg-sunset transition-all active:scale-95"
            >
              Tiếp tục học
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {[
          { icon: "school", label: "Khóa học", value: String(courses.length) },
          { icon: "check_circle", label: "Hoàn thành", value: `${completedLessons}/${totalLessons}` },
          { icon: "menu_book", label: "Bài học", value: String(totalLessons) },
          { icon: "emoji_events", label: "Chứng chỉ", value: String(certificates) },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 sm:p-6 rounded-xl text-center">
            <span className="material-symbols-outlined text-3xl text-primary-container mb-2">{stat.icon}</span>
            <div className="text-2xl font-black text-ink-text">{stat.value}</div>
            <div className="font-body-md text-slate-subtext text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div>
        <h2 className="font-headline-sub text-headline-sub text-ink-text mb-6">Khóa học của tôi</h2>

        {courses.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <span className="material-symbols-outlined text-5xl text-primary-container/30">school</span>
            <p className="font-headline-sub text-headline-sub text-ink-text mt-4 mb-2">
              Chưa có khóa học nào
            </p>
            <p className="font-body-md text-slate-subtext mb-6">
              Khám phá thư viện khóa học AI và bắt đầu hành trình của bạn.
            </p>
            <Link
              href={`/${lang}/khoa-hoc`}
              className="inline-flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-base">explore</span>
              Khám phá khóa học
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={
                  course.nextLessonId
                    ? `/${lang}/portal/bai-hoc/${course.nextLessonId}`
                    : `/${lang}/khoa-hoc/${course.slug}`
                }
                className="block group"
              >
                <div className="glass-card rounded-xl overflow-hidden hover:border-primary-container/30 transition-all duration-300">
                  <div className="h-32 bg-surface-container flex items-center justify-center overflow-hidden">
                    {course.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-5xl text-primary-container/30 group-hover:text-primary-container/60 transition-colors">school</span>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-headline-sub text-headline-sub text-ink-text group-hover:text-primary-container transition-colors text-sm">
                      {course.title}
                    </h3>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-body-md text-slate-subtext text-xs">
                          {course.completedCount}/{course.lessonsCount} bài
                        </span>
                        <span className="font-button-text text-button-text text-primary-container text-xs">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-mist-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-container rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    {course.progress === 100 ? (
                      <div className="flex items-center gap-2 text-xs font-button-text text-green-600">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Đã hoàn thành
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-body-md text-slate-subtext">
                        <span className="material-symbols-outlined text-sm text-primary-container">play_circle</span>
                        Tiếp tục học
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
