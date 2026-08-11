import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/queries/blog";

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const post = await getBlogPostBySlug(slug, lang);
  return {
    title: post ? `${post.title} - Hung Trinh AI` : "Blog - Hung Trinh AI",
    description: post?.excerpt ?? undefined,
  };
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN");
}

export default async function BlogPostPage({ params }) {
  const { lang, slug } = await params;
  const dict = await import(`../../../../dictionaries/${lang}.json`);
  const post = await getBlogPostBySlug(slug, lang);

  return (
    <>
      <Navbar dict={dict.default} lang={lang} />
      <main className="pt-32 pb-section-gap">
        <article className="max-w-3xl mx-auto px-container-padding-mobile md:px-6">
          {post ? (
            <>
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  {post.category && <Badge>{post.category}</Badge>}
                  <span className="font-body-md text-slate-subtext">{formatDate(post.published_at)}</span>
                  {post.read_time_min && (
                    <span className="font-body-md text-slate-subtext">• {post.read_time_min} phút đọc</span>
                  )}
                </div>
                <h1 className="font-headline-hero text-headline-hero-mobile md:text-[42px] text-ink-text leading-tight mb-6">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="font-body-lg text-slate-subtext text-lg">{post.excerpt}</p>
                )}
              </div>

              {post.thumbnail_url && (
                <div className="h-64 md:h-80 rounded-xl overflow-hidden mb-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none font-body-lg text-slate-subtext leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
              />
            </>
          ) : (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-primary-container/30">article</span>
              <h1 className="font-headline-section text-headline-section-mobile text-ink-text mt-6 mb-3">
                Bài viết chưa có sẵn
              </h1>
              <p className="font-body-md text-slate-subtext mb-8">
                Nội dung này đang được cập nhật. Vui lòng quay lại sau.
              </p>
              <Link
                href={`/${lang}/blog`}
                className="inline-flex items-center gap-2 font-button-text text-button-text text-primary-container hover:underline"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Quay lại Blog
              </Link>
            </div>
          )}

          {/* Author Box */}
          <div className="mt-16 glass-card p-8 rounded-xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl text-primary-container">person</span>
            </div>
            <div>
              <h4 className="font-headline-sub text-headline-sub text-ink-text">Hung Trinh</h4>
              <p className="font-body-md text-slate-subtext">AI Transformation Consultant & Founder</p>
            </div>
          </div>
        </article>
      </main>
      <Footer dict={dict.default} lang={lang} />
    </>
  );
}
