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

/**
 * Admin-only: aggregate revenue/enrollment stats for courses — total
 * students, paid/pending/failed breakdown, revenue per course, checkout→paid
 * conversion (from payment_orders, one row per checkout attempt — can exceed
 * student count since a retried checkout creates a new order against the
 * same reused subscription), and average progress among paying students.
 * Same RLS-scoped tables as getAllEnrollments() — no new policy needed.
 */
export async function getEnrollmentDashboardStats() {
  const supabase = await createClient();

  const [{ data: subs }, { data: orders }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id, user_id, item_id, payment_status, amount")
      .eq("item_type", "course"),
    supabase.from("payment_orders").select("status").eq("item_type", "course"),
  ]);

  const subRows = subs ?? [];
  const orderRows = orders ?? [];

  const totalStudents = new Set(subRows.filter((s) => s.payment_status === "paid").map((s) => s.user_id)).size;

  const byStatus = { paid: 0, pending: 0, failed: 0 };
  for (const s of subRows) {
    if (byStatus[s.payment_status] !== undefined) byStatus[s.payment_status] += 1;
  }

  const paidSubs = subRows.filter((s) => s.payment_status === "paid");
  const courseIds = [...new Set(paidSubs.map((s) => s.item_id))];
  const { data: courses } = courseIds.length
    ? await supabase.from("courses").select("id, title").in("id", courseIds)
    : { data: [] };
  const courseTitleById = Object.fromEntries((courses ?? []).map((c) => [c.id, c.title]));

  const revenueByCourseMap = {};
  for (const s of paidSubs) {
    const key = s.item_id;
    if (!revenueByCourseMap[key]) revenueByCourseMap[key] = { courseId: key, title: courseTitleById[key] ?? "—", revenue: 0, paidCount: 0 };
    revenueByCourseMap[key].revenue += Number(s.amount || 0);
    revenueByCourseMap[key].paidCount += 1;
  }
  const revenueByCourse = Object.values(revenueByCourseMap).sort((a, b) => b.revenue - a.revenue);

  const totalOrders = orderRows.length;
  const paidOrders = orderRows.filter((o) => o.status === "paid").length;
  const checkoutConversionPct = totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : null;

  // Average progress among paying students only (pending/failed users have
  // no real lesson access, so their progress is meaningless noise here).
  let avgProgress = null;
  if (paidSubs.length > 0) {
    const lessonCourseIds = [...new Set(paidSubs.map((s) => s.item_id))];
    const userIds = [...new Set(paidSubs.map((s) => s.user_id))];
    const { data: lessons } = await supabase.from("lessons").select("id, course_id").in("course_id", lessonCourseIds);
    const lessonCountByCourse = {};
    for (const l of lessons ?? []) lessonCountByCourse[l.course_id] = (lessonCountByCourse[l.course_id] ?? 0) + 1;

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
    const lessonToCourse = Object.fromEntries((lessons ?? []).map((l) => [l.id, l.course_id]));
    const completedCountByUserCourse = {};
    for (const p of progressRows) {
      const courseId = lessonToCourse[p.lesson_id];
      if (!courseId) continue;
      const key = `${p.user_id}:${courseId}`;
      completedCountByUserCourse[key] = (completedCountByUserCourse[key] ?? 0) + 1;
    }

    const progressValues = paidSubs
      .map((s) => {
        const total = lessonCountByCourse[s.item_id] ?? 0;
        if (total === 0) return null;
        const completed = completedCountByUserCourse[`${s.user_id}:${s.item_id}`] ?? 0;
        return Math.round((completed / total) * 100);
      })
      .filter((v) => v !== null);

    if (progressValues.length > 0) {
      avgProgress = Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length);
    }
  }

  return {
    totalStudents,
    byStatus,
    revenueByCourse,
    checkoutConversion: { totalOrders, paidOrders, pct: checkoutConversionPct },
    avgProgress,
  };
}
