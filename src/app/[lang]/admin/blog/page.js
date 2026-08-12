import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/queries/profiles";
import { getAllBlogPosts } from "@/lib/queries/blog";
import BlogClient from "@/components/admin/BlogClient";

export default async function AdminBlogPage({ params }) {
  const { lang } = await params;
  const { profile } = await getSessionProfile();

  if (profile?.role !== "admin") {
    redirect(`/${lang}/admin`);
  }

  const posts = await getAllBlogPosts();

  return <BlogClient initialPosts={posts} />;
}
