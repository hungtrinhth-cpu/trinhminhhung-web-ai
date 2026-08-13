// Temporary diagnostic route — confirms SEPAY_WEBHOOK_SECRET is present in
// this environment. No side effects, no secret value exposed. Delete after use.
export async function GET() {
  const key = process.env.SEPAY_WEBHOOK_SECRET;
  return Response.json({ present: !!key, length: key ? key.length : 0 });
}
