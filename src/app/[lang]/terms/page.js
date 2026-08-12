import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Điều Khoản Dịch Vụ - Hung Trinh AI",
  description: "Điều khoản dịch vụ khi sử dụng website và khóa học của Hung Trinh AI.",
};

export default async function TermsPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../dictionaries/${lang}.json`);
  const t = dict.default?.terms ?? {};

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        <section className="max-w-3xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="text-center mb-12">
            <Badge>{t.badge ?? "PHÁP LÝ"}</Badge>
            <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text mt-6 mb-4">
              {t.title ?? "Điều Khoản Dịch Vụ"}
            </h1>
            <p className="font-body-md text-slate-subtext text-sm">
              {t.updated_at}
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 md:p-12 space-y-10">
            <p className="font-body-lg text-slate-subtext">{t.intro}</p>

            {(t.sections ?? []).map((s, i) => (
              <div key={i} className="space-y-3">
                <h2 className="font-headline-sub text-headline-sub text-ink-text">{s.heading}</h2>
                <p className="font-body-md text-slate-subtext leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
