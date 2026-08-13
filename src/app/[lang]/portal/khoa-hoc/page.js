import Link from "next/link";
import { getMyCourses } from "@/lib/queries/subscriptions";

export default async function PortalMyCoursesPage({ params }) {
  const { lang } = await params;
  const courses = await getMyCourses();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline-section text-headline-section-mobile text-ink-text mb-2">
          Khóa học của tôi
        </h1>
        <p className="font-body-lg text-slate-subtext">
          {courses.length > 0
            ? `Bạn đang theo học ${courses.length} khóa.`
            : "Bạn chưa đăng ký khóa học nào."}
        </p>
      </div>

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
  );
}
