"use client";

import { useState } from "react";
import { createWebinar, updateWebinar } from "@/app/[lang]/admin/webinars/actions";

const CURRICULUM_TYPES = ["video", "demo", "qa"];
const CURRICULUM_PLACEHOLDER = `[
  { "id": 1, "title": "Giới thiệu", "duration": "30 phút", "type": "video" }
]`;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_ERROR = "Slug chỉ được dùng chữ thường, số và dấu gạch ngang, ví dụ: ai-agent-2025";

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
  instructor: "",
  instructor_title: "",
  scheduled_at: "",
  duration_min: "",
  format: "",
  level: "",
  price: "",
  original_price: "",
  seats_total: "",
  seats_left: "",
  thumbnail_url: "",
  tags: "",
  highlights: "",
  curriculum: "[]",
  status: "draft",
  zoom_url: "",
};

function toDatetimeLocal(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toFormState(webinar) {
  if (!webinar) return BLANK_FORM;
  return {
    title: webinar.title ?? "",
    slug: webinar.slug ?? "",
    subtitle: webinar.subtitle ?? "",
    instructor: webinar.instructor ?? "",
    instructor_title: webinar.instructor_title ?? "",
    scheduled_at: webinar.scheduled_at ? toDatetimeLocal(webinar.scheduled_at) : "",
    duration_min: webinar.duration_min ?? "",
    format: webinar.format ?? "",
    level: webinar.level ?? "",
    price: webinar.price ?? "",
    original_price: webinar.original_price ?? "",
    seats_total: webinar.seats_total ?? "",
    seats_left: webinar.seats_left ?? "",
    thumbnail_url: webinar.thumbnail_url ?? "",
    tags: Array.isArray(webinar.tags) ? webinar.tags.join(", ") : "",
    highlights: Array.isArray(webinar.highlights) ? webinar.highlights.join("\n") : "",
    curriculum: Array.isArray(webinar.curriculum) ? JSON.stringify(webinar.curriculum, null, 2) : "[]",
    status: webinar.status ?? "draft",
    zoom_url: webinar.zoom_url ?? "",
  };
}

function validateCurriculumClient(curriculum) {
  if (!Array.isArray(curriculum)) return "Chương trình học phải là một mảng JSON, ví dụ: [ {...} ]";
  for (let i = 0; i < curriculum.length; i++) {
    const item = curriculum[i];
    if (!item || typeof item !== "object") return `Mục #${i + 1} không hợp lệ`;
    if (item.id === undefined || item.id === null || item.id === "") return `Mục #${i + 1} thiếu "id"`;
    if (!item.title) return `Mục #${i + 1} thiếu "title"`;
    if (!item.duration) return `Mục #${i + 1} thiếu "duration"`;
    if (!CURRICULUM_TYPES.includes(item.type)) return `Mục #${i + 1} có "type" không hợp lệ (chỉ nhận video/demo/qa)`;
  }
  return null;
}

const inputClass =
  "w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container";
const labelClass = "font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase";

export default function WebinarFormModal({ mode, webinar, onClose, onSaved }) {
  const [form, setForm] = useState(() => toFormState(mode === "edit" ? webinar : null));
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

    let curriculum;
    try {
      curriculum = form.curriculum.trim() ? JSON.parse(form.curriculum) : [];
    } catch {
      return setError("Chương trình học (curriculum) không phải JSON hợp lệ");
    }
    const curriculumError = validateCurriculumClient(curriculum);
    if (curriculumError) return setError(curriculumError);

    const tags = form.tags.split(",").map((s) => s.trim()).filter(Boolean);
    const highlights = form.highlights.split("\n").map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      subtitle: form.subtitle.trim() || null,
      instructor: form.instructor.trim() || null,
      instructor_title: form.instructor_title.trim() || null,
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      duration_min: form.duration_min !== "" ? Number(form.duration_min) : null,
      format: form.format.trim() || null,
      level: form.level.trim() || null,
      price: form.price !== "" ? Number(form.price) : 0,
      original_price: form.original_price !== "" ? Number(form.original_price) : null,
      seats_total: form.seats_total !== "" ? Number(form.seats_total) : null,
      seats_left: form.seats_left !== "" ? Number(form.seats_left) : null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      tags,
      highlights,
      curriculum,
      status: form.status,
      zoom_url: form.zoom_url.trim() || null,
    };

    setSaving(true);
    const res =
      mode === "create" ? await createWebinar(payload) : await updateWebinar(webinar.id, payload);
    setSaving(false);

    if (res?.error) {
      setError(res.error);
      return;
    }
    onSaved?.();
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
            {mode === "create" ? "Tạo webinar mới" : "Chỉnh sửa webinar"}
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
              placeholder="Ví dụ: AI Agent Thực Chiến 2025"
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
                placeholder="ai-agent-2025"
              />
              <p className="text-xs text-slate-subtext/60">
                Chỉ chữ thường, số và dấu gạch ngang — ví dụ: ai-agent-2025
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Giảng viên</label>
              <input
                type="text"
                value={form.instructor}
                onChange={(e) => set("instructor", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Chức danh giảng viên</label>
              <input
                type="text"
                value={form.instructor_title}
                onChange={(e) => set("instructor_title", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Thời gian diễn ra</label>
              <input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => set("scheduled_at", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Thời lượng (phút)</label>
              <input
                type="number"
                min="0"
                value={form.duration_min}
                onChange={(e) => set("duration_min", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Hình thức</label>
              <input
                type="text"
                value={form.format}
                onChange={(e) => set("format", e.target.value)}
                className={inputClass}
                placeholder="Online Live"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Cấp độ</label>
              <input
                type="text"
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
                className={inputClass}
                placeholder="Trung cấp"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Tổng số chỗ</label>
              <input
                type="number"
                min="0"
                value={form.seats_total}
                onChange={(e) => set("seats_total", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Số chỗ còn lại</label>
              <input
                type="number"
                min="0"
                value={form.seats_left}
                onChange={(e) => set("seats_left", e.target.value)}
                className={inputClass}
              />
            </div>
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

          <div className="space-y-1.5">
            <label className={labelClass}>Link Zoom</label>
            <input
              type="text"
              value={form.zoom_url}
              onChange={(e) => set("zoom_url", e.target.value)}
              className={inputClass}
              placeholder="https://zoom.us/j/..."
            />
            <p className="text-xs text-slate-subtext/60">
              Tự động gửi trong email cho học viên ngay khi đơn hàng chuyển sang “đã thanh toán”
            </p>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Tags (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className={inputClass}
              placeholder="AI Agent, Automation, SME"
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Highlights (mỗi dòng 1 gạch đầu dòng)</label>
            <textarea
              value={form.highlights}
              onChange={(e) => set("highlights", e.target.value)}
              className={`${inputClass} h-28 resize-none`}
              placeholder={"Hiểu bản chất AI Agent hiện đại\nXây dựng agent tự động trả lời khách hàng"}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Chương trình học (curriculum — JSON)</label>
            <textarea
              value={form.curriculum}
              onChange={(e) => set("curriculum", e.target.value)}
              className={`${inputClass} h-40 font-mono text-xs resize-none`}
              placeholder={CURRICULUM_PLACEHOLDER}
            />
            <p className="text-xs text-slate-subtext/60">
              Mảng object gồm id, title, duration, type (type chỉ nhận video/demo/qa).
            </p>
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
              {saving ? "Đang lưu..." : "Lưu webinar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
