// Pure helpers shared between server actions, callback route, and proxy.
// No Supabase imports here so this stays safe to import from the edge proxy.

export const STAFF_ROLES = ["admin", "team_leader", "sales"];

/**
 * Where a user should land after authenticating, based on their role.
 * Staff → admin dashboard; everyone else (students) → learner portal.
 */
export function roleHomePath(lang, role) {
  if (STAFF_ROLES.includes(role)) {
    return `/${lang}/admin`;
  }
  return `/${lang}/portal`;
}

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}
