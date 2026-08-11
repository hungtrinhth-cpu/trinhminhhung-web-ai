import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { getCourses } from "@/lib/queries/courses";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Khóa Đào Tạo AI - Hung Trinh AI",
  description: "Những chương trình được thiết kế riêng biệt để chuyển hóa tư duy và kỹ năng ứng dụng AI thực tiễn.",
};

function formatPrice(p) {
  return Number(p ?? 0).toLocaleString("vi-VN") + "đ";
}

export default async function CoursesPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../dictionaries/${lang}.json`);

  const courses = await getCourses();

  const courseIds = courses.map((c) => c.id);
  let lessonCountByCourse = {};
  if (courseIds.length > 0) {
    const supabase = await createClient();
    const { data: lessonRows } = await supabase
      .from("lessons")
      .select("course_id")
      .in("course_id", courseIds);
    for (const l of lessonRows ?? []) {
      lessonCountByCourse[l.course_id] = (lessonCountByCourse[l.course_id] ?? 0) + 1;
    }
  }

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        <section className="max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="text-center mb-16">
            <Badge>KHÓA ĐÀO TẠO</Badge>
            <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text mt-6 mb-4">
              Chương Trình Đào Tạo AI
            </h1>
            <p className="font-body-lg text-slate-subtext max-w-2xl mx-auto">
              Những chương trình được thiết kế riêng biệt để chuyển hóa tư duy và kỹ năng ứng dụng AI thực tiễn cho doanh nghiệp SME Việt Nam.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center max-w-xl mx-auto">
              <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">school</span>
              <p className="font-body-lg text-slate-subtext">Chưa có khóa học nào được đăng.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {courses.map((course) => (
                <Link key={course.slug} href={`/${lang}/khoa-hoc/${course.slug}`} className="block">
                  <div className="glass-card p-8 rounded-xl flex flex-col group hover:border-primary-container/50 transition-all duration-500 h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">school</span>
                      </div>
                      {course.level && <Badge>{course.level}</Badge>}
                    </div>
                    <h3 className="font-headline-sub text-headline-sub mb-4 group-hover:text-primary-container transition-colors">
                      {course.title}
                    </h3>
                    <p className="font-body-md text-slate-subtext mb-8 flex-grow">{course.subtitle}</p>
                    <hr className="border-border-subtle mb-6" />
                    <div className="flex justify-between items-center">
                      <span className="font-button-text text-button-text text-ink-text">
                        {lessonCountByCourse[course.id] ?? 0} Bài học
                      </span>
                      <span className="font-headline-sub text-primary-container">{formatPrice(course.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
