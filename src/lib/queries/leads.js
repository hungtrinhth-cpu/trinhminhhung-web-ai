import { createClient } from "@/lib/supabase/server";

export { leadDisplayName } from "@/lib/lead-utils";

/**
 * Fetch leads with optional list scoping, full-text-ish search and stage filter.
 * RLS scopes rows to what the current user is allowed to see.
 *
 * @param {object} opts
 * @param {string} [opts.listId]   - only leads in this list
 * @param {string} [opts.search]   - matches name/email/phone (ILIKE)
 * @param {string[]} [opts.stageIds] - restrict to these pipeline stages
 * @param {number} [opts.limit]
 */
export async function getLeads({ listId, search, stageIds, limit = 200 } = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select(
      "id, first_name, last_name, email, phone, list_id, stage_id, assigned_to, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (listId) query = query.eq("list_id", listId);
  if (stageIds?.length) query = query.in("stage_id", stageIds);

  if (search) {
    const s = `%${search}%`;
    query = query.or(
      `first_name.ilike.${s},last_name.ilike.${s},email.ilike.${s},phone.ilike.${s}`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("getLeads error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getLeadById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("getLeadById error:", error.message);
    return null;
  }
  return data;
}

/**
 * Pipeline stages ordered by their configured order.
 */
export async function getPipelineStages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pipeline_stages")
    .select("id, name, order")
    .order("order", { ascending: true });
  if (error) {
    console.error("getPipelineStages error:", error.message);
    return [];
  }
  return data ?? [];
}
