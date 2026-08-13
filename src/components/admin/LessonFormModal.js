"use client";

import { useState } from "react";
import { createLesson, updateLesson } from "@/app/[lang]/admin/courses/actions";

const BLANK_FORM = {
  title: "",
  description: "",
  video_url: "",
  attachment_url: "",
  duration_sec: "",
  order: "",
  is_preview: false,
};

function toFormState(lesson) {
  if (!lesson) return BLANK_FORM;
  return {
    title: lesson.title ?? "",
    description: lesson.description ?? "",
    video_url: lesson.video_url ?? "",
    attachment_url: lesson.attachment_url ?? "",
    duration_sec: lesson.duration_sec ?? "",
    order: lesson.order ?? "",
    is_preview: !!lesson.is_preview,
  };
}

const inputClass =
  "w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container";
const labelClass = "font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase";

export default function LessonFormModal({ mode, courseId, lesson, siblingLessons, onClose, onSaved }) {
  const [form, setForm] = useState(() => toFormState(mode === "edit" ? lesson : null));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Vui lòng nhập tiêu đề bài học");

    // Light client-side check against already-loaded siblings — the DB's
    // unique(course_id, "order") constraint is still the real enforcement,
    // this just gives a faster/clearer error before hitting the server.
    if (form.order !== "") {
      const orderNum = Number(form.order);
      const conflict = (siblingLessons ?? []).find(
        (l) => l.id !== lesson?.id && Number(l.order) === orderNum
      );
      if (conflict) {
        return setError(`Thứ tự ${orderNum} đã được dùng bởi bài học "${conflict.title}" trong khóa này`);
      }
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      video_url: form.video_url.trim() || null,
      attachment_url: form.attachment_url.trim() || null,
      duration_sec: form.duration_sec !== "" ? Number(form.duration_sec) : null,
      order: form.order !== "" ? Number(form.order) : 0,
      is_preview: form.is_preview,
    };

    setSaving(true);
    try {
      const res =
        mode === "create"
          ? await createLesson({ ...payload, course_id: courseId })
          : await updateLesson(lesson.id, payload);
      if (res?.error) {
        setError(res.error);
        return;
      }
      onSaved?.();
    } catch (err) {
      // Guard against any unexpected exception (network error, etc.) so the
      // button never gets stuck in "Đang lưu..." with no feedback at all.
      setError(err?.message || "Có lỗi không xác định, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-lg w-full rounded-2xl p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-border-subtle pb-4">
          <h3 className="font-headline-section text-headline-section-mobile text-ink-text">
            {mode === "create" ? "Thêm bài học mới" : "Chỉnh sửa bài học"}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-mist-bg text-slate-subtext"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className={labelClass}>Tiêu đề bài học</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass}
              placeholder="Ví dụ: Giới thiệu: Tại sao AI là tương lai?"
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputClass} h-24 resize-none`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Video URL (embed đầy đủ)</label>
            <input
              type="text"
              value={form.video_url}
              onChange={(e) => set("video_url", e.target.value)}
              className={inputClass}
              placeholder="https://www.youtube.com/embed/xxx"
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Link tài liệu (PDF, Google Drive...)</label>
            <input
              type="text"
              value={form.attachment_url}
              onChange={(e) => set("attachment_url", e.target.value)}
              className={inputClass}
              placeholder="https://drive.google.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Thời lượng (giây)</label>
              <input
                type="number"
                min="0"
                value={form.duration_sec}
                onChange={(e) => set("duration_sec", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Thứ tự</label>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => set("order", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_preview}
              onChange={(e) => set("is_preview", e.target.checked)}
              className="w-5 h-5 rounded accent-primary-container"
            />
            <span className="font-body-md text-ink-text text-sm">
              Cho xem thử (is_preview) — hiện được kể cả khi chưa mua khóa
            </span>
          </label>

          {error && (
            <div className="text-error text-sm text-center bg-error/5 border border-error/20 rounded-lg py-2 px-3">
              {error}
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border-subtle rounded-full font-button-text text-button-text text-slate-subtext hover:bg-mist-bg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100"
            >
              {saving ? "Đang lưu..." : "Lưu bài học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
