"use client";

import { useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockWebinars } from "@/lib/mock-data";

export default function WebinarDetailPage({ params }) {
  const { lang } = use(params);
  const webinar = mockWebinars[0];
  const [openLesson, setOpenLesson] = useState(null);

  const formatPrice = (p) => p.toLocaleString("vi-VN") + "đ";

  return (
    <>
      <Navbar lang={lang} />
      <main className="pt-20 bg-pure-white">
        {/* Hero */}
        <section className="bg-mist-bg py-16 px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-7xl mx-auto">
            {/* Badge row */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { icon: "schedule", label: webinar.duration },
                { icon: "signal_cellular_alt", label: webinar.level },
                { icon: "videocam", label: webinar.format },
                { icon: "event", label: webinar.date },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-container/10 text-primary-container font-button-text text-xs border border-primary-container/20">
                  <span className="material-symbols-outlined text-sm">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
              {/* Left */}
              <div className="space-y-6">
                <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-ink-text leading-tight">
                  {webinar.title}
                </h1>
                <p className="font-body-lg text-slate-subtext leading-relaxed max-w-2xl">
                  {webinar.subtitle}
                </p>

                {/* Instructor Card */}
                <div className="glass-card rounded-xl p-5 flex items-center gap-4 max-w-xl">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-container/20 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/anh-hung.jpg" alt="Hùng Trịnh" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="font-headline-sub text-headline-sub text-ink-text">{webinar.instructor}</p>
                    <p className="font-body-md text-slate-subtext">{webinar.instructorTitle}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-headline-sub text-headline-sub text-ink-text">Bạn sẽ học được gì?</h3>
                  <ul className="space-y-2">
                    {webinar.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary-container text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="font-body-lg text-slate-subtext">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Sticky Payment Card */}
              <div className="lg:sticky lg:top-28 h-fit">
                <div className="glass-card rounded-xl p-6 border border-primary-container/20 shadow-xl shadow-primary-container/5 space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-black text-primary-container">{formatPrice(webinar.price)}</span>
                      <span className="font-body-md text-slate-subtext line-through mb-1">{formatPrice(webinar.originalPrice)}</span>
                      <span className="bg-primary-container/10 text-primary-container text-xs font-bold px-2 py-0.5 rounded-full mb-1">-50%</span>
                    </div>
                    <p className="font-body-md text-slate-subtext text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-error">warning</span>
                      Còn <strong className="text-error">{webinar.seatsLeft}</strong> chỗ / {webinar.seats} — Early Bird
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {webinar.highlights.slice(0, 4).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary-container text-base mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="font-body-md text-slate-subtext text-sm">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/${lang}/thanh-toan/demo`}
                    className="block w-full py-4 bg-primary-container text-white text-center rounded-full font-button-text text-button-text uppercase tracking-[0.1em] shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                  >
                    Đăng ký ngay — {formatPrice(webinar.price)}
                  </Link>

                  <p className="text-center font-body-md text-slate-subtext/50 text-xs">
                    Hoàn tiền 100% trong vòng 24h nếu không hài lòng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="py-section-gap px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text mb-8">
              Chương trình học
            </h2>
            <div className="space-y-2">
              {webinar.curriculum.map((lesson) => (
                <div key={lesson.id} className="border border-border-subtle rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenLesson(openLesson === lesson.id ? null : lesson.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 bg-white hover:bg-mist-bg transition-colors text-left group"
                  >
                    <span className={`material-symbols-outlined text-xl transition-all ${openLesson === lesson.id ? "text-primary-container" : "text-slate-subtext/40 group-hover:text-primary-container"}`} style={{ fontVariationSettings: openLesson === lesson.id ? "'FILL' 1" : "'FILL' 0" }}>
                      play_circle
                    </span>
                    <span className="flex-1 font-body-lg text-ink-text">{lesson.title}</span>
                    <span className="font-body-md text-slate-subtext text-sm">{lesson.duration}</span>
                    <span className="material-symbols-outlined text-slate-subtext/40 transition-transform" style={{ transform: openLesson === lesson.id ? "rotate(180deg)" : "none" }}>
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
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-ink-text py-16 px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-headline-section text-headline-section-mobile md:text-headline-section text-pure-white">
              Chỉ còn <span className="text-primary-container">{webinar.seatsLeft} chỗ</span> — Đừng bỏ lỡ!
            </h2>
            <p className="font-body-lg text-pure-white/60">Giá Early Bird kết thúc khi hết chỗ.</p>
            <Link
              href={`/${lang}/thanh-toan/demo`}
              className="inline-block py-5 px-12 bg-primary-container text-white rounded-full font-button-text text-button-text uppercase tracking-[0.15em] shadow-2xl shadow-primary-container/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Đăng ký ngay — {formatPrice(webinar.price)}
            </Link>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
