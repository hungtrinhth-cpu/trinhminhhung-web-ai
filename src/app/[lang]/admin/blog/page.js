"use client";

import { useState } from "react";
import Image from "next/image";
import { mockBlogPosts } from "@/lib/mock-data";

const CATEGORIES = ["TẤT CẢ", "CÔNG NGHỆ", "HƯỚNG DẪN", "TIN TỨC"];

export default function AdminBlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("TẤT CẢ");
  const [posts, setPosts] = useState(mockBlogPosts);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "TẤT CẢ" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const deletePost = (id) => {
    if (confirm("Xóa bài viết này?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">Quản lý Blog</h1>
        <p className="font-body-md text-slate-subtext mt-1">{posts.length} bài viết</p>
      </div>

      {/* Search & Create */}
      <div className="space-y-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-subtext/60">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-12 pr-4 py-3 bg-mist-bg rounded-xl font-body-md text-ink-text placeholder:text-slate-subtext/40 focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
          />
        </div>
        <button className="w-full py-4 bg-primary-container text-white rounded-full font-button-text text-button-text uppercase tracking-[0.1em] shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">add</span>
          VIẾT BÀI MỚI
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-label-eyebrow text-label-eyebrow whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-primary-container text-white"
                : "bg-mist-bg text-slate-subtext hover:bg-primary-container/10 hover:text-primary-container border border-border-subtle"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Post List */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className={`glass-card rounded-xl p-4 space-y-4 border hover:border-primary-container/20 transition-all ${
              !post.thumbnail ? "border-l-4 border-l-primary-container" : "border-border-subtle"
            }`}
          >
            {post.thumbnail && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  width={600}
                  height={338}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="bg-primary-container/5 text-primary-container text-[10px] font-bold px-2 py-1 rounded-full border border-primary-container/10 tracking-wider">
                  {post.category}
                </span>
                <span className="font-body-md text-slate-subtext text-xs">{post.date}</span>
              </div>
              <h3 className="font-headline-sub text-headline-sub text-ink-text leading-tight">{post.title}</h3>
              <p className="font-body-md text-slate-subtext text-sm line-clamp-2">{post.excerpt}</p>
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-border-subtle">
              <div className="w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-[10px] font-bold">
                {post.author}
              </div>
              <div className="flex gap-4">
                <button className="text-slate-subtext hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-slate-subtext hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">article</span>
            <p className="font-body-lg text-slate-subtext">Không tìm thấy bài viết nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
