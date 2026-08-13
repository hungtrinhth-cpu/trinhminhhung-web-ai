-- =========================================================================
-- SCHEMA BỔ SUNG: LESSON ATTACHMENT - WEBAPP HUNG TRINH AI
-- File: supabase_schema_lessons_attachment.sql
-- Mô tả: Chạy SAU KHI đã chạy supabase_schema_courses_lessons.sql (cần
--        bảng lessons đã tồn tại). Chạy trực tiếp trên Supabase SQL Editor.
--
-- Phạm vi: Thêm cột attachment_url cho bảng lessons — nút "Tài liệu" trên
-- trang bài học portal trước đây không có dữ liệu để hiển thị.
-- =========================================================================

alter table public.lessons add column if not exists attachment_url text;
