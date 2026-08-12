import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Liên Hệ - Hung Trinh AI",
  description: "Thông tin liên hệ và hỗ trợ của Hung Trinh AI.",
};

const ZALO_GROUP_URL = "https://zalo.me/g/hungtrinh-ai";

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../dictionaries/${lang}.json`);
  const t = dict.default?.contact ?? {};
  const f = dict.default?.footer ?? {};

  const infoItems = [
    { icon: "location_on", label: t.address_label ?? "Địa chỉ", value: f.address ?? "Hà Nội, Việt Nam" },
    { icon: "mail", label: t.email_label ?? "Email", value: f.email ?? "contact.visun@gmail.com", href: `mailto:${f.email ?? "contact.visun@gmail.com"}` },
    { icon: "phone", label: t.phone_label ?? "Điện thoại", value: f.phone ?? "0986 315 286", href: `tel:${(f.phone ?? "0986315286").replace(/\s/g, "")}` },
    { icon: "schedule", label: t.hours_label ?? "Giờ làm việc", value: f.hours ?? "Thứ 2 – Thứ 6, 8:00 – 17:00" },
  ];

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        <section className="max-w-3xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="text-center mb-12">
            <Badge>{t.badge ?? "LIÊN HỆ"}</Badge>
            <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text mt-6 mb-4">
              {t.title ?? "Liên Hệ Với Chúng Tôi"}
            </h1>
            <p className="font-body-lg text-slate-subtext max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 md:p-12 space-y-8">
            <div>
              <h2 className="font-headline-sub text-headline-sub text-ink-text mb-6">
                {t.info_title ?? "Thông tin liên hệ"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {infoItems.map((item) => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-visun-orange text-[20px] mt-0.5 shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-label-eyebrow text-label-eyebrow text-slate-subtext uppercase tracking-widest">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a href={item.href} className="font-body-md text-ink-text hover:text-visun-orange transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-body-md text-ink-text">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-black/5">
              <a
                href={`mailto:${f.email ?? "contact.visun@gmail.com"}`}
                className="flex-1 text-center bg-visun-blue text-white px-6 py-3.5 rounded-full font-button-text text-button-text hover:bg-deep-blue hover:scale-[1.02] transition-all active:scale-95"
              >
                {t.email_cta ?? "Gửi Email"}
              </a>
              <a
                href={ZALO_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-visun-orange text-white px-6 py-3.5 rounded-full font-button-text text-button-text hover:bg-sunset hover:scale-[1.02] transition-all active:scale-95"
              >
                {t.zalo_cta ?? "Tham gia nhóm Zalo"}
              </a>
            </div>
            <p className="font-body-md text-slate-subtext text-sm text-center">
              {t.zalo_desc}
            </p>
          </div>
        </section>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
