"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login, signInWithGoogle } from "../actions";

const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";

export default function LoginPage() {
  const params = useParams();
  const lang = params.lang === "en" ? "en" : "vi";
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const next = searchParams.get("next");
  const registerHref = next
    ? `/${lang}/auth/register?next=${encodeURIComponent(next)}`
    : `/${lang}/auth/register`;

  const [state, formAction, isPending] = useActionState(
    async (_prev, formData) => await login(formData),
    null
  );

  const t = lang === "en"
    ? {
        eyebrow: "Student Portal",
        title: "Sign in",
        sub: "Choose your sign-in method",
        google: "Continue with Google",
        or: "Or",
        email: "Email",
        password: "Password",
        submit: "Sign in",
        submitting: "Signing in...",
        noAccount: "Don't have an account?",
        register: "Register now",
        callbackError: "Sign-in failed. Please try again.",
      }
    : {
        eyebrow: "Cổng Học Viên",
        title: "Đăng nhập",
        sub: "Chọn phương thức đăng nhập của bạn",
        google: "Tiếp tục với Google",
        or: "Hoặc",
        email: "Email",
        password: "Mật khẩu",
        submit: "Đăng nhập",
        submitting: "Đang đăng nhập...",
        noAccount: "Chưa có tài khoản?",
        register: "Đăng ký ngay",
        callbackError: "Đăng nhập thất bại. Vui lòng thử lại.",
      };

  return (
    <div className="min-h-screen bg-mist-bg flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href={`/${lang}`} className="font-headline-sub text-headline-sub font-black text-ink-text">
            Hung Trinh AI
          </Link>
          <p className="font-label-eyebrow text-label-eyebrow text-primary-container mt-2 uppercase tracking-widest">
            {t.eyebrow}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6 shadow-xl shadow-primary-container/5">
          <div className="text-center space-y-1">
            <h1 className="font-headline-section text-headline-section-mobile text-ink-text">{t.title}</h1>
            <p className="font-body-md text-slate-subtext">{t.sub}</p>
          </div>

          {callbackError && (
            <div className="text-error text-sm text-center bg-error/5 border border-error/20 rounded-lg py-2 px-3">
              {t.callbackError}
            </div>
          )}

          {GOOGLE_ENABLED && (
            <>
              {/* Google OAuth */}
              <form action={signInWithGoogle.bind(null, lang, next)}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-4 px-5 py-4 border border-border-subtle rounded-xl bg-white hover:bg-mist-bg hover:border-primary-container/30 transition-all duration-200 group"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-button-text text-button-text text-ink-text group-hover:text-primary-container transition-colors">
                    {t.google}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">{t.or}</span>
                <div className="flex-1 h-px bg-border-subtle" />
              </div>
            </>
          )}

          {/* Email/password form */}
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="lang" value={lang} />
            <input type="hidden" name="next" value={next ?? ""} />
            <div className="space-y-1">
              <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">{t.email}</label>
              <input
                type="email"
                name="email"
                required
                placeholder="example@gmail.com"
                className="w-full border-0 border-b border-border-subtle bg-transparent py-3 font-body-lg text-ink-text placeholder:text-ink-text/20 focus:outline-none focus:border-primary-container transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">{t.password}</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full border-0 border-b border-border-subtle bg-transparent py-3 font-body-lg text-ink-text placeholder:text-ink-text/20 focus:outline-none focus:border-primary-container transition-all"
              />
            </div>

            {state?.error && (
              <div className="text-error text-sm text-center">{state.error}</div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-primary-container text-white rounded-full font-button-text text-button-text uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-primary-container/20 disabled:opacity-60 disabled:hover:scale-100"
            >
              {isPending ? t.submitting : t.submit}
            </button>
          </form>
        </div>

        <p className="text-center font-body-md text-slate-subtext/60 mt-6 text-sm">
          {t.noAccount}{" "}
          <Link href={registerHref} className="text-primary-container hover:underline">
            {t.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
