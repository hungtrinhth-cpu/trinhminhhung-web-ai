import { sendEmail } from "@/lib/notifications";

// Temporary diagnostic route — confirms RESEND_API_KEY is a real, working
// key. No user input controls the recipient, so this cannot be used to
// relay email to arbitrary addresses. Delete after use.
const TEST_RECIPIENT = "hungtrinhth@gmail.com";

export async function GET(request) {
  const key = process.env.RESEND_API_KEY;
  const status = {
    present: !!key,
    length: key ? key.length : 0,
    prefixOk: !!key && key.startsWith("re_"),
  };

  const { searchParams } = new URL(request.url);
  if (searchParams.get("send") === "1") {
    const result = await sendEmail({
      to: TEST_RECIPIENT,
      subject: "QA test — Hung Trinh AI Resend integration",
      html: "<p>Đây là email test tự động để xác nhận RESEND_API_KEY hoạt động đúng. Có thể bỏ qua email này.</p>",
    });
    status.sendResult = result;
  }

  return Response.json(status);
}
