// Server-only notification helpers (Resend email + Telegram bot).
// All functions fail soft: they log and return {ok:false} rather than throwing,
// so a notification outage never breaks the main request flow.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Hung Trinh AI <onboarding@resend.dev>";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Send a transactional email via Resend.
 */
export async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn("sendEmail skipped: RESEND_API_KEY not set");
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("sendEmail failed:", res.status, text);
      return { ok: false, status: res.status };
    }
    return { ok: true };
  } catch (e) {
    console.error("sendEmail error:", e.message);
    return { ok: false };
  }
}

/**
 * Send a message to the admin Telegram channel.
 */
export async function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("sendTelegram skipped: bot token / chat id not set");
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      const t = await res.text();
      console.error("sendTelegram failed:", res.status, t);
      return { ok: false, status: res.status };
    }
    return { ok: true };
  } catch (e) {
    console.error("sendTelegram error:", e.message);
    return { ok: false };
  }
}
