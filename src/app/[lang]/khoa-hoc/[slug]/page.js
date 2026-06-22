import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Webinar: Tự Động Hóa Doanh Nghiệp Nhờ AI Agent | Hung Trinh AI",
  description: "Giải pháp tối ưu hóa vận hành, cắt giảm 40% chi phí nhân sự và nhân đôi hiệu suất làm việc bằng công nghệ AI thế hệ mới nhất.",
};

const curriculum = [
  { title: "Phần 1: Tổng quan về AI Agent trong năm 2024", desc: "Sự khác biệt giữa AI truyền thống và AI Agent tự hành.", duration: "45 Phút" },
  { title: "Phần 2: Xây dựng quy trình tự động hóa Sale & Marketing", desc: "Cách AI Agent xử lý lead, nuôi dưỡng khách hàng 24/7.", duration: "60 Phút" },
  { title: "Phần 3: Tích hợp AI vào vận hành nội bộ", desc: "Tự động hóa báo cáo, quản lý lịch trình và phân tích dữ liệu.", duration: "45 Phút" },
  { title: "Phần 4: Hỏi đáp & Demo thực tế", desc: "Case study thực chiến từ các doanh nghiệp SME đã áp dụng.", duration: "30 Phút" },
];

const outcomes = [
  { icon: "bolt", title: "Tăng tốc độ vận hành", desc: "Giảm thiểu sai sót con người và tăng tốc độ xử lý công việc lên 5-10 lần." },
  { icon: "monitoring", title: "Tối ưu hóa chi phí", desc: "Tiết kiệm chi phí vận hành nhân sự cho các công việc lặp đi lặp lại." },
];

const benefits = [
  "Link tham gia Zoom trực tiếp",
  "Video ghi lại buổi Webinar (Lifetime)",
  "Bộ tài liệu 50+ AI Prompt thực chiến",
  "Chứng nhận hoàn thành Online",
];

export default async function WebinarDetailPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../../dictionaries/${lang}.json`);

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop text-center mb-16">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge>Thời lượng: 3h</Badge>
            <Badge>Cấp độ: SME Owner</Badge>
            <Badge>Online qua Zoom</Badge>
          </div>
          <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero mb-6 text-ink-text max-w-4xl mx-auto leading-tight">
            WEBINAR: TỰ ĐỘNG HÓA DOANH NGHIỆP NHỜ AI AGENT
          </h1>
          <p className="font-body-lg text-tertiary max-w-2xl mx-auto mb-10">
            Giải pháp tối ưu hóa vận hành, cắt giảm 40% chi phí nhân sự và nhân đôi hiệu suất làm việc bằng công nghệ AI thế hệ mới nhất.
          </p>
        </section>

        {/* Main Content Area */}
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 relative">
          {/* Left Column: Curriculum */}
          <div className="space-y-12">
            {/* Instructor Preview */}
            <div className="flex items-center gap-6 p-8 glass-card rounded-xl">
              <Image
                className="w-24 h-24 rounded-full object-cover border-2 border-primary-container/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mPkl6p8_pLhwE7Wat1rD-aQylOIijdLmXgTy-B5_r1wxTRcOnB3CNw2-0EikS2ioS3RiGn36bcweETCeXSvWHTAu7B6swuM-8wFkixy86kUA1meGspae6upQ9vPlwUpSE2ic-bOxCXENt1nHQhkm8Wvjzw2rw-MSpxyccparQymfnnD0xLylPMzeA"
                alt="Hung Trinh"
                width={96}
                height={96}
              />
              <div>
                <h3 className="font-headline-sub text-headline-sub text-ink-text mb-1">Hung Trinh</h3>
                <p className="text-tertiary font-body-md">AI Transformation Consultant &amp; Founder of Visun AI. Chuyên gia với hơn 10 năm kinh nghiệm trong lĩnh vực chuyển đổi số cho doanh nghiệp SME.</p>
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-6">
              <h2 className="font-headline-section text-headline-section text-ink-text flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary-container rounded-full"></span>
                Mục lục khóa học
              </h2>
              <div className="space-y-0 border-t border-border-subtle">
                {curriculum.map((item, index) => (
                  <div key={index} className="py-6 border-b border-border-subtle group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-secondary group-hover:text-primary-container transition-all duration-300">play_circle</span>
                        <div>
                          <h4 className="font-headline-sub text-headline-sub group-hover:text-primary-container transition-colors">{item.title}</h4>
                          <p className="text-tertiary text-sm mt-1">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-tertiary font-label-eyebrow">{item.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              {outcomes.map((item, index) => (
                <div key={index} className="p-8 bg-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-primary-container text-4xl mb-4">{item.icon}</span>
                  <h4 className="font-headline-sub text-headline-sub mb-2">{item.title}</h4>
                  <p className="text-tertiary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Payment Card */}
          <div className="relative">
            <div className="sticky top-28 glass-card p-8 rounded-xl space-y-8 border border-primary-container/10">
              <div>
                <span className="font-label-eyebrow text-label-eyebrow text-tertiary block mb-2">GIÁ VÉ ƯU ĐÃI</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-ink-text">499.000đ</span>
                  <span className="text-tertiary line-through text-sm">1.200.000đ</span>
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="font-headline-sub text-sm uppercase tracking-widest text-primary-container">Bạn sẽ nhận được:</h5>
                <ul className="space-y-3">
                  {benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 font-body-md">
                      <span className="material-symbols-outlined text-primary-container text-sm mt-1">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <Link
                  href={`/${lang}/thanh-toan/webinar-ai-agent`}
                  className="w-full bg-primary-container text-white py-4 rounded-full font-button-text text-button-text hover:opacity-90 transition-all shadow-lg shadow-primary-container/20 hover:-translate-y-1 flex items-center justify-center"
                >
                  ĐĂNG KÝ VÀ THANH TOÁN VÉ
                </Link>
                <p className="text-center text-[11px] text-tertiary uppercase tracking-tight font-bold">Thanh toán an toàn qua chuyển khoản hoặc thẻ</p>
              </div>
              <div className="flex justify-center gap-4 opacity-40">
                <span className="material-symbols-outlined">payments</span>
                <span className="material-symbols-outlined">shield</span>
                <span className="material-symbols-outlined">verified_user</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-ink-text text-pure-white py-20 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="font-headline-section text-headline-section mb-6">Bạn đã sẵn sàng để trở thành người dẫn đầu trong kỷ nguyên AI?</h2>
            <p className="text-tertiary-fixed-dim font-body-lg">Đừng để doanh nghiệp của bạn bị tụt lại phía sau. Đăng ký ngay hôm nay.</p>
          </div>
          <button className="bg-pure-white text-ink-text px-10 py-5 rounded-full font-button-text text-button-text hover:bg-primary-container hover:text-white transition-all duration-300">
            GIỮ CHỖ NGAY BÂY GIỜ
          </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
