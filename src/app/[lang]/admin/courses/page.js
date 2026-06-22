"use client";

import { useState, use } from "react";
import { mockCourses as initialCourses, mockLessons as initialLessons } from "@/lib/mock-data";

export default function CoursesAdminPage({ params }) {
  use(params);
  const [courses, setCourses] = useState(initialCourses);
  const [lessons, setLessons] = useState(initialLessons);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourses[0]?.id || "");

  // Course Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState("add"); // "add" | "edit"
  const [courseForm, setCourseForm] = useState({
    id: "",
    title: "",
    slug: "",
    level: "BEGINNER",
    icon: "school",
    lessonsCount: 0,
    price: 0,
    description: "",
    thumbnail: "",
  });

  // Lesson Modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonModalMode, setLessonModalMode] = useState("add"); // "add" | "edit"
  const [lessonForm, setLessonForm] = useState({
    id: "",
    courseId: "",
    title: "",
    duration: "10:00",
    videoId: "dQw4w9WgXcQ",
    description: "",
  });

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedLessons = lessons.filter((l) => l.courseId === selectedCourseId);

  // --- Course Handlers ---
  const handleOpenCourseModal = (mode, course = null) => {
    setCourseModalMode(mode);
    if (mode === "edit" && course) {
      setCourseForm({ ...course });
    } else {
      setCourseForm({
        id: "course-" + Date.now(),
        title: "",
        slug: "",
        level: "BEGINNER",
        icon: "school",
        lessonsCount: 0,
        price: 0,
        description: "",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg",
      });
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (courseModalMode === "add") {
      setCourses((prev) => [...prev, courseForm]);
      if (!selectedCourseId) setSelectedCourseId(courseForm.id);
    } else {
      setCourses((prev) => prev.map((c) => (c.id === courseForm.id ? courseForm : c)));
    }
    setShowCourseModal(false);
  };

  const handleDeleteCourse = (courseId, e) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này cùng toàn bộ bài học bên trong?")) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setLessons((prev) => prev.filter((l) => l.courseId !== courseId));
      if (selectedCourseId === courseId) {
        const remaining = courses.filter((c) => c.id !== courseId);
        setSelectedCourseId(remaining[0]?.id || "");
      }
    }
  };

  // --- Lesson Handlers ---
  const handleOpenLessonModal = (mode, lesson = null) => {
    setLessonModalMode(mode);
    if (mode === "edit" && lesson) {
      setLessonForm({ ...lesson });
    } else {
      setLessonForm({
        id: String(lessons.length + 1),
        courseId: selectedCourseId,
        title: "",
        duration: "15:00",
        videoId: "dQw4w9WgXcQ",
        description: "",
      });
    }
    setShowLessonModal(true);
  };

  const handleSaveLesson = (e) => {
    e.preventDefault();
    if (lessonModalMode === "add") {
      setLessons((prev) => [...prev, lessonForm]);
      // Update course lesson count
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourseId ? { ...c, lessonsCount: c.lessonsCount + 1 } : c
        )
      );
    } else {
      setLessons((prev) => prev.map((l) => (l.id === lessonForm.id ? lessonForm : l)));
    }
    setShowLessonModal(false);
  };

  const handleDeleteLesson = (lessonId) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài học này?")) {
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      // Update course lesson count
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourseId ? { ...c, lessonsCount: Math.max(0, c.lessonsCount - 1) } : c
        )
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
            Quản lý khóa học
          </h1>
          <p className="font-body-md text-slate-subtext mt-1">
            Thiết kế giáo trình, danh sách bài học và video record đào tạo
          </p>
        </div>
        <button
          onClick={() => handleOpenCourseModal("add")}
          className="bg-primary-container text-white px-5 py-3 rounded-full font-button-text text-button-text uppercase tracking-wider shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Thêm khóa học mới
        </button>
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
                  className={`glass-card rounded-xl p-6 cursor-pointer border-2 transition-all duration-300 relative group flex items-start gap-4 ${
                    isSelected
                      ? "border-primary-container/50 bg-primary-container/5 shadow-lg"
                      : "border-border-subtle hover:border-primary-container/30"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-2xl">{course.icon || "school"}</span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-primary-container/10 text-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {course.level}
                      </span>
                      <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCourseModal("edit", course);
                          }}
                          className="w-8 h-8 rounded-full bg-mist-bg text-slate-subtext hover:text-primary-container hover:bg-primary-container/10 transition-colors flex items-center justify-center"
                          title="Sửa khóa học"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteCourse(course.id, e)}
                          className="w-8 h-8 rounded-full bg-mist-bg text-slate-subtext hover:text-error hover:bg-error/10 transition-colors flex items-center justify-center"
                          title="Xóa khóa học"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-headline-sub text-headline-sub text-ink-text leading-tight group-hover:text-primary-container transition-colors truncate">
                      {course.title}
                    </h3>
                    <p className="font-body-md text-slate-subtext text-xs line-clamp-2">
                      {course.description || course.subtitle}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-border-subtle/50 text-[11px] font-bold">
                      <span className="text-slate-subtext">{course.lessonsCount} bài học</span>
                      <span className="text-primary-container">
                        {course.price ? course.price.toLocaleString("vi-VN") + "đ" : "Miễn phí"}
                      </span>
                    </div>
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
                onClick={() => handleOpenLessonModal("add")}
                className="border border-primary-container/30 text-primary-container px-4 py-2 rounded-full font-button-text text-xs hover:bg-primary-container hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Thêm bài học
              </button>
            )}
          </div>

          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border-subtle">
            {selectedCourse && selectedLessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-5 hover:bg-mist-bg transition-colors gap-4"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-primary-container/10 text-primary-container font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-headline-sub text-sm text-ink-text truncate font-bold">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-slate-subtext flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">timer</span>
                        {lesson.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 truncate">
                        <span className="material-symbols-outlined text-xs">video_library</span>
                        {lesson.videoId}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenLessonModal("edit", lesson)}
                    className="w-8 h-8 rounded-full bg-mist-bg text-slate-subtext hover:text-primary-container hover:bg-primary-container/10 transition-colors flex items-center justify-center"
                    title="Sửa bài học"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="w-8 h-8 rounded-full bg-mist-bg text-slate-subtext hover:text-error hover:bg-error/10 transition-colors flex items-center justify-center"
                    title="Xóa bài học"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
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

      {/* --- Course Add/Edit Modal --- */}
      {showCourseModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setShowCourseModal(false)}
        >
          <div
            className="glass-card max-w-lg w-full rounded-2xl p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border-subtle pb-4">
              <h3 className="font-headline-section text-headline-section-mobile text-ink-text">
                {courseModalMode === "add" ? "Thêm khóa học mới" : "Chỉnh sửa khóa học"}
              </h3>
              <button
                onClick={() => setShowCourseModal(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-mist-bg text-slate-subtext"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tên khóa học</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                  className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                  placeholder="Nhập tên khóa học..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Cấp độ</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="CREATIVE">CREATIVE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Học phí (đ)</label>
                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                    placeholder="2.990.000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Icon</label>
                  <select
                    value={courseForm.icon}
                    onChange={(e) => setCourseForm({ ...courseForm, icon: e.target.value })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                  >
                    <option value="school">School</option>
                    <option value="psychology">Psychology</option>
                    <option value="smart_toy">Smart Toy</option>
                    <option value="brush">Brush</option>
                    <option value="precision_manufacturing">Precision Mfg</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Slug</label>
                  <input
                    type="text"
                    required
                    value={courseForm.slug}
                    onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                    placeholder="slug-khoa-hoc"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Mô tả khóa học</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container h-24 resize-none"
                  placeholder="Nhập mô tả tóm tắt của khóa học..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 py-3 border border-border-subtle rounded-full font-button-text text-button-text text-slate-subtext hover:bg-mist-bg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-105 transition-transform"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Lesson Add/Edit Modal --- */}
      {showLessonModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setShowLessonModal(false)}
        >
          <div
            className="glass-card max-w-lg w-full rounded-2xl p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border-subtle pb-4">
              <h3 className="font-headline-section text-headline-section-mobile text-ink-text">
                {lessonModalMode === "add" ? "Thêm bài học mới" : "Chỉnh sửa bài học"}
              </h3>
              <button
                onClick={() => setShowLessonModal(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-mist-bg text-slate-subtext"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tên bài học</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                  placeholder="Ví dụ: Bài 1: Cấu trúc Prompt cơ bản"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Thời lượng (mm:ss)</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                    placeholder="15:30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">YouTube Video ID</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.videoId}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoId: e.target.value })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                    placeholder="dQw4w9WgXcQ"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tóm tắt nội dung bài học</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container h-24 resize-none"
                  placeholder="Nhập nội dung tóm tắt chính của bài học..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="flex-1 py-3 border border-border-subtle rounded-full font-button-text text-button-text text-slate-subtext hover:bg-mist-bg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-105 transition-transform"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
