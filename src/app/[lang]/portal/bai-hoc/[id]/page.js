"use client";

import { useState, use } from "react";
import { mockLessons } from "@/lib/mock-data";

const AI_MESSAGES = [
  { role: "bot", text: "Xin chào! Tôi là AI Trợ Giảng. Hãy hỏi bất kỳ câu hỏi nào liên quan đến bài học này nhé! 🤖" },
];

const MOCK_ANSWERS = [
  "RAG (Retrieval-Augmented Generation) là kỹ thuật kết hợp LLM với cơ sở dữ liệu kiến thức riêng của doanh nghiệp, giúp AI trả lời chính xác hơn với thông tin nội bộ.",
  "Bạn nên bắt đầu với use case đơn giản nhất — ví dụ tự động hóa email trả lời khách hàng. Chi phí thấp, thấy kết quả nhanh.",
  "Prompt tốt cần có: vai trò rõ ràng (Role), ngữ cảnh đầy đủ (Context), yêu cầu cụ thể (Task), và định dạng kết quả mong muốn (Format).",
];

export default function LessonDetailPage({ params }) {
  use(params);
  const lessons = mockLessons;
  const [activeLesson, setActiveLesson] = useState(1);
  const [activeTab, setActiveTab] = useState("content");
  const [chatMessages, setChatMessages] = useState(AI_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const currentLesson = lessons.find((l) => l.id === String(activeLesson)) || lessons[0];
  const answerIndex = chatMessages.filter((m) => m.role === "bot").length % MOCK_ANSWERS.length;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessages = [
      ...chatMessages,
      { role: "user", text: chatInput },
      { role: "bot", text: MOCK_ANSWERS[answerIndex] },
    ];
    setChatMessages(newMessages);
    setChatInput("");
  };

  return (
    <div className="flex gap-0 -m-8 min-h-[calc(100vh-120px)]">
      {/* Icon-only sidebar for lessons */}
      <div className="w-20 shrink-0 bg-pure-white border-r border-border-subtle overflow-y-auto flex flex-col items-center py-4 gap-1 hidden md:flex">
        {lessons.map((lesson) => {
          const isActive = String(activeLesson) === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(Number(lesson.id))}
              title={`Bài ${lesson.id}: ${lesson.title}`}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all group ${
                isActive
                  ? "bg-primary-container/10 text-primary-container"
                  : "text-slate-subtext hover:bg-mist-bg hover:text-primary-container"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-primary-container rounded-r-full" />
              )}
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: lesson.completed ? "'FILL' 1" : "'FILL' 0" }}
              >
                {lesson.completed ? "check_circle" : "play_circle"}
              </span>
              {/* Tooltip */}
              <div className="absolute left-14 z-50 hidden group-hover:block bg-ink-text text-white text-xs rounded-lg px-3 py-2 w-48 pointer-events-none shadow-xl">
                Bài {lesson.id}: {lesson.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main: Video (60%) + Tab Panel (40%) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video Area — 60% */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* YouTube Embed */}
          <div className="aspect-video bg-ink-text rounded-xl overflow-hidden relative">
            <iframe
              src={`https://www.youtube.com/embed/${currentLesson?.videoId || "dQw4w9WgXcQ"}?rel=0&modestbranding=1`}
              title={currentLesson?.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Lesson title */}
          <div className="space-y-2">
            <h2 className="font-headline-section text-headline-section-mobile text-ink-text">
              Bài {activeLesson}: {currentLesson?.title}
            </h2>
            <p className="font-body-md text-slate-subtext">{currentLesson?.description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="bg-primary-container text-white px-5 py-2.5 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check</span>
              Đánh dấu hoàn thành
            </button>
            <button className="border border-outline-variant text-ink-text px-5 py-2.5 rounded-full font-button-text text-button-text text-sm hover:bg-mist-bg transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Tài liệu
            </button>
          </div>
        </div>

        {/* Tab Panel — 40% */}
        <div className="w-full md:w-[40%] md:min-w-[340px] border-l border-border-subtle flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-border-subtle shrink-0">
            {[
              { id: "content", label: "NỘI DUNG KHÓA HỌC" },
              { id: "ai", label: "TRỢ LÝ AI HỌC TẬP" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 font-label-eyebrow text-label-eyebrow uppercase transition-all ${
                  activeTab === tab.id
                    ? "text-primary-container border-b-2 border-primary-container bg-primary-container/5"
                    : "text-slate-subtext hover:text-ink-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Lesson List */}
          {activeTab === "content" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {lessons.map((lesson) => {
                const isActive = String(activeLesson) === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(Number(lesson.id))}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-primary-container/10 text-primary-container"
                        : "hover:bg-mist-bg text-slate-subtext"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        lesson.completed ? "text-green-500" : isActive ? "text-primary-container" : "text-slate-subtext/30"
                      }`}
                      style={{ fontVariationSettings: lesson.completed ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {lesson.completed ? "check_circle" : "play_circle"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-body-md truncate ${isActive ? "font-bold" : ""}`}>
                        Bài {lesson.id}: {lesson.title}
                      </p>
                      <p className="text-xs text-slate-subtext/60">{lesson.duration}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab: AI Chat */}
          {activeTab === "ai" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm text-primary-container">smart_toy</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl text-sm font-body-md leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary-container text-white rounded-br-none"
                          : "bg-mist-bg text-slate-subtext rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-border-subtle">
                <div className="relative">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Hỏi AI về bài học này..."
                    className="w-full bg-white border border-outline-variant rounded-full px-5 py-3 pr-12 font-body-md text-ink-text focus:outline-none focus:border-primary-container transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary-container text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
