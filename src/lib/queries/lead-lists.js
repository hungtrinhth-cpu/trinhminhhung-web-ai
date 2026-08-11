import { createClient } from "@/lib/supabase/server";

/**
 * All lead lists visible to the current user, each with its live lead count.
 */
export async function getLeadLists() {
  const supabase = await createClient();

  const { data: lists, error } = await supabase
    .from("lead_lists")
    .select("id, name, description, created_by, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getLeadLists error:", error.message);
    return [];
  }

  // Fetch counts per list. RLS already scopes which leads are visible.
  const { data: leadRows } = await supabase.from("leads").select("list_id");
  const counts = {};
  for (const row of leadRows ?? []) {
    if (row.list_id) counts[row.list_id] = (counts[row.list_id] ?? 0) + 1;
  }

  return (lists ?? []).map((l) => ({ ...l, count: counts[l.id] ?? 0 }));
}

export async function getLeadListById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_lists")
    .select("id, name, description, created_by, created_at")
    .eq("id", id)
    .single();
  if (error) {
    console.error("getLeadListById error:", error.message);
    return null;
  }
  return data;
}
