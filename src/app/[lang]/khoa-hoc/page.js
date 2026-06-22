import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

export const metadata = {
  title: "Khóa Đào Tạo AI - Hung Trinh AI",
  description: "Những chương trình được thiết kế riêng biệt để chuyển hóa tư duy và kỹ năng ứng dụng AI thực tiễn.",
};

const courses = [
  {
    slug: "ai-for-leaders",
    icon: "psychology",
    badge: "ADVANCED",
    title: "AI For Leaders: Tư duy chiến lược",
    desc: "Dành cho cấp quản lý muốn tích hợp AI vào quy trình vận hành và tối ưu hóa hiệu suất đội ngũ.",
    lessons: 12,
    price: "2.990.000đ",
    duration: "6 tuần",
    level: "Nâng cao",
  },
  {
    slug: "chatgpt-prompt-engineering",
    icon: "smart_toy",
    badge: "POPULAR",
    title: "Làm chủ ChatGPT & Prompt Engineering",
    desc: "Kỹ thuật đặt câu hỏi chuyên sâu để biến AI thành trợ lý đắc lực trong mọi lĩnh vực công việc.",
    lessons: 8,
    price: "1.490.000đ",
    duration: "4 tuần",
    level: "Trung cấp",
  },
  {
    slug: "generative-ai-marketing",
    icon: "brush",
    badge: "CREATIVE",
    title: "Generative AI trong Marketing & Design",
    desc: "Ứng dụng Midjourney, Canva AI và các công cụ sáng tạo để đột phá hình ảnh thương hiệu.",
    lessons: 15,
    price: "1.990.000đ",
    duration: "5 tuần",
    level: "Mọi cấp độ",
  },
  {
    slug: "ai-agent-automation",
    icon: "precision_manufacturing",
    badge: "NEW",
    title: "Tự Động Hóa Doanh Nghiệp Nhờ AI Agent",
    desc: "Giải pháp tối ưu hóa vận hành, cắt giảm 40% chi phí nhân sự và nhân đôi hiệu suất làm việc.",
    lessons: 10,
    price: "499.000đ",
    duration: "3 giờ (Webinar)",
    level: "SME Owner",
  },
];

export default async function CoursesPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../dictionaries/${lang}.json`);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {courses.map((course) => (
              <Link key={course.slug} href={`/${lang}/khoa-hoc/${course.slug}`} className="block">
                <div className="glass-card p-8 rounded-xl flex flex-col group hover:border-primary-container/50 transition-all duration-500 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">{course.icon}</span>
                    </div>
                    <Badge>{course.badge}</Badge>
                  </div>
                  <h3 className="font-headline-sub text-headline-sub mb-4 group-hover:text-primary-container transition-colors">{course.title}</h3>
                  <p className="font-body-md text-slate-subtext mb-8 flex-grow">{course.desc}</p>
                  <hr className="border-border-subtle mb-6" />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <span className="font-button-text text-button-text text-ink-text">{course.lessons} Bài học</span>
                      <span className="font-body-md text-slate-subtext">•</span>
                      <span className="font-body-md text-slate-subtext">{course.duration}</span>
                    </div>
                    <span className="font-headline-sub text-primary-container">{course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
