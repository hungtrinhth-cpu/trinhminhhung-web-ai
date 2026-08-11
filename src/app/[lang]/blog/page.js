import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { getBlogPosts } from "@/lib/queries/blog";

export const metadata = {
  title: "Blog - Hung Trinh AI",
  description: "Chia sẻ kiến thức, xu hướng và ứng dụng AI trong doanh nghiệp.",
};

// Fallback content shown while the blog_posts table is still empty.
const fallbackPosts = [
  {
    slug: "5-cong-cu-ai-mien-phi",
    title: "5 Công Cụ AI Miễn Phí Giúp Tăng 300% Năng Suất Cho SME",
    excerpt: "Khám phá các công cụ AI hàng đầu giúp doanh nghiệp vừa và nhỏ tăng hiệu suất làm việc mà không cần đầu tư lớn.",
    category: "POPULAR",
    published_at: "2026-06-15",
    read_time_min: 5,
    thumbnail_url: null,
  },
  {
    slug: "prompt-engineering-co-ban",
    title: "Prompt Engineering Cơ Bản: Hướng Dẫn Từ A-Z",
    excerpt: "Hướng dẫn chi tiết cách viết prompt hiệu quả để tận dụng tối đa sức mạnh của ChatGPT và các mô hình AI khác.",
    category: "GUIDE",
    published_at: "2026-06-10",
    read_time_min: 8,
    thumbnail_url: null,
  },
];

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN");
}

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const dict = await import(`../../../dictionaries/${lang}.json`);

  const dbPosts = await getBlogPosts(lang);
  const posts = dbPosts.length > 0 ? dbPosts : fallbackPosts;

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
                  <div className="h-48 bg-surface-container flex items-center justify-center overflow-hidden">
                    {post.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-primary-container/30 group-hover:text-primary-container/60 transition-colors">article</span>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      {post.category && <Badge>{post.category}</Badge>}
                      <span className="font-body-md text-slate-subtext text-sm">{formatDate(post.published_at)}</span>
                      {post.read_time_min && (
                        <span className="font-body-md text-slate-subtext text-sm">• {post.read_time_min} phút</span>
                      )}
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
