import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated user and their profile row (with role), or nulls.
 * Use in server components / route handlers / server actions.
 */
export async function getSessionProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  if (error) {
    // Profile row may not exist yet right after signup if the trigger lagged.
    return { user, profile: null };
  }

  return { user, profile };
}

/**
 * Convenience: just the role string, defaulting to 'student' when unknown.
 */
export async function getCurrentRole() {
  const { profile } = await getSessionProfile();
  return profile?.role ?? "student";
}
