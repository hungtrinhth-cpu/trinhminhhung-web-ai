// TEMPORARY diagnostic route — reports the exact error from importing/using
// isomorphic-dompurify at runtime, since staging returns a generic 500 with
// no detail and this doesn't reproduce locally. Delete after use.
export async function GET() {
  try {
    const { default: DOMPurify } = await import("isomorphic-dompurify");
    const result = DOMPurify.sanitize("<p>test</p><script>alert(1)</script>");
    return Response.json({ ok: true, result });
  } catch (err) {
    return Response.json(
      { ok: false, name: err?.name, message: err?.message, stack: err?.stack?.slice(0, 2000) },
      { status: 500 }
    );
  }
}
