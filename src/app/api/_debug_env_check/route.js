// TEMPORARY diagnostic route — never returns full secret values, only a
// redacted fingerprint (length + first/last chars) to compare against the
// expected local .env.local values. Delete after use.
function fingerprint(v) {
  if (!v) return { present: false };
  return {
    present: true,
    length: v.length,
    starts: v.slice(0, 12),
    ends: v.slice(-8),
  };
}

export async function GET() {
  return Response.json({
    NEXT_PUBLIC_SUPABASE_URL: fingerprint(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: fingerprint(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: fingerprint(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}
