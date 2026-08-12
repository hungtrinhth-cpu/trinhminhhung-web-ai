import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Câu Hỏi Thường Gặp - Hung Trinh AI",
  description: "Giải đáp nhanh những thắc mắc phổ biến về khóa học và dịch vụ của Hung Trinh AI.",
};

export default async function FaqPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../dictionaries/${lang}.json`);
  const t = dict.default?.faq ?? {};

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        <section className="max-w-3xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="text-center mb-12">
            <Badge>{t.badge ?? "HỎI ĐÁP"}</Badge>
            <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text mt-6 mb-4">
              {t.title ?? "Câu Hỏi Thường Gặp"}
            </h1>
            <p className="font-body-lg text-slate-subtext max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {(t.items ?? []).map((item, i) => (
              <details key={i} className="glass-card rounded-xl p-6 group">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-headline-sub text-headline-sub text-ink-text">
                  {item.q}
                  <span className="material-symbols-outlined text-primary-container shrink-0 transition-transform group-open:rotate-45">
                    add
                  </span>
                </summary>
                <p className="font-body-md text-slate-subtext leading-relaxed mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
