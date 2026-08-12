"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBlogPost } from "@/app/[lang]/admin/blog/actions";
import BlogFormModal from "./BlogFormModal";

const STATUS_LABEL = { draft: "Nháp", published: "Đã đăng" };
const STATUS_STYLE = {
  draft: "text-yellow-700 bg-yellow-50",
  published: "text-green-700 bg-green-50",
};
const LANG_LABEL = { vi: "VI", en: "EN" };

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
}

export default function BlogClient({ initialPosts }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  // router.refresh() re-renders the parent Server Component and passes a new
  // initialPosts prop, but useState's initializer only runs on first mount —
  // without this sync-during-render, a newly created post never shows up
  // until a full page reload. Adjusting state during render (not in an
  // effect) per React's recommended pattern for this exact case.
  const [prevInitialPosts, setPrevInitialPosts] = useState(initialPosts);
  if (initialPosts !== prevInitialPosts) {
    setPrevInitialPosts(initialPosts);
    setPosts(initialPosts);
  }
  const [editingPost, setEditingPost] = useState(null);

  function refresh() {
    startTransition(() => router.refresh());
  }

  function openCreate() {
    setModalMode("create");
    setEditingPost(null);
    setModalOpen(true);
  }

  function openEdit(post) {
    setModalMode("edit");
    setEditingPost(post);
    setModalOpen(true);
  }

  async function handleStatusChange(post, status) {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status } : p)));
    const res = await updateBlogPost(post.id, { status });
    if (res?.error) refresh();
  }

  function handleSaved() {
    setModalOpen(false);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
            Quản lý Blog
          </h1>
          <p className="font-body-md text-slate-subtext mt-1">
            Tạo, sửa và đổi trạng thái bài viết hiển thị trên trang public
          </p>
        </div>
        <button
          onClick={openCreate}
          disabled={isPending}
          className="bg-primary-container text-white px-5 py-3 rounded-full font-button-text text-button-text uppercase tracking-wider shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Viết bài mới
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tiêu đề</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Slug</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Ngôn ngữ</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Chuyên mục</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Ngày đăng</th>
                <th className="p-4 font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Trạng thái</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-mist-bg transition-colors"
                >
                  <td className="p-4 font-body-md text-ink-text font-bold max-w-[240px] truncate">{p.title}</td>
                  <td className="p-4 font-body-md text-slate-subtext max-w-[180px] truncate">{p.slug}</td>
                  <td className="p-4 font-body-md text-slate-subtext">{LANG_LABEL[p.lang] ?? p.lang}</td>
                  <td className="p-4 font-body-md text-slate-subtext">{p.category ?? "—"}</td>
                  <td className="p-4 font-body-md text-slate-subtext whitespace-nowrap">
                    {formatDate(p.published_at)}
                  </td>
                  <td className="p-4">
                    <select
                      value={p.status}
                      disabled={isPending}
                      onChange={(e) => handleStatusChange(p, e.target.value)}
                      className={`border border-border-subtle rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-primary-container ${STATUS_STYLE[p.status] ?? ""}`}
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="w-9 h-9 rounded-full bg-mist-bg text-slate-subtext hover:text-primary-container hover:bg-primary-container/10 transition-colors inline-flex items-center justify-center"
                      title="Sửa bài viết"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">article</span>
            <p className="font-body-lg text-slate-subtext">Chưa có bài viết nào</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <BlogFormModal
          mode={modalMode}
          post={editingPost}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
