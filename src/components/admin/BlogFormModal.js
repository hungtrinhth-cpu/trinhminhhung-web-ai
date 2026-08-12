"use client";

import { useState } from "react";
import { createBlogPost, updateBlogPost } from "@/app/[lang]/admin/blog/actions";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_ERROR = "Slug chỉ được dùng chữ thường, số và dấu gạch ngang, ví dụ: 5-cong-cu-ai-mien-phi";

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
  lang: "vi",
  excerpt: "",
  content: "",
  thumbnail_url: "",
  category: "",
  read_time_min: "",
  status: "draft",
  published_at: "",
};

function toDatetimeLocal(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toFormState(post) {
  if (!post) return BLANK_FORM;
  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    lang: post.lang ?? "vi",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    thumbnail_url: post.thumbnail_url ?? "",
    category: post.category ?? "",
    read_time_min: post.read_time_min ?? "",
    status: post.status ?? "draft",
    published_at: post.published_at ? toDatetimeLocal(post.published_at) : "",
  };
}

const inputClass =
  "w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container";
const labelClass = "font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase";

export default function BlogFormModal({ mode, post, onClose, onSaved }) {
  const [form, setForm] = useState(() => toFormState(mode === "edit" ? post : null));
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

    // Publishing without an explicit publish time would sort the post by a
    // null published_at (ordered before everything else) — default it to
    // "now" so a freshly-published post lands at the top of the list as
    // expected, without requiring the admin to set it by hand every time.
    const publishedAt = form.published_at
      ? new Date(form.published_at).toISOString()
      : form.status === "published"
        ? new Date().toISOString()
        : null;

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      lang: form.lang,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      category: form.category.trim() || null,
      read_time_min: form.read_time_min !== "" ? Number(form.read_time_min) : null,
      status: form.status,
      published_at: publishedAt,
    };

    setSaving(true);
    try {
      const res = mode === "create" ? await createBlogPost(payload) : await updateBlogPost(post.id, payload);
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
            {mode === "create" ? "Viết bài mới" : "Chỉnh sửa bài viết"}
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
              placeholder="Ví dụ: 5 Công Cụ AI Miễn Phí Giúp Tăng 300% Năng Suất Cho SME"
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
                placeholder="5-cong-cu-ai-mien-phi"
              />
              <p className="text-xs text-slate-subtext/60">
                Chỉ chữ thường, số và dấu gạch ngang — ví dụ: 5-cong-cu-ai-mien-phi
              </p>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Ngôn ngữ</label>
              <select value={form.lang} onChange={(e) => set("lang", e.target.value)} className={inputClass}>
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Chuyên mục</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputClass}
                placeholder="HƯỚNG DẪN"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Thời gian đọc (phút)</label>
              <input
                type="number"
                min="0"
                value={form.read_time_min}
                onChange={(e) => set("read_time_min", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Mô tả ngắn (excerpt)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className={`${inputClass} h-20 resize-none`}
              placeholder="Hiển thị ở trang danh sách blog..."
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Nội dung (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              className={`${inputClass} h-48 font-mono text-xs resize-none`}
              placeholder="<p>Nội dung bài viết...</p>"
            />
            <p className="text-xs text-slate-subtext/60">
              Nhập trực tiếp HTML — nội dung sẽ hiển thị nguyên văn trên trang chi tiết bài viết.
            </p>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Trạng thái</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Thời gian đăng</label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => set("published_at", e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-slate-subtext/60">Để trống — tự động dùng thời điểm lưu khi đăng</p>
            </div>
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
              {saving ? "Đang lưu..." : "Lưu bài viết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
