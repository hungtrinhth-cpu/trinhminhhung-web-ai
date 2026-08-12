"use client";

import { useState } from "react";
import { createCourse, updateCourse } from "@/app/[lang]/admin/courses/actions";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_ERROR = "Slug chỉ được dùng chữ thường, số và dấu gạch ngang, ví dụ: ai-mastery-pro";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BLANK_FORM = {
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  level: "",
  price: "",
  original_price: "",
  thumbnail_url: "",
  tags: "",
  status: "draft",
};

function toFormState(course) {
  if (!course) return BLANK_FORM;
  return {
    title: course.title ?? "",
    slug: course.slug ?? "",
    subtitle: course.subtitle ?? "",
    description: course.description ?? "",
    level: course.level ?? "",
    price: course.price ?? "",
    original_price: course.original_price ?? "",
    thumbnail_url: course.thumbnail_url ?? "",
    tags: Array.isArray(course.tags) ? course.tags.join(", ") : "",
    status: course.status ?? "draft",
  };
}

const inputClass =
  "w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container";
const labelClass = "font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase";

export default function CourseFormModal({ mode, course, onClose, onSaved }) {
  const [form, setForm] = useState(() => toFormState(mode === "edit" ? course : null));
  // In edit mode the slug already exists and shouldn't be silently rewritten
  // as the admin tweaks the title — only auto-suggest while untouched.
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(value) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  function handleSlugChange(value) {
    setSlugTouched(true);
    set("slug", value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Vui lòng nhập tiêu đề");
    if (!form.slug.trim()) return setError("Vui lòng nhập slug");
    if (!SLUG_RE.test(form.slug.trim())) return setError(SLUG_ERROR);

    const tags = form.tags.split(",").map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      level: form.level.trim() || null,
      price: form.price !== "" ? Number(form.price) : 0,
      original_price: form.original_price !== "" ? Number(form.original_price) : null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      tags,
      status: form.status,
    };

    setSaving(true);
    try {
      const res = mode === "create" ? await createCourse(payload) : await updateCourse(course.id, payload);
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
        className="glass-card max-w-2xl w-full rounded-2xl p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-border-subtle pb-4">
          <h3 className="font-headline-section text-headline-section-mobile text-ink-text">
            {mode === "create" ? "Tạo khóa học mới" : "Chỉnh sửa khóa học"}
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
            <label className={labelClass}>Tiêu đề</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Ví dụ: AI Mastery Pro"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={inputClass}
                placeholder="ai-mastery-pro"
              />
              <p className="text-xs text-slate-subtext/60">
                Chỉ chữ thường, số và dấu gạch ngang — ví dụ: ai-mastery-pro
              </p>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Trạng thái</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Mô tả ngắn (subtitle)</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Mô tả chi tiết</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputClass} h-28 resize-none`}
              placeholder="Nội dung dài hiển thị trên trang chi tiết khóa học..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Cấp độ</label>
              <input
                type="text"
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
                className={inputClass}
                placeholder="Nâng cao"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Ảnh thumbnail (URL)</label>
              <input
                type="text"
                value={form.thumbnail_url}
                onChange={(e) => set("thumbnail_url", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Giá (đ)</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Giá gốc (đ)</label>
              <input
                type="number"
                min="0"
                value={form.original_price}
                onChange={(e) => set("original_price", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Tags (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className={inputClass}
              placeholder="AI, Automation, SME"
            />
          </div>

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
              {saving ? "Đang lưu..." : "Lưu khóa học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
