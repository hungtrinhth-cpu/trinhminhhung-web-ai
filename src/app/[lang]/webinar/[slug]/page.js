import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getWebinarBySlug } from "@/lib/queries/webinars";
import { registerForWebinar } from "../../thanh-toan/actions";
import WebinarCurriculum from "./WebinarCurriculum";

const TRACKING_KEYS = ["ref", "utm_source", "utm_medium", "utm_campaign"];

function formatPrice(p) {
  return Number(p ?? 0).toLocaleString("vi-VN") + "đ";
}

function formatDuration(min) {
  if (!min) return "";
  return min % 60 === 0 ? `${min / 60} giờ` : `${min} phút`;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN");
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
  const webinar = await getWebinarBySlug(slug);
  return {
    title: webinar ? `${webinar.title} - Hung Trinh AI` : "Webinar - Hung Trinh AI",
    description: webinar?.subtitle ?? undefined,
  };
}

export default async function WebinarDetailPage({ params, searchParams }) {
  const { lang, slug } = await params;
  const sp = await searchParams;
  const dict = (await import(`../../../../dictionaries/${lang}.json`)).default;
  const webinar = await getWebinarBySlug(slug);

  if (!webinar) {
    notFound();
  }

  const price = Number(webinar.price ?? 0);
  const originalPrice = Number(webinar.original_price ?? 0);
  const discountPct = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : null;
  const highlights = Array.isArray(webinar.highlights) ? webinar.highlights : [];
  const curriculum = Array.isArray(webinar.curriculum) ? webinar.curriculum : [];

  const tracking = pickTracking(sp);
  const currentPath = `/${lang}/webinar/${slug}${buildQueryString(sp)}`;
  const registerAction = registerForWebinar.bind(null, {
    webinarId: webinar.id,
    amount: price,
    lang,
    currentPath,
    tracking,
  });

  const badges = [
    { icon: "schedule", label: formatDuration(webinar.duration_min) },
    { icon: "signal_cellular_alt", label: webinar.level },
    { icon: "videocam", label: webinar.format },
    { icon: "event", label: formatDate(webinar.scheduled_at) },
  ].filter((b) => b.label);

  return (
    <>
      <Navbar dict={dict} lang={lang} />
      <main className="pt-20 bg-pure-white">
        {/* Hero */}
        <section className="bg-mist-bg py-16 px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-7xl mx-auto">
            {/* Badge row */}
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-container/10 text-primary-container font-button-text text-xs border border-primary-container/20">
                  <span className="material-symbols-outlined text-sm">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
              {/* Left */}
              <div className="space-y-6">
                <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text leading-tight">
                  {webinar.title}
                </h1>
                {webinar.subtitle && (
                  <p className="font-body-lg text-slate-subtext leading-relaxed max-w-2xl">
                    {webinar.subtitle}
                  </p>
                )}

                {/* Instructor Card */}
                {webinar.instructor && (
                  <div className="glass-card rounded-xl p-5 flex items-center gap-4 max-w-xl">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-container/20 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/anh-hung.jpg" alt={webinar.instructor} className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <p className="font-headline-sub text-headline-sub text-ink-text">{webinar.instructor}</p>
                      <p className="font-body-md text-slate-subtext">{webinar.instructor_title}</p>
                    </div>
                  </div>
                )}

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-headline-sub text-headline-sub text-ink-text">
                      {dict?.webinar?.learn_what ?? "Bạn sẽ học được gì?"}
                    </h3>
                    <ul className="space-y-2">
                      {highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary-container text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="font-body-lg text-slate-subtext">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                    {webinar.seats_left != null && (
                      <p className="font-body-md text-slate-subtext text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-error">warning</span>
                        {dict?.webinar?.seats_left ?? "Còn"} <strong className="text-error">{webinar.seats_left}</strong> {dict?.webinar?.seats_of ?? "chỗ"}
                        {webinar.seats_total != null && ` / ${webinar.seats_total}`} — {dict?.webinar?.early_bird ?? "Early Bird"}
                      </p>
                    )}
                  </div>

                  {highlights.length > 0 && (
                    <ul className="space-y-2">
                      {highlights.slice(0, 4).map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary-container text-base mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="font-body-md text-slate-subtext text-sm">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <form action={registerAction}>
                    <button
                      type="submit"
                      className="block w-full py-4 bg-primary-container text-white text-center rounded-full font-button-text text-button-text uppercase tracking-[0.1em] shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                    >
                      {dict?.webinar?.register_cta ?? "Đăng ký ngay"} — {formatPrice(price)}
                    </button>
                  </form>

                  <p className="text-center font-body-md text-slate-subtext/50 text-xs">
                    {dict?.webinar?.refund_note ?? "Hoàn tiền 100% trong vòng 24h nếu không hài lòng"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        {curriculum.length > 0 && (
          <section className="py-section-gap px-container-padding-mobile md:px-container-padding-desktop">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text mb-8">
                {dict?.webinar?.curriculum ?? "Chương trình học"}
              </h2>
              <WebinarCurriculum curriculum={curriculum} />
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="bg-ink-text py-16 px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-pure-white">
              {webinar.seats_left != null ? (
                <>
                  {dict?.webinar?.seats_left ?? "Chỉ còn"}{" "}
                  <span className="text-primary-container">
                    {webinar.seats_left} {dict?.webinar?.bottom_cta_title ?? "chỗ — Đừng bỏ lỡ!"}
                  </span>
                </>
              ) : (
                dict?.webinar?.bottom_cta_title ?? "Đừng bỏ lỡ!"
              )}
            </h2>
            <p className="font-body-lg text-pure-white/60">
              {dict?.webinar?.bottom_cta_sub ?? "Giá Early Bird kết thúc khi hết chỗ."}
            </p>
            <form action={registerAction}>
              <button
                type="submit"
                className="inline-block py-5 px-12 bg-primary-container text-white rounded-full font-button-text text-button-text uppercase tracking-[0.15em] shadow-2xl shadow-primary-container/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {dict?.webinar?.register_cta ?? "Đăng ký ngay"} — {formatPrice(price)}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  );
}
