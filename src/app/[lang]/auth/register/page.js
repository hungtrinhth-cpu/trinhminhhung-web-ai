"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "../actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    return await signup(formData);
  }, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-headline-section font-extrabold text-ink-text">
            Tạo tài khoản mới
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Địa chỉ Email"
              placeholder="Nhập email của bạn"
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="Mật khẩu"
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
            />
          </div>

          {state?.error && (
            <div className="text-error text-sm text-center">
              {state.error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full justify-center"
            >
              {isPending ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="font-body-md text-slate-subtext">
            Đã có tài khoản?{" "}
            <Link href="/vi/auth/login" className="font-button-text text-primary-container hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
