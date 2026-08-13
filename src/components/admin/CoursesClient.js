"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCourse, updateLesson } from "@/app/[lang]/admin/courses/actions";
import CourseFormModal from "./CourseFormModal";
import LessonFormModal from "./LessonFormModal";
import QaCleanupModal from "./QaCleanupModal";

const STATUS_LABEL = { draft: "Nháp", published: "Đã đăng", closed: "Đã đóng" };
const STATUS_STYLE = {
  draft: "text-yellow-700 bg-yellow-50",
  published: "text-green-700 bg-green-50",
  closed: "text-slate-500 bg-slate-100",
};

function formatPrice(p) {
  return Number(p ?? 0).toLocaleString("vi-VN") + "đ";
}

function formatDuration(sec) {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CoursesClient({ initialCourses, initialLessons }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [lessons, setLessons] = useState(initialLessons);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourses[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  // router.refresh() re-renders the parent Server Component and passes new
  // initialCourses/initialLessons props, but useState's initializer only
  // runs on first mount — without this sync-during-render, a newly created
  // course/lesson never shows up until a full page reload. Adjusting state
  // during render (not in an effect) per React's recommended pattern for
  // this exact case.
  const [prevInitialCourses, setPrevInitialCourses] = useState(initialCourses);
  if (initialCourses !== prevInitialCourses) {
    setPrevInitialCourses(initialCourses);
    setCourses(initialCourses);
  }
  const [prevInitialLessons, setPrevInitialLessons] = useState(initialLessons);
  if (initialLessons !== prevInitialLessons) {
    setPrevInitialLessons(initialLessons);
    setLessons(initialLessons);
  }

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState("create");
  const [editingCourse, setEditingCourse] = useState(null);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonModalMode, setLessonModalMode] = useState("create");
  const [editingLesson, setEditingLesson] = useState(null);

  const [qaCleanupOpen, setQaCleanupOpen] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedLessons = useMemo(
    () => lessons.filter((l) => l.course_id === selectedCourseId),
    [lessons, selectedCourseId]
  );

  function refresh() {
    startTransition(() => router.refresh());
  }

  function openCreateCourse() {
    setCourseModalMode("create");
    setEditingCourse(null);
    setCourseModalOpen(true);
  }

  function openEditCourse(course) {
    setCourseModalMode("edit");
    setEditingCourse(course);
    setCourseModalOpen(true);
  }

  async function handleCourseStatusChange(course, status) {
    setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, status } : c)));
    const res = await updateCourse(course.id, { status });
    if (res?.error) refresh();
  }

  function handleCourseSaved() {
    setCourseModalOpen(false);
    refresh();
  }

  function openCreateLesson() {
    setLessonModalMode("create");
    setEditingLesson(null);
    setLessonModalOpen(true);
  }

  function openEditLesson(lesson) {
    setLessonModalMode("edit");
    setEditingLesson(lesson);
    setLessonModalOpen(true);
  }

  async function handleTogglePreview(lesson) {
    const nextValue = !lesson.is_preview;
    setLessons((prev) =>
      prev.map((l) => (l.id === lesson.id ? { ...l, is_preview: nextValue } : l))
    );
    const res = await updateLesson(lesson.id, { is_preview: nextValue });
    if (res?.error) refresh();
  }

  function handleLessonSaved() {
    setLessonModalOpen(false);
    refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
            Quản lý khóa học
          </h1>
          <p className="font-body-md text-slate-subtext mt-1">
            Tạo, sửa khóa học và bài học hiển thị trên trang public
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQaCleanupOpen(true)}
            disabled={isPending}
            className="border border-outline-variant text-slate-subtext px-4 py-3 rounded-full font-button-text text-button-text hover:bg-mist-bg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            title="Xoá các khóa học QA_TEST_ còn tồn đọng từ quá trình QA"
          >
            <span className="material-symbols-outlined text-base">mop</span>
            Dọn dữ liệu QA_TEST_
          </button>
          <button
            onClick={openCreateCourse}
            disabled={isPending}
            className="bg-primary-container text-white px-5 py-3 rounded-full font-button-text text-button-text uppercase tracking-wider shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Tạo khóa học mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
        {/* Left: Courses list */}
        <div className="space-y-4">
          <h2 className="font-headline-sub text-headline-sub text-ink-text">Danh sách khóa học</h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => {
              const isSelected = course.id === selectedCourseId;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`glass-card rounded-xl p-6 cursor-pointer border-2 transition-all duration-300 relative group ${
                    isSelected
                      ? "border-primary-container/50 bg-primary-container/5 shadow-lg"
                      : "border-border-subtle hover:border-primary-container/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <select
                      value={course.status}
                      disabled={isPending}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleCourseStatusChange(course, e.target.value)}
                      className={`border border-border-subtle rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-primary-container ${STATUS_STYLE[course.status] ?? ""}`}
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditCourse(course);
                      }}
                      className="w-8 h-8 rounded-full bg-mist-bg text-slate-subtext hover:text-primary-container hover:bg-primary-container/10 transition-colors flex items-center justify-center shrink-0"
                      title="Sửa khóa học"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </div>
                  <h3 className="font-headline-sub text-headline-sub text-ink-text leading-tight group-hover:text-primary-container transition-colors truncate">
                    {course.title}
                  </h3>
                  <p className="font-body-md text-slate-subtext text-xs truncate">{course.slug}</p>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-border-subtle/50 text-[11px] font-bold">
                    <span className="text-slate-subtext">
                      {lessons.filter((l) => l.course_id === course.id).length} bài học
                    </span>
                    <span className="text-primary-container">{formatPrice(course.price)}</span>
                  </div>
                </div>
              );
            })}

            {courses.length === 0 && (
              <div className="glass-card rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">school</span>
                <p className="font-body-lg text-slate-subtext">Chưa có khóa học nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Lessons list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sub text-headline-sub text-ink-text truncate max-w-[70%]">
              {selectedCourse ? `Bài học: ${selectedCourse.title}` : "Chọn khóa học"}
            </h2>
            {selectedCourse && (
              <button
                onClick={openCreateLesson}
                disabled={isPending}
                className="border border-primary-container/30 text-primary-container px-4 py-2 rounded-full font-button-text text-xs hover:bg-primary-container hover:text-white transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Thêm bài học
              </button>
            )}
          </div>

          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border-subtle">
            {selectedCourse &&
              selectedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-5 hover:bg-mist-bg transition-colors gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 text-primary-container font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {lesson.order}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-headline-sub text-sm text-ink-text truncate font-bold">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-subtext flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">timer</span>
                          {formatDuration(lesson.duration_sec)}
                        </span>
                        {lesson.is_preview && (
                          <>
                            <span>•</span>
                            <span className="text-primary-container font-bold">Xem thử</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTogglePreview(lesson)}
                      disabled={isPending}
                      title={lesson.is_preview ? "Tắt xem thử" : "Bật xem thử"}
                      className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center disabled:opacity-60 ${
                        lesson.is_preview
                          ? "bg-primary-container/10 text-primary-container"
                          : "bg-mist-bg text-slate-subtext hover:text-primary-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {lesson.is_preview ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                    <button
                      onClick={() => openEditLesson(lesson)}
                      className="w-8 h-8 rounded-full bg-mist-bg text-slate-subtext hover:text-primary-container hover:bg-primary-container/10 transition-colors flex items-center justify-center"
                      title="Sửa bài học"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </div>
                </div>
              ))}

            {selectedCourse && selectedLessons.length === 0 && (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">play_circle</span>
                <p className="font-body-lg text-slate-subtext">Khóa học này chưa có bài học nào</p>
              </div>
            )}

            {!selectedCourse && (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">arrow_back</span>
                <p className="font-body-lg text-slate-subtext">Vui lòng chọn hoặc thêm khóa học ở danh sách bên trái</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {courseModalOpen && (
        <CourseFormModal
          mode={courseModalMode}
          course={editingCourse}
          onClose={() => setCourseModalOpen(false)}
          onSaved={handleCourseSaved}
        />
      )}

      {lessonModalOpen && selectedCourse && (
        <LessonFormModal
          mode={lessonModalMode}
          courseId={selectedCourse.id}
          lesson={editingLesson}
          siblingLessons={selectedLessons}
          onClose={() => setLessonModalOpen(false)}
          onSaved={handleLessonSaved}
        />
      )}

      {qaCleanupOpen && (
        <QaCleanupModal onClose={() => setQaCleanupOpen(false)} onDone={refresh} />
      )}
    </div>
  );
}
