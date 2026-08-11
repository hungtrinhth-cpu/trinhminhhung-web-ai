import { createClient } from "@/lib/supabase/server";

/**
 * Published blog posts for a given language, newest first.
 */
export async function getBlogPosts(lang = "vi") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, lang, title, excerpt, thumbnail_url, category, read_time_min, published_at")
    .eq("lang", lang)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getBlogPosts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBlogPostBySlug(slug, lang = "vi") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("lang", lang)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("getBlogPostBySlug error:", error.message);
    return null;
  }
  return data;
}

/**
 * All posts (any status) for admin management.
 */
export async function getAllBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, lang, title, status, category, published_at, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAllBlogPosts error:", error.message);
    return [];
  }
  return data ?? [];
}
