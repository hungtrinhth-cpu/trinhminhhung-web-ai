import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only: every student's course enrollment + progress, one row per
 * (student, course) subscription. Relies entirely on existing RLS —
 * subscriptions/profiles/courses/lessons/lesson_progress SELECT policies
 * already let admin/team_leader read every row, not just their own.
 */
export async function getAllEnrollments() {
  const supabase = await createClient();

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, user_id, item_id, payment_status, amount, created_at")
    .eq("item_type", "course")
    .order("created_at", { ascending: false });

  if (!subs || subs.length === 0) return [];

  const userIds = [...new Set(subs.map((s) => s.user_id))];
  const courseIds = [...new Set(subs.map((s) => s.item_id))];

  const [{ data: profiles }, { data: courses }, { data: lessons }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").in("id", userIds),
    supabase.from("courses").select("id, slug, title").in("id", courseIds),
    supabase.from("lessons").select("id, course_id").in("course_id", courseIds),
  ]);

  const lessonIds = (lessons ?? []).map((l) => l.id);
  let progressRows = [];
  if (lessonIds.length > 0) {
    const { data } = await supabase
      .from("lesson_progress")
      .select("user_id, lesson_id")
      .in("user_id", userIds)
      .in("lesson_id", lessonIds)
      .eq("completed", true);
    progressRows = data ?? [];
  }

  const profileById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const courseById = Object.fromEntries((courses ?? []).map((c) => [c.id, c]));
  const lessonToCourse = Object.fromEntries((lessons ?? []).map((l) => [l.id, l.course_id]));

  const lessonCountByCourse = {};
  for (const l of lessons ?? []) {
    lessonCountByCourse[l.course_id] = (lessonCountByCourse[l.course_id] ?? 0) + 1;
  }
  const completedCountByUserCourse = {};
  for (const p of progressRows) {
    const courseId = lessonToCourse[p.lesson_id];
    if (!courseId) continue;
    const key = `${p.user_id}:${courseId}`;
    completedCountByUserCourse[key] = (completedCountByUserCourse[key] ?? 0) + 1;
  }

  return subs.map((s) => {
    const totalLessons = lessonCountByCourse[s.item_id] ?? 0;
    const completedLessons = completedCountByUserCourse[`${s.user_id}:${s.item_id}`] ?? 0;
    const profile = profileById[s.user_id];
    return {
      id: s.id,
      userId: s.user_id,
      studentName: profile?.full_name || profile?.email || "—",
      studentEmail: profile?.email || "",
      courseId: s.item_id,
      courseTitle: courseById[s.item_id]?.title ?? "—",
      paymentStatus: s.payment_status,
      amount: s.amount,
      createdAt: s.created_at,
      totalLessons,
      completedLessons,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  });
}

/**
 * Admin-only: one student's profile plus all of their course enrollments.
 */
export async function getStudentDetail(userId) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return null;

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, item_id, payment_status, amount, created_at")
    .eq("user_id", userId)
    .eq("item_type", "course")
    .order("created_at", { ascending: false });

  const courseIds = [...new Set((subs ?? []).map((s) => s.item_id))];
  const [{ data: courses }, { data: lessons }, { data: progress }] = await Promise.all([
    courseIds.length ? supabase.from("courses").select("id, slug, title").in("id", courseIds) : Promise.resolve({ data: [] }),
    courseIds.length ? supabase.from("lessons").select("id, course_id").in("course_id", courseIds) : Promise.resolve({ data: [] }),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", userId).eq("completed", true),
  ]);

  const courseById = Object.fromEntries((courses ?? []).map((c) => [c.id, c]));
  const lessonToCourse = Object.fromEntries((lessons ?? []).map((l) => [l.id, l.course_id]));
  const lessonCountByCourse = {};
  for (const l of lessons ?? []) {
    lessonCountByCourse[l.course_id] = (lessonCountByCourse[l.course_id] ?? 0) + 1;
  }
  const completedByCourse = {};
  for (const p of progress ?? []) {
    const courseId = lessonToCourse[p.lesson_id];
    if (courseId) completedByCourse[courseId] = (completedByCourse[courseId] ?? 0) + 1;
  }

  const enrollments = (subs ?? []).map((s) => {
    const totalLessons = lessonCountByCourse[s.item_id] ?? 0;
    const completedLessons = completedByCourse[s.item_id] ?? 0;
    return {
      id: s.id,
      courseId: s.item_id,
      courseTitle: courseById[s.item_id]?.title ?? "—",
      courseSlug: courseById[s.item_id]?.slug ?? "",
      paymentStatus: s.payment_status,
      amount: s.amount,
      createdAt: s.created_at,
      totalLessons,
      completedLessons,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  });

  return { profile, enrollments };
}
