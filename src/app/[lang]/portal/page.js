import Link from "next/link";

const myCourses = [
  {
    id: "chatgpt-prompt",
    title: "Làm chủ ChatGPT & Prompt Engineering",
    progress: 62,
    totalLessons: 8,
    completedLessons: 5,
    nextLesson: "Bài 6: Prompt nâng cao cho Business",
    image: "smart_toy",
  },
  {
    id: "ai-for-leaders",
    title: "AI For Leaders: Tư duy chiến lược",
    progress: 25,
    totalLessons: 12,
    completedLessons: 3,
    nextLesson: "Bài 4: Phân tích dữ liệu với AI",
    image: "psychology",
  },
  {
    id: "webinar-ai-agent",
    title: "Webinar: Tự Động Hóa Nhờ AI Agent",
    progress: 100,
    totalLessons: 4,
    completedLessons: 4,
    nextLesson: null,
    image: "precision_manufacturing",
  },
];

export default async function PortalHome({ params }) {
  const { lang } = await params;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="glass-card p-8 rounded-xl">
        <h1 className="font-headline-section text-headline-section-mobile text-ink-text mb-2">
          Chào mừng trở lại! 👋
        </h1>
        <p className="font-body-lg text-slate-subtext">
          Tiếp tục hành trình học AI của bạn. Bạn đã hoàn thành 62% khóa học hiện tại.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {[
          { icon: "school", label: "Khóa học", value: "3" },
          { icon: "check_circle", label: "Hoàn thành", value: "12/24" },
          { icon: "timer", label: "Giờ học", value: "18h" },
          { icon: "emoji_events", label: "Chứng chỉ", value: "1" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 rounded-xl text-center">
            <span className="material-symbols-outlined text-3xl text-primary-container mb-2">{stat.icon}</span>
            <div className="text-2xl font-black text-ink-text">{stat.value}</div>
            <div className="font-body-md text-slate-subtext text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div>
        <h2 className="font-headline-sub text-headline-sub text-ink-text mb-6">Khóa học của tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {myCourses.map((course) => (
            <Link
              key={course.id}
              href={`/${lang}/portal/bai-hoc/${course.id}`}
              className="block group"
            >
              <div className="glass-card rounded-xl overflow-hidden hover:border-primary-container/30 transition-all duration-300">
                <div className="h-32 bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary-container/30 group-hover:text-primary-container/60 transition-colors">
                    {course.image}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-headline-sub text-headline-sub text-ink-text group-hover:text-primary-container transition-colors text-sm">
                    {course.title}
                  </h3>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-body-md text-slate-subtext text-xs">
                        {course.completedLessons}/{course.totalLessons} bài
                      </span>
                      <span className="font-button-text text-button-text text-primary-container text-xs">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-mist-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {course.nextLesson ? (
                    <div className="flex items-center gap-2 text-xs font-body-md text-slate-subtext">
                      <span className="material-symbols-outlined text-sm text-primary-container">play_circle</span>
                      {course.nextLesson}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-button-text text-green-600">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Đã hoàn thành
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
