-- =========================================================================
-- SCHEMA BỔ SUNG: SEPAY WEBHOOK DEDUP - WEBAPP HUNG TRINH AI
-- File: supabase_schema_sepay_webhook.sql
-- Mô tả: Chạy SAU KHI đã chạy supabase_schema.sql và
--        supabase_schema_webinar_payments.sql (cần bảng payment_orders và
--        hàm get_user_role() đã tồn tại). Chạy trực tiếp trên Supabase SQL
--        Editor.
--
-- Phạm vi: Bảng chống trùng lặp cho webhook SePay — SePay có thể gửi lại
-- cùng một giao dịch nhiều lần (retry/replay), unique constraint trên
-- sepay_transaction_id là cơ chế chống xử lý trùng, dùng DB thay vì memory
-- (đúng theo yêu cầu, vì Vercel serverless không có shared memory giữa các
-- lần gọi function).
-- =========================================================================

create table if not exists public.sepay_webhook_events (
    id bigserial primary key,
    sepay_transaction_id text not null unique,
    payload jsonb not null,
    order_id uuid references public.payment_orders(id) on delete set null,
    matched boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_sepay_webhook_events_order_id on public.sepay_webhook_events(order_id);

alter table public.sepay_webhook_events enable row level security;

-- Admin-only read (để tra cứu/debug sau này) — route webhook ghi bằng
-- service-role client nên bypass RLS, policy này chỉ áp dụng cho truy vấn
-- qua client thường (vd. một trang admin xem log trong tương lai).
drop policy if exists "Sepay webhook events: chỉ Admin được xem" on public.sepay_webhook_events;
create policy "Sepay webhook events: chỉ Admin được xem"
on public.sepay_webhook_events for select
using ( public.get_user_role(auth.uid()) = 'admin' );
