-- =========================================================================
-- SCHEMA BỔ SUNG: ZOOM_URL CHO WEBINAR - WEBAPP HUNG TRINH AI
-- File: supabase_schema_webinar_zoom_url.sql
-- Mô tả: Chạy SAU KHI đã chạy supabase_schema_webinar_payments.sql (cần
--        bảng public.webinars đã tồn tại). Chạy trực tiếp trên Supabase
--        SQL Editor.
--
-- Phạm vi: Thêm cột zoom_url vào public.webinars — admin nhập link Zoom
-- cho từng webinar, hệ thống tự gửi email chứa link này khi đơn hàng
-- chuyển sang trạng thái "đã thanh toán".
-- =========================================================================

alter table public.webinars add column if not exists zoom_url text;
