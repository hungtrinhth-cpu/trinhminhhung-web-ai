"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { signup, signInWithGoogle } from "../actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const params = useParams();
  const lang = params.lang === "en" ? "en" : "vi";

  const [state, formAction, isPending] = useActionState(
    async (_prev, formData) => await signup(formData),
    null
  );

  const t = lang === "en"
    ? {
        title: "Create a new account",
        google: "Continue with Google",
        or: "Or",
        name: "Full name",
        namePlaceholder: "Enter your name",
        email: "Email address",
        emailPlaceholder: "Enter your email",
        password: "Password",
        passwordPlaceholder: "Create a password (min. 6 characters)",
        submit: "Register",
        submitting: "Processing...",
        haveAccount: "Already have an account?",
        login: "Sign in now",
      }
    : {
        title: "Tạo tài khoản mới",
        google: "Tiếp tục với Google",
        or: "Hoặc",
        name: "Họ và tên",
        namePlaceholder: "Nhập tên của bạn",
        email: "Địa chỉ Email",
        emailPlaceholder: "Nhập email của bạn",
        password: "Mật khẩu",
        passwordPlaceholder: "Tạo mật khẩu (ít nhất 6 ký tự)",
        submit: "Đăng ký",
        submitting: "Đang xử lý...",
        haveAccount: "Đã có tài khoản?",
        login: "Đăng nhập ngay",
      };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 glass-card p-10 rounded-2xl">
        <h2 className="text-center text-3xl font-headline-section font-extrabold text-ink-text">
          {t.title}
        </h2>

        {/* Google OAuth */}
        <form action={signInWithGoogle.bind(null, lang)}>
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

        <form className="space-y-5" action={formAction}>
          <input type="hidden" name="lang" value={lang} />
          <Input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            label={t.name}
            placeholder={t.namePlaceholder}
          />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            label={t.email}
            placeholder={t.emailPlaceholder}
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            label={t.password}
            placeholder={t.passwordPlaceholder}
          />

          {state?.error && (
            <div className="text-error text-sm text-center">{state.error}</div>
          )}

          <Button type="submit" disabled={isPending} className="w-full justify-center">
            {isPending ? t.submitting : t.submit}
          </Button>
        </form>

        <div className="text-center">
          <p className="font-body-md text-slate-subtext">
            {t.haveAccount}{" "}
            <Link href={`/${lang}/auth/login`} className="font-button-text text-primary-container hover:underline">
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
