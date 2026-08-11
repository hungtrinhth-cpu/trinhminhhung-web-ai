"use client";

import { useState } from "react";

export default function WebinarCurriculum({ curriculum }) {
  const [openLesson, setOpenLesson] = useState(null);

  return (
    <div className="space-y-2">
      {curriculum.map((lesson) => (
        <div key={lesson.id} className="border border-border-subtle rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenLesson(openLesson === lesson.id ? null : lesson.id)}
            className="w-full flex items-center gap-4 px-6 py-4 bg-white hover:bg-mist-bg transition-colors text-left group"
          >
            <span
              className={`material-symbols-outlined text-xl transition-all ${
                openLesson === lesson.id ? "text-primary-container" : "text-slate-subtext/40 group-hover:text-primary-container"
              }`}
              style={{ fontVariationSettings: openLesson === lesson.id ? "'FILL' 1" : "'FILL' 0" }}
            >
              play_circle
            </span>
            <span className="flex-1 font-body-lg text-ink-text">{lesson.title}</span>
            <span className="font-body-md text-slate-subtext text-sm">{lesson.duration}</span>
            <span
              className="material-symbols-outlined text-slate-subtext/40 transition-transform"
              style={{ transform: openLesson === lesson.id ? "rotate(180deg)" : "none" }}
            >
              expand_more
            </span>
          </button>
          {openLesson === lesson.id && (
            <div className="px-6 py-4 bg-mist-bg border-t border-border-subtle">
              <p className="font-body-md text-slate-subtext">
                {lesson.type === "demo" ? "🎬 Bài thực hành trực tiếp" : lesson.type === "qa" ? "💬 Hỏi đáp trực tiếp" : "📹 Video bài giảng"}
                {" "}— {lesson.duration}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
