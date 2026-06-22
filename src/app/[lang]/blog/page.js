import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export const metadata = {
  title: "Blog - Hung Trinh AI",
  description: "Chia sẻ kiến thức, xu hướng và ứng dụng AI trong doanh nghiệp.",
};

const posts = [
  {
    slug: "5-cong-cu-ai-mien-phi",
    title: "5 Công Cụ AI Miễn Phí Giúp Tăng 300% Năng Suất Cho SME",
    excerpt: "Khám phá các công cụ AI hàng đầu giúp doanh nghiệp vừa và nhỏ tăng hiệu suất làm việc mà không cần đầu tư lớn.",
    badge: "POPULAR",
    date: "15 Th06 2026",
    readTime: "5 phút",
    image: "smart_toy",
  },
  {
    slug: "prompt-engineering-co-ban",
    title: "Prompt Engineering Cơ Bản: Hướng Dẫn Từ A-Z",
    excerpt: "Hướng dẫn chi tiết cách viết prompt hiệu quả để tận dụng tối đa sức mạnh của ChatGPT và các mô hình AI khác.",
    badge: "GUIDE",
    date: "10 Th06 2026",
    readTime: "8 phút",
    image: "psychology",
  },
  {
    slug: "ai-agent-la-gi",
    title: "AI Agent Là Gì? Tại Sao Mọi Doanh Nghiệp Đều Cần?",
    excerpt: "Tìm hiểu về AI Agent - công nghệ đang cách mạng hóa cách doanh nghiệp vận hành và tương tác với khách hàng.",
    badge: "NEW",
    date: "08 Th06 2026",
    readTime: "6 phút",
    image: "precision_manufacturing",
  },
  {
    slug: "chatgpt-trong-marketing",
    title: "Ứng Dụng ChatGPT Trong Marketing: Case Study Thực Tế",
    excerpt: "Case study chi tiết về cách một doanh nghiệp SME đã tăng 200% chuyển đổi nhờ ứng dụng ChatGPT vào chiến lược marketing.",
    badge: "CASE STUDY",
    date: "01 Th06 2026",
    readTime: "10 phút",
    image: "campaign",
  },
];

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../dictionaries/${lang}.json`);

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        <section className="max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="text-center mb-16">
            <Badge>BLOG</Badge>
            <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text mt-6 mb-4">
              Kiến Thức AI
            </h1>
            <p className="font-body-lg text-slate-subtext max-w-2xl mx-auto">
              Chia sẻ kiến thức, xu hướng và ứng dụng AI trong doanh nghiệp từ chuyên gia Hung Trinh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {posts.map((post) => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="block group">
                <article className="glass-card rounded-xl overflow-hidden hover:border-primary-container/50 transition-all duration-500 h-full flex flex-col">
                  <div className="h-48 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-primary-container/30 group-hover:text-primary-container/60 transition-colors">{post.image}</span>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge>{post.badge}</Badge>
                      <span className="font-body-md text-slate-subtext text-sm">{post.date}</span>
                      <span className="font-body-md text-slate-subtext text-sm">• {post.readTime}</span>
                    </div>
                    <h3 className="font-headline-sub text-headline-sub text-ink-text mb-3 group-hover:text-primary-container transition-colors">{post.title}</h3>
                    <p className="font-body-md text-slate-subtext flex-grow">{post.excerpt}</p>
                    <div className="mt-6 flex items-center gap-2 font-button-text text-button-text text-primary-container">
                      Đọc thêm <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
