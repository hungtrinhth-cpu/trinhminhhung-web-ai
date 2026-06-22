import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Blog Post - Hung Trinh AI",
};

export default async function BlogPostPage({ params }) {
  const { lang, slug } = await params;
  const dict = await import(`../../../../dictionaries/${lang}.json`);

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        <article className="max-w-3xl mx-auto px-container-padding-mobile md:px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Badge>AI INSIGHTS</Badge>
              <span className="font-body-md text-slate-subtext">15 Th06 2026</span>
              <span className="font-body-md text-slate-subtext">• 5 phút đọc</span>
            </div>
            <h1 className="font-headline-hero text-headline-hero-mobile md:text-[42px] text-ink-text leading-tight mb-6">
              5 Công Cụ AI Miễn Phí Giúp Tăng 300% Năng Suất Cho SME
            </h1>
            <p className="font-body-lg text-slate-subtext text-lg">
              Khám phá các công cụ AI hàng đầu giúp doanh nghiệp vừa và nhỏ tăng hiệu suất làm việc mà không cần đầu tư lớn.
            </p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="h-64 bg-surface-container rounded-xl flex items-center justify-center mb-12">
              <span className="material-symbols-outlined text-8xl text-primary-container/20">smart_toy</span>
            </div>

            <div className="space-y-6 font-body-lg text-slate-subtext leading-relaxed">
              <p>
                Trong kỷ nguyên số hóa, trí tuệ nhân tạo không còn là đặc quyền của các tập đoàn lớn. Với sự phát triển vượt bậc của công nghệ, ngay cả các doanh nghiệp vừa và nhỏ (SME) cũng có thể tận dụng sức mạnh AI để tối ưu hóa quy trình làm việc.
              </p>

              <h2 className="font-headline-section text-headline-section-mobile text-ink-text !mt-12">1. ChatGPT — Trợ lý đa năng</h2>
              <p>
                ChatGPT của OpenAI đã trở thành công cụ AI phổ biến nhất thế giới. Từ viết nội dung, phân tích dữ liệu cho đến hỗ trợ lập trình, ChatGPT giúp tiết kiệm hàng giờ mỗi ngày.
              </p>

              <h2 className="font-headline-section text-headline-section-mobile text-ink-text !mt-12">2. Canva AI — Thiết kế thông minh</h2>
              <p>
                Canva tích hợp AI giúp bạn tạo ra thiết kế chuyên nghiệp chỉ trong vài phút. Magic Design, Magic Write và Background Remover là những tính năng được yêu thích nhất.
              </p>

              <h2 className="font-headline-section text-headline-section-mobile text-ink-text !mt-12">3. Notion AI — Quản lý dự án thông minh</h2>
              <p>
                Notion AI hỗ trợ tóm tắt tài liệu, tạo action items và phân tích dữ liệu ngay trong workspace, giúp đội nhóm làm việc hiệu quả hơn.
              </p>

              <div className="bg-primary-container/5 border-l-4 border-primary-container p-6 rounded-r-xl my-8">
                <p className="font-headline-sub text-ink-text mb-2">💡 Mẹo từ Hung Trinh:</p>
                <p className="font-body-lg text-slate-subtext">Đừng cố sử dụng tất cả cùng lúc. Hãy chọn 1-2 công cụ phù hợp nhất với quy trình hiện tại và làm chủ chúng trước khi mở rộng.</p>
              </div>
            </div>
          </div>

          {/* Author Box */}
          <div className="mt-16 glass-card p-8 rounded-xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary-container">person</span>
            </div>
            <div>
              <h4 className="font-headline-sub text-headline-sub text-ink-text">Hung Trinh</h4>
              <p className="font-body-md text-slate-subtext">AI Transformation Consultant & Founder of Visun AI</p>
            </div>
          </div>
        </article>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
