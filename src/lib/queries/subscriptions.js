import { createClient } from "@/lib/supabase/server";

/**
 * The current user's subscriptions (paid + pending).
 */
export async function getMySubscriptions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, item_type, item_id, payment_status, amount, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMySubscriptions error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Whether the current user has paid access to a course/webinar.
 */
export async function hasPaidAccess(itemType, itemId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .eq("payment_status", "paid")
    .maybeSingle();

  return !!data;
}

/**
 * Courses the current user is enrolled in (paid), with progress %.
 */
export async function getMyCourses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_type", "course")
    .eq("payment_status", "paid");

  const courseIds = [...new Set((subs ?? []).map((s) => s.item_id))];
  if (courseIds.length === 0) return [];

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, subtitle, level, thumbnail_url")
    .in("id", courseIds);

  // Lessons + progress for each course → compute completion.
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, course_id")
    .in("course_id", courseIds);

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  const completedSet = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  );

  const lessonsByCourse = {};
  for (const l of lessons ?? []) {
    (lessonsByCourse[l.course_id] ??= []).push(l.id);
  }

  return (courses ?? []).map((c) => {
    const ids = lessonsByCourse[c.id] ?? [];
    const done = ids.filter((id) => completedSet.has(id)).length;
    const total = ids.length;
    return {
      ...c,
      lessonsCount: total,
      completedCount: done,
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });
}
