-- =========================================================================
-- SCHEMA BỔ SUNG: CLIENT ERRORS - WEBAPP HUNG TRINH AI
-- File: supabase_schema_client_errors.sql
-- Mô tả: Chạy trực tiếp trên Supabase SQL Editor.
--
-- Phạm vi: Bảng lưu lỗi JS phía client (console.error, uncaught exception,
-- unhandled promise rejection) — bản "ít nhất" thay Sentry, không cần tài
-- khoản/dịch vụ ngoài. Ghi qua service-role (route /api/client-error),
-- không có policy cho phép client tự ghi trực tiếp.
-- =========================================================================

create table if not exists public.client_errors (
    id uuid primary key default gen_random_uuid(),
    message text not null,
    stack text,
    source text not null default 'window.onerror' check (source in ('window.onerror', 'unhandledrejection', 'console.error')),
    url text,
    user_agent text,
    user_id uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now()
);

create index if not exists idx_client_errors_created_at on public.client_errors(created_at desc);

alter table public.client_errors enable row level security;

-- Admin-only read; no public read/write policy at all — writes only via the
-- service-role client in the API route, which bypasses RLS.
drop policy if exists "Client errors: chỉ Admin được xem" on public.client_errors;
create policy "Client errors: chỉ Admin được xem"
on public.client_errors for select
using ( public.get_user_role(auth.uid()) = 'admin' );
