// Temporary diagnostic route — NEXT_PUBLIC_* vars are already embedded in
// the client bundle (visible via view-source), so exposing the raw value
// here reveals nothing that isn't already public. Delete after use.
export async function GET() {
  const raw = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED;
  return Response.json({
    present: raw !== undefined,
    raw: raw ?? null,
    strictlyTrue: raw === "true",
  });
}
