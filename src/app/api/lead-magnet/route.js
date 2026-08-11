import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, sendTelegram } from "@/lib/notifications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public lead-capture endpoint for landing-page forms / lead magnets.
 * Body: { name, email, phone?, source?, resourceUrl? }
 *
 * 1. Insert the lead (service role → bypasses RLS, but this is a trusted server route)
 * 2. Email the requested resource to the lead (if configured)
 * 3. Notify admin on Telegram
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const source = (body.source ?? "Lead Magnet").trim();
  const resourceUrl = body.resourceUrl;

  if (!name) {
    return NextResponse.json({ error: "Vui lòng nhập họ tên" }, { status: 422 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 422 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { error: "Cần email hoặc số điện thoại" },
      { status: 422 }
    );
  }

  const supabase = createAdminClient();

  // Find or create the lead list for this source/campaign.
  let listId = null;
  const { data: existingList } = await supabase
    .from("lead_lists")
    .select("id")
    .eq("name", source)
    .maybeSingle();
  if (existingList) {
    listId = existingList.id;
  } else {
    const { data: created } = await supabase
      .from("lead_lists")
      .insert({ name: source })
      .select("id")
      .single();
    listId = created?.id ?? null;
  }

  // Default to first pipeline stage.
  const { data: firstStage } = await supabase
    .from("pipeline_stages")
    .select("id")
    .order("order", { ascending: true })
    .limit(1)
    .single();

  const { error: insertErr } = await supabase.from("leads").insert({
    first_name: name,
    email: email || null,
    phone: phone || null,
    list_id: listId,
    stage_id: firstStage?.id ?? null,
  });

  if (insertErr) {
    console.error("lead-magnet insert error:", insertErr.message);
    return NextResponse.json({ error: "Không lưu được thông tin" }, { status: 500 });
  }

  // Fire-and-forget notifications (do not block the response on failures).
  const tasks = [];
  if (email) {
    tasks.push(
      sendEmail({
        to: email,
        subject: "Tài liệu AI miễn phí từ Hung Trinh AI",
        html: `
          <p>Xin chào ${name},</p>
          <p>Cảm ơn bạn đã quan tâm! ${
            resourceUrl
              ? `Bạn có thể tải tài liệu tại đây: <a href="${resourceUrl}">${resourceUrl}</a>`
              : "Chúng tôi sẽ sớm gửi tài liệu cho bạn."
          }</p>
          <p>Trân trọng,<br/>Hung Trinh AI</p>
        `,
      })
    );
  }
  tasks.push(
    sendTelegram(
      `🎯 <b>Lead mới</b>\nTên: ${name}\nEmail: ${email || "—"}\nSĐT: ${phone || "—"}\nNguồn: ${source}`
    )
  );
  await Promise.allSettled(tasks);

  return NextResponse.json({ ok: true });
}
