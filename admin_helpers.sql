-- =========================================================================
-- ADMIN & ACCOUNT HELPERS — Webapp Hung Trinh AI
-- Chạy trên Supabase SQL Editor khi cần.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. NÂNG QUYỀN MỘT TÀI KHOẢN LÊN ADMIN (theo email)
--    Dùng khi user đã đăng ký sẵn và bạn muốn cấp quyền admin.
-- -------------------------------------------------------------------------
update public.profiles
set role = 'admin', updated_at = now()
where email = 'admin@hungtrinh.ai';   -- ⟵ đổi email tại đây


-- -------------------------------------------------------------------------
-- 2. BỎ XÁC THỰC EMAIL CHO MỘT TÀI KHOẢN (cho phép đăng nhập ngay)
--    Đặt email_confirmed_at = now() để Supabase coi như đã xác thực.
-- -------------------------------------------------------------------------
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'admin@hungtrinh.ai';   -- ⟵ đổi email tại đây


-- -------------------------------------------------------------------------
-- 3. BỎ XÁC THỰC CHO TẤT CẢ TÀI KHOẢN HIỆN CÓ (1 lần, môi trường test)
--    Hữu ích nếu trước đó đã tạo user khi còn bật "Confirm email".
-- -------------------------------------------------------------------------
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null;


-- -------------------------------------------------------------------------
-- 4. (TUỲ CHỌN) HÀM TIỆN ÍCH: nâng quyền admin nhanh bằng 1 lệnh
--    Sau khi tạo hàm, gọi:  select public.make_admin('email@abc.com');
-- -------------------------------------------------------------------------
create or replace function public.make_admin(target_email text)
returns text as $$
declare
  affected int;
begin
  update public.profiles
  set role = 'admin', updated_at = now()
  where email = target_email;
  get diagnostics affected = row_count;

  update auth.users
  set email_confirmed_at = coalesce(email_confirmed_at, now())
  where email = target_email;

  if affected = 0 then
    return 'Không tìm thấy profile cho: ' || target_email;
  end if;
  return 'Đã cấp quyền admin + xác thực cho: ' || target_email;
end;
$$ language plpgsql security definer;

-- Ví dụ sử dụng:
-- select public.make_admin('admin@hungtrinh.ai');


-- -------------------------------------------------------------------------
-- 5. KIỂM TRA NHANH các tài khoản & vai trò hiện có
-- -------------------------------------------------------------------------
-- select p.email, p.role, p.full_name,
--        (u.email_confirmed_at is not null) as da_xac_thuc
-- from public.profiles p
-- join auth.users u on u.id = p.id
-- order by p.created_at desc;
