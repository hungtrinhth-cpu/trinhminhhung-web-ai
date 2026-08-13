// Temporary diagnostic route — queries Resend's real send history to close
// out the campaign-email incident (2026-08-13). Recipient addresses are
// masked (domain-only), never returned in full. Delete after use.
function maskEmail(addr) {
  const at = addr.indexOf("@");
  if (at === -1) return "***";
  return `***@${addr.slice(at + 1)}`;
}

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key || !key.startsWith("re_")) {
    return Response.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails?limit=100", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    return Response.json({ error: `Resend API error ${res.status}` }, { status: 502 });
  }
  const body = await res.json();

  const summary = (body.data ?? []).map((e) => ({
    id: e.id,
    to: (e.to ?? []).map(maskEmail),
    subject: e.subject,
    created_at: e.created_at,
    last_event: e.last_event,
  }));

  return Response.json({ count: summary.length, has_more: body.has_more, emails: summary });
}
