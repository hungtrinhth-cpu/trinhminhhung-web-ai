import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MAX_MESSAGE_LEN = 2000;
const MAX_STACK_LEN = 8000;
const SOURCES = ["window.onerror", "unhandledrejection", "console.error"];

/**
 * Public client-error ingestion endpoint (lightweight "at least" alternative
 * to a full Sentry setup — no external account/DSN needed). Anonymous
 * visitors can trigger real client errors too, so this intentionally has no
 * auth requirement; writes go through the service-role client since there's
 * no public insert policy on client_errors.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE_LEN);
  if (!message) {
    return NextResponse.json({ error: "missing_message" }, { status: 400 });
  }
  const stack = body.stack ? String(body.stack).slice(0, MAX_STACK_LEN) : null;
  const source = SOURCES.includes(body.source) ? body.source : "window.onerror";
  const url = body.url ? String(body.url).slice(0, 500) : null;
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  // Best-effort — an anonymous visitor has no session, that's fine.
  let userId = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // no session context available — proceed without a user id
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("client_errors")
    .insert({ message, stack, source, url, user_agent: userAgent, user_id: userId });

  if (error) {
    console.error("client-error insert failed:", error.message);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
