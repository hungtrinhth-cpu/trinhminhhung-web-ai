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
        {/*
          Fix #3: items-center on mobile so content isn't bottom-crushed on short viewports;
          items-end on md+ restores the original desktop look with portrait touching the bottom.
        */}
        <header className="relative min-h-screen flex items-center md:items-end pt-32 overflow-hidden hero-gradient">
          {/*
            Fix #4 (outer): overflow-hidden on the grid container stops the 120% wide
            decorative bg div from creating horizontal scroll on mobile.
          */}
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop grid grid-cols-1 md:grid-cols-10 h-full overflow-hidden">

            {/* Hero Left */}
            <div className="md:col-span-6 flex flex-col justify-center pb-12 md:pb-24 z-10">
              <p className="hero-eyebrow font-label-eyebrow text-label-eyebrow text-primary-container mb-6 tracking-[0.2em] uppercase">
                Expert AI Solutions &amp; Training
              </p>
              {/*
                Fix #5: start at 28px on tiny screens (320–374px), scale up to
                text-headline-hero-mobile (42px) at sm, and text-headline-hero (60px) at md.
                Reduced mb-8 → mb-4 md:mb-8 to recover vertical space on small phones.
              */}
              <h1 className="hero-headline font-headline-hero text-[28px] sm:text-headline-hero-mobile md:text-headline-hero text-ink-text leading-tight mb-4 md:mb-8">
                ĐÀO TẠO<span className="text-primary-container">+</span><br />
                CHUYỂN GIAO<span className="text-primary-container">+</span><br />
                VẬN HÀNH<span className="text-primary-container">+</span><br />
                AI<span className="text-primary-container">+</span>
              </h1>
              {/*
                Reduced mb-10 → mb-6 md:mb-10 to recover vertical space on mobile.
              */}
              <p className="hero-sub font-body-lg text-slate-subtext max-w-lg mb-6 md:mb-10 leading-relaxed border-l-2 border-primary-container pl-6">
                Nâng tầm năng lực doanh nghiệp và cá nhân thông qua việc làm chủ công nghệ trí tuệ nhân tạo. Giải pháp tinh gọn, hiệu quả và đón đầu xu hướng toàn cầu.
              </p>
              {/*
                Fix #7: stack buttons vertically on mobile (flex-col), revert to row on sm+.
                Each Button receives w-full sm:w-auto so it fills its column slot on mobile
                but returns to auto-width on larger screens.
              */}
              <div className="hero-cta flex flex-col sm:flex-row flex-wrap gap-4">
                <Button variant="primary" className="w-full sm:w-auto">BẮT ĐẦU NGAY</Button>
                <Button variant="secondary" className="w-full sm:w-auto">TÌM HIỂU THÊM</Button>
              </div>
            </div>

            {/* Hero Right (Portrait) */}
            {/*
              Fix #1: min-h-[320px] sm:min-h-[420px] prevents the column from collapsing
              to zero height on mobile (grid-cols-1 stacks text above, portrait below).
              The portrait is still shown on mobile — it just needs a declared height.
            */}
            <div className="hero-portrait md:col-span-4 relative flex items-end justify-end min-h-[320px] sm:min-h-[420px]">
              {/*
                Fix #1 cont. + Fix #4: remove translate-y-12 on mobile (was pushing image
                below the viewport). Add overflow-hidden to contain the w-[120%] decorative
                div on mobile, then allow overflow on md+ for the full visual effect.
              */}
              <div className="hero-float relative w-full h-full flex items-end justify-end overflow-hidden md:overflow-visible md:translate-y-0">
                {/*
                  Fix #4: decorative bg is w-full on mobile (no horizontal overflow),
                  expands to w-[120%] only on md+ where the wider grid column can absorb it.
                */}
                <div className="absolute bottom-0 right-0 w-full md:w-[120%] h-[80%] bg-primary-container/5 rounded-tl-[100px] -z-10" />
                {/*
                  Fix #2: add w-full to className so the image constrains to its container
                  width (prevents the 600px intrinsic width from exceeding mobile viewport).
                  sizes prop tells the browser the correct render width at each breakpoint
                  so it serves the right source from the srcSet.
                */}
                <Image
                  alt="Chân dung Anh Hùng Trịnh"
                  className="w-full max-h-[90vh] object-contain object-bottom drop-shadow-2xl"
                  src="/anh-hung.jpg"
                  width={600}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/*
            Fix #6: z-20 ensures the indicator renders above stacked content when the
            hero is taller than the viewport on mobile. hidden sm:flex hides the indicator
            on very small screens where it would be unreachable or clip behind the portrait.
          */}
          <div className="hero-cta absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-40 z-20">
            <span className="font-label-eyebrow text-label-eyebrow text-ink-text uppercase tracking-widest">Cuộn xuống</span>
            <div className="w-px h-8 bg-ink-text/30 animate-bounce" />
          </div>
        </header>

        {/* ── Courses ── */}
        <section className="py-section-gap bg-pure-white" id="khoa-hoc">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            {/*
              Fix #9: items-start on mobile so the section title left-aligns correctly
              in single-column flex layout; items-end on md+ aligns it with the link baseline.
            */}
            <AnimateIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
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

            {/*
              Fix #8: add sm:grid-cols-2 intermediate breakpoint so tablets in portrait
              mode show 2 cards instead of 1. Desktop (lg+) gets 3 columns.
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
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
            {/*
              Fix #10: gap-10 on mobile (40px) reduces excessive whitespace between the
              image and text blocks; restores gap-20 (80px) on md+ for desktop breathing room.
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

              <AnimateIn delay={0}>
                {/*
                  Fix #11: overflow-hidden on mobile clips the -top-10/-left-10 decorative
                  elements that bleed outside the container, preventing horizontal scroll.
                  md:overflow-visible restores the decorative overflow on desktop where the
                  outer section's overflow-hidden already contains the bleed within the page.
                */}
                <div className="relative overflow-hidden md:overflow-visible">
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
                        /*
                          Fix #12: overflow-hidden on the stat div prevents the scale-110
                          hover transform from causing layout reflow that pushes sibling elements.
                          will-change-transform is set inline to promote the animated child
                          to its own compositor layer.
                        */
                        <div key={stat.label} className="group overflow-hidden">
                          <div
                            className="text-headline-section font-black text-primary-container mb-1 group-hover:scale-110 transition-transform duration-300 inline-block"
                            style={{ willChange: "transform" }}
                          >
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
