import { createClient } from "@/lib/supabase/server";

/**
 * Published, upcoming-first webinars.
 */
export async function getWebinars() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("webinars")
    .select(
      "id, slug, title, subtitle, scheduled_at, duration_min, format, level, price, original_price, seats_total, seats_left, thumbnail_url, tags, status"
    )
    .eq("status", "published")
    .order("scheduled_at", { ascending: true });
  if (error) {
    console.error("getWebinars error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * All webinars regardless of status — for admin management.
 */
export async function getAllWebinars() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAllWebinars error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getWebinarBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    console.error("getWebinarBySlug error:", error.message);
    return null;
  }
  return data;
}
