// TEMPORARY diagnostic route — redacted fingerprint only, never the full
// key. Delete after use.
export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ present: false });
  return Response.json({
    present: true,
    length: key.length,
    starts: key.slice(0, 6),
    isPlaceholder: key === "your_resend_api_key",
  });
}
