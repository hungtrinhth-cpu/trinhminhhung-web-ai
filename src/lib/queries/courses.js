import { createClient } from "@/lib/supabase/server";

/**
 * Published courses for the public catalog.
 */
export async function getCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, subtitle, level, price, original_price, thumbnail_url, tags")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getCourses error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCourseBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    console.error("getCourseBySlug error:", error.message);
    return null;
  }
  return data;
}

/**
 * Lessons for a course, ordered. RLS hides paid lessons from non-enrolled users
 * (only preview rows come back unless the viewer has a paid subscription/admin).
 */
export async function getLessons(courseId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id, course_id, title, description, video_url, duration_sec, order, is_preview")
    .eq("course_id", courseId)
    .order("order", { ascending: true });
  if (error) {
    console.error("getLessons error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getLessonById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("getLessonById error:", error.message);
    return null;
  }
  return data;
}

/**
 * All courses (any status) for admin management.
 */
export async function getAllCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, level, price, status, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAllCourses error:", error.message);
    return [];
  }
  return data ?? [];
}
