"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ZaloPopup from "@/components/ui/ZaloPopup";

const TRANSFER_CODE = "HTAIWEBINAR_REG123";
const BANK_ACCOUNT = "1234567890";
const BANK_NAME = "MB Bank";
const AMOUNT = "499.000đ";
const WEBINAR_TITLE = "AI Agent Thực Chiến 2025";

export default function CheckoutPage({ params }) {
  const { lang } = use(params);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showZaloPopup, setShowZaloPopup] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const isExpired = timeLeft <= 0;

  const copyCode = () => {
    navigator.clipboard.writeText(TRANSFER_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setShowConfirm(false);
    setShowZaloPopup(true);
  };

  return (
    <>
      <main className="min-h-screen bg-mist-bg py-12 px-container-padding-mobile">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href={`/${lang}`} className="font-headline-sub text-headline-sub font-black text-ink-text block">
              Hung Trinh AI
            </Link>
            <p className="font-label-eyebrow text-label-eyebrow text-primary-container uppercase tracking-widest">
              Thanh toán đăng ký
            </p>
          </div>

          {/* Student Info Card */}
          <div className="glass-card rounded-xl p-6 space-y-3">
            <h2 className="font-headline-sub text-headline-sub text-ink-text">{WEBINAR_TITLE}</h2>
            <div className="flex items-center justify-between py-3 border-b border-border-subtle">
              <span className="font-body-md text-slate-subtext">Học viên</span>
              <span className="font-button-text text-ink-text">Nguyễn Văn A</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border-subtle">
              <span className="font-body-md text-slate-subtext">Email</span>
              <span className="font-body-md text-ink-text">example@gmail.com</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-headline-sub text-ink-text">Số tiền thanh toán</span>
              <span className="text-2xl font-black text-primary-container">{AMOUNT}</span>
            </div>
          </div>

          {/* QR Section */}
          <div className="glass-card rounded-xl p-6 space-y-5 border border-primary-container/20">
            <div className="text-center space-y-2">
              <h2 className="font-headline-sub text-headline-sub text-ink-text">Quét mã QR để thanh toán</h2>
              <p className="font-body-md text-slate-subtext text-sm">
                Sử dụng app ngân hàng hoặc ví điện tử hỗ trợ VietQR
              </p>
            </div>

            {/* Countdown */}
            <div className="flex justify-center">
              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm ${
                isExpired ? "bg-error/10 text-error" : timeLeft < 120 ? "bg-error/10 text-error" : "bg-primary-container/10 text-primary-container"
              }`}>
                <span className="material-symbols-outlined text-base">timer</span>
                {isExpired ? "Mã QR đã hết hạn" : `Mã hết hạn sau ${minutes}:${seconds}`}
              </div>
            </div>

            {/* VietQR Image */}
            <div className="flex justify-center">
              {isExpired ? (
                <div className="w-64 h-64 bg-mist-bg rounded-xl border-2 border-dashed border-outline flex flex-col items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-slate-subtext/40">qr_code_2</span>
                  <p className="font-body-md text-slate-subtext text-sm text-center px-4">Mã đã hết hạn</p>
                  <button
                    onClick={() => setTimeLeft(15 * 60)}
                    className="bg-primary-container text-white px-5 py-2 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform"
                  >
                    Tạo mã mới
                  </button>
                </div>
              ) : (
                <div className="w-64 h-64 bg-white rounded-xl border border-border-subtle p-3 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.vietqr.io/image/MB-${BANK_ACCOUNT}-compact2.png?amount=499000&addInfo=${TRANSFER_CODE}&accountName=HUNG+TRINH+AI`}
                    alt="VietQR Thanh toán"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Bank Info */}
            <div className="bg-mist-bg rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-slate-subtext text-sm">Ngân hàng</span>
                <span className="font-button-text text-ink-text text-sm">{BANK_NAME}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-slate-subtext text-sm">Số tài khoản</span>
                <span className="font-button-text text-ink-text text-sm">{BANK_ACCOUNT}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-slate-subtext text-sm">Số tiền</span>
                <span className="font-button-text text-primary-container text-sm">{AMOUNT}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
                <div>
                  <p className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase mb-1">Nội dung chuyển khoản</p>
                  <p className="font-button-text text-ink-text tracking-wider">{TRANSFER_CODE}</p>
                </div>
                <button
                  onClick={copyCode}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-primary-container/10 text-primary-container hover:bg-primary-container/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{copied ? "check" : "content_copy"}</span>
                  {copied ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-5 bg-primary-container text-white rounded-full font-button-text text-button-text uppercase tracking-[0.15em] shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            TÔI ĐÃ THANH TOÁN
          </button>

          <p className="text-center font-body-md text-slate-subtext/60 text-xs">
            Sau khi chuyển khoản, hệ thống tự động xác nhận trong 1-3 phút.
            <br />Vấn đề hỗ trợ: <strong>Zalo 090 000 0000</strong>
          </p>
        </div>
      </main>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6" onClick={() => setShowConfirm(false)}>
          <div
            className="glass-card max-w-sm w-full rounded-2xl p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-3">
              <span className="material-symbols-outlined text-5xl text-primary-container">payments</span>
              <h3 className="font-headline-section text-headline-section-mobile text-ink-text">Xác nhận đã chuyển khoản?</h3>
              <p className="font-body-md text-slate-subtext">
                Nhấn xác nhận để hệ thống kiểm tra. Quá trình xác minh diễn ra trong 1-3 phút.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-border-subtle rounded-full font-button-text text-button-text text-ink-text hover:bg-mist-bg transition-colors"
              >
                Chưa, quay lại
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-105 transition-transform"
              >
                Đã chuyển khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zalo Popup on success */}
      <ZaloPopup isOpen={showZaloPopup} onClose={() => setShowZaloPopup(false)} />
    </>
  );
}
