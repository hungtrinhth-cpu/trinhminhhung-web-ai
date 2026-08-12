// TEMPORARY diagnostic route — reports presence/length of VietQR env vars
// (no full secrets here, these aren't secret, but keep it minimal). Delete
// after use.
export async function GET() {
  return Response.json({
    NEXT_PUBLIC_VIETQR_BANK: process.env.NEXT_PUBLIC_VIETQR_BANK ?? null,
    NEXT_PUBLIC_VIETQR_ACCOUNT: process.env.NEXT_PUBLIC_VIETQR_ACCOUNT ?? null,
    NEXT_PUBLIC_VIETQR_NAME: process.env.NEXT_PUBLIC_VIETQR_NAME ?? null,
  });
}
