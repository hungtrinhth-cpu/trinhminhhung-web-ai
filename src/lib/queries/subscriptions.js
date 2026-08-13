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
    .select("item_id, created_at")
    .eq("user_id", user.id)
    .eq("item_type", "course")
    .eq("payment_status", "paid");

  const courseIds = [...new Set((subs ?? []).map((s) => s.item_id))];
  if (courseIds.length === 0) return [];

  // Enrollment date per course — fallback "last activity" for courses with
  // no completed lessons yet (a just-started course should still be
  // resumable, not treated as "never touched").
  const enrolledAtByCourse = {};
  for (const s of subs ?? []) {
    if (!enrolledAtByCourse[s.item_id] || s.created_at > enrolledAtByCourse[s.item_id]) {
      enrolledAtByCourse[s.item_id] = s.created_at;
    }
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, subtitle, level, thumbnail_url")
    .in("id", courseIds);

  // Lessons + progress for each course → compute completion and the next
  // lesson to resume at (first incomplete by order, else the first lesson).
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, course_id, title, order")
    .in("course_id", courseIds)
    .order("order", { ascending: true });

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, completed_at")
    .eq("user_id", user.id);

  const completedSet = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  );
  const completedAtByLesson = {};
  for (const p of progress ?? []) {
    if (p.completed && p.completed_at) completedAtByLesson[p.lesson_id] = p.completed_at;
  }

  const lessonsByCourse = {};
  for (const l of lessons ?? []) {
    (lessonsByCourse[l.course_id] ??= []).push(l);
  }
  // Defensive re-sort per course — the query orders globally by "order",
  // not per-group, so this guarantees correct ordering within each course.
  for (const list of Object.values(lessonsByCourse)) {
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  return (courses ?? []).map((c) => {
    const list = lessonsByCourse[c.id] ?? [];
    const ids = list.map((l) => l.id);
    const done = ids.filter((id) => completedSet.has(id)).length;
    const total = ids.length;
    const nextLesson = list.find((l) => !completedSet.has(l.id)) ?? list[0] ?? null;

    // "Last activity" = latest lesson-completion timestamp in this course,
    // or the enrollment date if nothing's been completed yet — used to pick
    // which course to feature in the dashboard's "Continue Learning" hero.
    const completionTimes = ids.map((id) => completedAtByLesson[id]).filter(Boolean);
    const lastActivityAt = completionTimes.length > 0
      ? completionTimes.reduce((max, t) => (t > max ? t : max))
      : enrolledAtByCourse[c.id] ?? null;

    return {
      ...c,
      lessonsCount: total,
      completedCount: done,
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
      nextLessonId: nextLesson?.id ?? null,
      nextLessonTitle: nextLesson?.title ?? null,
      lastActivityAt,
    };
  });
}
