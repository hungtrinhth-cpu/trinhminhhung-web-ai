import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/queries/profiles";
import { getAllCourses } from "@/lib/queries/courses";
import { createClient } from "@/lib/supabase/server";
import CoursesClient from "@/components/admin/CoursesClient";

export default async function AdminCoursesPage({ params }) {
  const { lang } = await params;
  const { profile } = await getSessionProfile();

  if (profile?.role !== "admin") {
    redirect(`/${lang}/admin`);
  }

  const courses = await getAllCourses();

  const courseIds = courses.map((c) => c.id);
  let lessons = [];
  if (courseIds.length > 0) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .in("course_id", courseIds)
      .order("order", { ascending: true });
    lessons = data ?? [];
  }

  return <CoursesClient initialCourses={courses} initialLessons={lessons} />;
}
