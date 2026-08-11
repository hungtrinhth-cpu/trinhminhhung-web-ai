import { redirect } from "next/navigation";
import { getLessonById, getLessons } from "@/lib/queries/courses";
import { hasPaidAccess } from "@/lib/queries/subscriptions";
import { createClient } from "@/lib/supabase/server";
import LessonDetailClient from "./LessonDetailClient";

export default async function LessonDetailPage({ params }) {
  const { lang, id } = await params;

  const lesson = await getLessonById(id);
  if (!lesson) {
    redirect(`/${lang}/portal`);
  }

  if (!lesson.is_preview) {
    const allowed = await hasPaidAccess("course", lesson.course_id);
    if (!allowed) {
      redirect(`/${lang}/portal`);
    }
  }

  const lessons = await getLessons(lesson.course_id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const lessonIds = lessons.map((l) => l.id);
  let completedIds = [];
  if (user && lessonIds.length > 0) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);
    completedIds = (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id);
  }

  const enrichedLessons = lessons.map((l) => ({ ...l, completed: completedIds.includes(l.id) }));

  return <LessonDetailClient lessons={enrichedLessons} activeLessonId={id} />;
}
