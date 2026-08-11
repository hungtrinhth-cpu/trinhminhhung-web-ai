import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import { getCourseBySlug, getLessons } from "@/lib/queries/courses";
import { registerForCourse } from "../../thanh-toan/actions";

const TRACKING_KEYS = ["ref", "utm_source", "utm_medium", "utm_campaign"];

function formatPrice(p) {
  return Number(p ?? 0).toLocaleString("vi-VN") + "đ";
}

function formatDuration(sec) {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function pickTracking(searchParams) {
  const tracking = {};
  for (const key of TRACKING_KEYS) {
    const value = searchParams?.[key];
    if (typeof value === "string" && value) tracking[key] = value;
  }
  return tracking;
}

function buildQueryString(searchParams) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value === "string" && value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return {
    title: course ? `${course.title} - Hung Trinh AI` : "Khóa học - Hung Trinh AI",
    description: course?.subtitle ?? undefined,
  };
}

export default async function CourseDetailPage({ params, searchParams }) {
  const { lang, slug } = await params;
  const sp = await searchParams;
  const dict = (await import(`../../../../dictionaries/${lang}.json`)).default;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const lessons = await getLessons(course.id);

  const price = Number(course.price ?? 0);
  const originalPrice = Number(course.original_price ?? 0);
  const discountPct = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : null;

  const tracking = pickTracking(sp);
  const currentPath = `/${lang}/khoa-hoc/${slug}${buildQueryString(sp)}`;
  const registerAction = registerForCourse.bind(null, {
    courseId: course.id,
    amount: price,
    lang,
    currentPath,
    tracking,
  });

  return (
    <>
      <Navbar dict={dict} lang={lang} />
      <main className="pt-20 bg-pure-white">
        {/* Hero */}
        <section className="bg-mist-bg py-16 px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-7xl mx-auto">
            {course.level && (
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge>{course.level}</Badge>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
              {/* Left */}
              <div className="space-y-6">
                <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text leading-tight">
                  {course.title}
                </h1>
                {course.subtitle && (
                  <p className="font-body-lg text-slate-subtext leading-relaxed max-w-2xl">
                    {course.subtitle}
                  </p>
                )}
                {course.description && (
                  <p className="font-body-md text-slate-subtext leading-relaxed max-w-2xl whitespace-pre-line">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Right: Sticky Payment Card */}
              <div className="lg:sticky lg:top-28 h-fit">
                <div className="glass-card rounded-xl p-6 border border-primary-container/20 shadow-xl shadow-primary-container/5 space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-black text-primary-container">{formatPrice(price)}</span>
                      {originalPrice > price && (
                        <span className="font-body-md text-slate-subtext line-through mb-1">{formatPrice(originalPrice)}</span>
                      )}
                      {discountPct != null && (
                        <span className="bg-primary-container/10 text-primary-container text-xs font-bold px-2 py-0.5 rounded-full mb-1">-{discountPct}%</span>
                      )}
                    </div>
                    {lessons.length > 0 && (
                      <p className="font-body-md text-slate-subtext text-sm">{lessons.length} bài học</p>
                    )}
                  </div>

                  <form action={registerAction}>
                    <button
                      type="submit"
                      className="block w-full py-4 bg-primary-container text-white text-center rounded-full font-button-text text-button-text uppercase tracking-[0.1em] shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                    >
                      Đăng ký ngay — {formatPrice(price)}
                    </button>
                  </form>

                  <p className="text-center font-body-md text-slate-subtext/50 text-xs">
                    Truy cập trọn đời sau khi thanh toán thành công
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        {lessons.length > 0 && (
          <section className="py-section-gap px-container-padding-mobile md:px-container-padding-desktop">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text mb-8">
                Chương trình học
              </h2>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 px-6 py-4 border border-border-subtle rounded-xl"
                  >
                    <span className="material-symbols-outlined text-xl text-primary-container">play_circle</span>
                    <span className="flex-1 font-body-lg text-ink-text">{lesson.title}</span>
                    {lesson.is_preview && (
                      <span className="text-xs font-bold text-primary-container bg-primary-container/10 px-2 py-1 rounded-full">
                        Xem thử
                      </span>
                    )}
                    <span className="font-body-md text-slate-subtext text-sm">{formatDuration(lesson.duration_sec)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="bg-ink-text py-16 px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-pure-white">
              Sẵn sàng bắt đầu hành trình AI của bạn?
            </h2>
            <p className="font-body-lg text-pure-white/60">Truy cập trọn đời, học theo tốc độ của riêng bạn.</p>
            <form action={registerAction}>
              <button
                type="submit"
                className="inline-block py-5 px-12 bg-primary-container text-white rounded-full font-button-text text-button-text uppercase tracking-[0.15em] shadow-2xl shadow-primary-container/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Đăng ký ngay — {formatPrice(price)}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  );
}
