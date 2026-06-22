import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await import(`../../dictionaries/${lang}.json`);

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <header className="relative min-h-screen flex items-end pt-32 overflow-hidden hero-gradient">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop grid grid-cols-1 md:grid-cols-10 h-full">

            {/* Hero Left */}
            <div className="md:col-span-6 flex flex-col justify-center pb-24 z-10">
              <p className="hero-eyebrow font-label-eyebrow text-label-eyebrow text-primary-container mb-6 tracking-[0.2em] uppercase">
                Expert AI Solutions &amp; Training
              </p>
              <h1 className="hero-headline font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text leading-tight mb-8">
                ĐÀO TẠO<span className="text-primary-container">+</span><br />
                CHUYỂN GIAO<span className="text-primary-container">+</span><br />
                VẬN HÀNH<span className="text-primary-container">+</span><br />
                AI<span className="text-primary-container">+</span>
              </h1>
              <p className="hero-sub font-body-lg text-slate-subtext max-w-lg mb-10 leading-relaxed border-l-2 border-primary-container pl-6">
                Nâng tầm năng lực doanh nghiệp và cá nhân thông qua việc làm chủ công nghệ trí tuệ nhân tạo. Giải pháp tinh gọn, hiệu quả và đón đầu xu hướng toàn cầu.
              </p>
              <div className="hero-cta flex flex-wrap gap-4">
                <Button variant="primary">BẮT ĐẦU NGAY</Button>
                <Button variant="secondary">TÌM HIỂU THÊM</Button>
              </div>
            </div>

            {/* Hero Right (Portrait) */}
            <div className="hero-portrait md:col-span-4 relative flex items-end justify-end">
              <div className="hero-float relative w-full h-full flex items-end justify-end translate-y-12 md:translate-y-0">
                <div className="absolute bottom-0 right-0 w-[120%] h-[80%] bg-primary-container/5 rounded-tl-[100px] -z-10" />
                <Image
                  alt="Chân dung Anh Hùng Trịnh"
                  className="max-h-[90vh] object-contain object-bottom drop-shadow-2xl"
                  src="/anh-hung.jpg"
                  width={600}
                  height={800}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hero-cta absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="font-label-eyebrow text-label-eyebrow text-ink-text uppercase tracking-widest">Cuộn xuống</span>
            <div className="w-px h-8 bg-ink-text/30 animate-bounce" />
          </div>
        </header>

        {/* ── Courses ── */}
        <section className="py-section-gap bg-pure-white" id="khoa-hoc">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <AnimateIn className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text mb-4">
                  Khóa đào tạo tiêu biểu
                </h2>
                <p className="font-body-md text-slate-subtext max-w-md">
                  Những chương trình được thiết kế riêng biệt để chuyển hóa tư duy và kỹ năng ứng dụng AI thực tiễn.
                </p>
              </div>
              <a className="font-button-text text-button-text text-primary-container flex items-center gap-2 hover:translate-x-2 transition-transform" href="#">
                XEM TẤT CẢ KHÓA HỌC <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {[
                { icon: "psychology", badge: "ADVANCED", title: "AI For Leaders: Tư duy chiến lược", desc: "Dành cho cấp quản lý muốn tích hợp AI vào quy trình vận hành và tối ưu hóa hiệu suất đội ngũ.", lessons: "12 Bài học", featured: false },
                { icon: "smart_toy", badge: "POPULAR", title: "Làm chủ ChatGPT & Prompt Engineering", desc: "Kỹ thuật đặt câu hỏi chuyên sâu để biến AI thành trợ lý đắc lực trong mọi lĩnh vực công việc.", lessons: "08 Bài học", featured: true },
                { icon: "brush", badge: "CREATIVE", title: "Generative AI trong Marketing & Design", desc: "Ứng dụng Midjourney, Canva AI và các công cụ sáng tạo để đột phá hình ảnh thương hiệu.", lessons: "15 Bài học", featured: false },
              ].map((course, i) => (
                <AnimateIn key={course.badge} delay={i * 100}>
                  <div className={`glass-card p-8 rounded-xl flex flex-col group hover:border-primary-container/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-container/10 transition-all duration-500 h-full ${course.featured ? "border-primary-container/20 shadow-xl shadow-primary-container/5" : ""}`}>
                    <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6 text-primary-container group-hover:scale-110 group-hover:bg-primary-container/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-3xl">{course.icon}</span>
                    </div>
                    <span className="font-label-eyebrow text-label-eyebrow text-primary-container mb-2">{course.badge}</span>
                    <h3 className="font-headline-sub text-headline-sub mb-4 group-hover:text-primary-container transition-colors duration-300">{course.title}</h3>
                    <p className="font-body-md text-slate-subtext mb-8 flex-grow">{course.desc}</p>
                    <hr className="border-border-subtle mb-6" />
                    <div className="flex justify-between items-center">
                      <span className="font-button-text text-button-text text-ink-text">{course.lessons}</span>
                      <button className="w-10 h-10 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center group-hover:bg-primary-container group-hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">north_east</span>
                      </button>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="py-section-gap bg-mist-bg overflow-hidden" id="about">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

              <AnimateIn delay={0}>
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden glass-card p-4 relative z-10 hover:scale-[1.02] transition-transform duration-500">
                    <div
                      className="w-full h-full bg-cover bg-center bg-top rounded-xl"
                      style={{ backgroundImage: "url('/anh-hung.jpg')" }}
                    />
                  </div>
                  <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-primary-container/20 rounded-full -z-0 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-container/5 rounded-full blur-3xl -z-0" />
                </div>
              </AnimateIn>

              <AnimateIn delay={150}>
                <div className="flex flex-col">
                  <span className="font-label-eyebrow text-label-eyebrow text-primary-container mb-4 tracking-[0.2em] uppercase">Về tôi</span>
                  <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text mb-8 leading-tight">
                    Sứ mệnh đồng hành cùng kỷ nguyên trí tuệ nhân tạo
                  </h2>
                  <div className="space-y-6">
                    <p className="font-body-lg text-slate-subtext leading-relaxed">
                      Tôi là <strong>Hung Trinh</strong>, một chuyên gia đào tạo và tư vấn giải pháp AI với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và vận hành doanh nghiệp.
                    </p>
                    <p className="font-body-lg text-slate-subtext leading-relaxed">
                      Mục tiêu của tôi là xóa bỏ rào cản giữa con người và công nghệ, biến những khái niệm AI phức tạp thành các giải pháp thực tế, giúp bất kỳ ai cũng có thể gia tăng năng suất gấp nhiều lần.
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-8">
                      {[
                        { value: "500+", label: "Học viên" },
                        { value: "20+", label: "Dự án chuyển giao" },
                      ].map((stat) => (
                        <div key={stat.label} className="group">
                          <div className="text-headline-section font-black text-primary-container mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {stat.value}
                          </div>
                          <div className="font-button-text text-button-text text-ink-text uppercase opacity-60">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateIn>

            </div>
          </div>
        </section>
      </main>

      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
