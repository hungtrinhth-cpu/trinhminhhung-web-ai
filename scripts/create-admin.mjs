/**
 * Create (or promote) an admin account in Supabase — no email verification.
 *
 * Usage:
 *   node scripts/create-admin.mjs <email> <password> [full_name]
 *   node scripts/create-admin.mjs                       # uses defaults below
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.
 * The account is created with email_confirm:true so it can log in immediately
 * (no verification email), and its profile role is forced to 'admin'.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

function loadEnv() {
  const raw = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    if (!line.includes("=") || line.trim().startsWith("#")) continue;
    const i = line.indexOf("=");
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return env;
}

const [, , argEmail, argPass, argName] = process.argv;
const EMAIL = argEmail || "admin@hungtrinh.ai";
const PASSWORD = argPass || "Admin@2026";
const FULL_NAME = argName || "Admin";

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const sb = createClient(url, key, { auth: { persistSession: false } });

// 1. Create the auth user, or find it if it already exists.
let userId;
const { data: created, error: createErr } = await sb.auth.admin.createUser({
  email: EMAIL,
  password: PASSWORD,
  email_confirm: true, // skip verification → can log in right away
  user_metadata: { full_name: FULL_NAME },
});

if (createErr) {
  if (/already|exists|registered/i.test(createErr.message)) {
    const { data: list } = await sb.auth.admin.listUsers();
    const found = list.users.find((u) => u.email === EMAIL);
    if (!found) {
      console.error("User exists but could not be located:", createErr.message);
      process.exit(1);
    }
    userId = found.id;
    // Reset password + ensure confirmed in case it changed.
    await sb.auth.admin.updateUserById(userId, {
      password: PASSWORD,
      email_confirm: true,
    });
    console.log("ℹ️  User existed — password reset & confirmed:", EMAIL);
  } else {
    console.error("createUser error:", createErr.message);
    process.exit(1);
  }
} else {
  userId = created.user.id;
  console.log("✅ Created auth user:", EMAIL);
}

// 2. Force profile.role = 'admin' (upsert covers trigger-lag).
const { error: upErr } = await sb.from("profiles").upsert(
  { id: userId, email: EMAIL, full_name: FULL_NAME, role: "admin" },
  { onConflict: "id" }
);
if (upErr) {
  console.error("profile upsert error:", upErr.message);
  process.exit(1);
}

// 3. Verify.
const { data: prof } = await sb
  .from("profiles")
  .select("email, role")
  .eq("id", userId)
  .single();

console.log("✅ Admin ready →", JSON.stringify(prof));
console.log(`   Login: ${EMAIL} / ${PASSWORD}`);
