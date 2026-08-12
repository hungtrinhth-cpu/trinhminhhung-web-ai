import Navbar from "@/components/layout/Navbar";
import FooterComp from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = (await import(`../../dictionaries/${lang}.json`)).default;
  const h = dict.hero;
  const c = dict.courses;
  const b = dict.cta_banner;
  const a = dict.about;

  return (
    <>
      <Navbar dict={dict} lang={lang} />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <header className="relative min-h-screen flex items-center md:items-end pt-32 overflow-hidden hero-gradient">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop grid grid-cols-1 md:grid-cols-10 h-full overflow-hidden">

            {/* Hero Left */}
            <div className="md:col-span-6 flex flex-col justify-center pb-12 md:pb-24 z-10">
              <p className="hero-eyebrow font-label-eyebrow text-label-eyebrow text-primary-container mb-6 tracking-[0.2em] uppercase">
                {h.eyebrow}
              </p>
              <h1 className="hero-headline font-headline-hero text-[28px] sm:text-headline-hero-mobile md:text-headline-hero text-ink-text leading-tight mb-4 md:mb-8">
                {h.line1}<span className="text-visun-orange">+</span><br />
                {h.line2}<span className="text-visun-orange">+</span><br />
                {h.line3}<span className="text-visun-orange">+</span><br />
                {h.line4}<span className="text-visun-orange">+</span>
              </h1>
              <p className="hero-sub font-body-lg text-slate-subtext max-w-lg mb-6 md:mb-10 leading-relaxed border-l-2 border-primary-container pl-6">
                {h.sub}
              </p>
              <div className="hero-cta flex flex-col sm:flex-row flex-wrap gap-4">
                <Button variant="primary" className="w-full sm:w-auto">{h.cta_primary}</Button>
                <Button variant="secondary" className="w-full sm:w-auto">{h.cta_secondary}</Button>
              </div>
            </div>

            {/* Hero Right (Portrait) */}
            <div className="hero-portrait md:col-span-4 relative flex items-end justify-end min-h-[260px] sm:min-h-[380px] md:min-h-[420px]">
              <div className="hero-float relative w-full h-full flex items-end justify-end overflow-hidden md:overflow-visible md:translate-y-0">
                <div className="absolute bottom-0 right-0 w-full md:w-[120%] h-[80%] bg-primary-container/5 rounded-tl-[100px] -z-10" />
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

          <div className="hero-cta absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-40 z-20">
            <span className="font-label-eyebrow text-label-eyebrow text-ink-text uppercase tracking-widest">{dict.navigation.scroll}</span>
            <div className="w-px h-8 bg-ink-text/30 animate-bounce" />
          </div>
        </header>

        {/* ── Courses ── */}
        <section className="py-16 md:py-section-gap bg-pure-white" id="khoa-hoc">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <AnimateIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text mb-4">
                  {c.title}
                </h2>
                <p className="font-body-md text-slate-subtext max-w-md">
                  {c.desc}
                </p>
              </div>
              <a className="font-button-text text-button-text text-primary-container flex items-center gap-2 hover:translate-x-2 transition-transform whitespace-nowrap" href="#">
                {c.view_all} <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </AnimateIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {c.items.map((course, i) => (
                <AnimateIn key={course.badge} delay={i * 100}>
                  <div className={`glass-card p-8 rounded-xl flex flex-col group hover:border-visun-orange/40 hover:-translate-y-2 hover:shadow-xl hover:shadow-visun-orange/10 transition-all duration-500 h-full ${course.featured ? "border-visun-blue/20 shadow-xl shadow-visun-blue/5" : ""}`}>
                    <div className="w-14 h-14 rounded-lg bg-visun-blue/10 flex items-center justify-center mb-6 text-visun-blue group-hover:scale-110 group-hover:bg-visun-blue/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-3xl">{course.icon}</span>
                    </div>
                    <span className="font-label-eyebrow text-label-eyebrow text-visun-orange mb-2">{course.badge}</span>
                    <h3 className="font-headline-sub text-headline-sub mb-4 group-hover:text-visun-blue transition-colors duration-300">{course.title}</h3>
                    <p className="font-body-md text-slate-subtext mb-8 flex-grow">{course.desc}</p>
                    <hr className="border-border-subtle mb-6" />
                    <div className="flex justify-between items-center">
                      <span className="font-button-text text-button-text text-ink-text">{course.lessons} {c.lessons_label}</span>
                      <button className="w-10 h-10 rounded-full bg-visun-orange/10 text-visun-orange flex items-center justify-center group-hover:bg-visun-orange group-hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">north_east</span>
                      </button>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="section-blue-banner py-14 md:py-24">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <AnimateIn className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
              <div className="max-w-xl">
                <p className="font-label-eyebrow text-label-eyebrow text-sunrise uppercase tracking-[0.2em] mb-4">
                  {b.eyebrow}
                </p>
                <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-pure-white leading-tight mb-4">
                  {b.title}
                </h2>
                <p className="font-body-lg text-pure-white/70 leading-relaxed">
                  {b.desc}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Button variant="primary" className="whitespace-nowrap">{b.cta_primary}</Button>
                <a
                  href="#khoa-hoc"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-button-text text-button-text border-2 border-white/30 text-white px-10 py-5 hover:border-white hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                >
                  {b.cta_secondary}
                </a>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* ── About ── */}
        <section className="py-section-gap bg-mist-bg overflow-hidden" id="about">
          <div className="container mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

              <AnimateIn delay={0}>
                <div className="relative overflow-hidden md:overflow-visible">
                  <div className="aspect-square rounded-2xl overflow-hidden glass-card p-4 relative z-10 hover:scale-[1.02] transition-transform duration-500">
                    <div
                      className="w-full h-full bg-cover bg-center bg-top rounded-xl"
                      style={{ backgroundImage: "url('/anh-hung.jpg')" }}
                    />
                  </div>
                  <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-visun-blue/20 rounded-full -z-0 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-visun-orange/5 rounded-full blur-3xl -z-0" />
                </div>
              </AnimateIn>

              <AnimateIn delay={150}>
                <div className="flex flex-col">
                  <span className="font-label-eyebrow text-3xl font-bold text-visun-orange mb-4 tracking-[0.2em] uppercase">{a.eyebrow}</span>
                  <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text mb-8 leading-tight">
                    {a.title}
                  </h2>
                  <div className="space-y-6">
                    <p className="font-body-lg text-slate-subtext leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(a.bio1) }}
                    />
                    <p className="font-body-lg text-slate-subtext leading-relaxed">
                      {a.bio2}
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-8">
                      {[
                        { value: a.stat1_value, label: a.stat1_label },
                        { value: a.stat2_value, label: a.stat2_label },
                      ].map((stat) => (
                        <div key={stat.label} className="group overflow-hidden">
                          <div
                            className="text-headline-section font-black text-visun-blue mb-1 group-hover:scale-110 transition-transform duration-300 inline-block"
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

      <FooterComp dict={dict} lang={lang} />
    </>
  );
}
