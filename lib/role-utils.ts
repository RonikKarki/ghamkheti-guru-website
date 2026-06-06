/**
 * Client-safe role constants and pure helpers.
 * No server imports — safe to use in "use client" components.
 *
 * Server-only auth guards (requireAuth, requireRole, assertRole) live in
 * lib/auth-utils.ts which is protected by the "server-only" package.
 */

import type { UserRole } from "@/models/User";

export type { UserRole };

/* ── Numeric weights ─────────────────────────────────────────────── */
export const ROLES: Record<UserRole, number> = {
  editor:      1,
  admin:       2,
  super_admin: 3,
};

/* ── Predicates ──────────────────────────────────────────────────── */
export function isAtLeast(role: UserRole, minimum: UserRole): boolean {
  return ROLES[role] >= ROLES[minimum];
}
export function isSuperAdmin(role: UserRole): boolean { return role === "super_admin"; }
export function isAdmin(role: UserRole): boolean      { return isAtLeast(role, "admin"); }
export function isEditor(role: UserRole): boolean     { return isAtLeast(role, "editor"); }

export function canManageUsers(role: UserRole): boolean    { return isSuperAdmin(role); }
export function canAccessSettings(role: UserRole): boolean { return isAdmin(role); }
export function canDelete(role: UserRole): boolean         { return isAdmin(role); }
export function canEdit(role: UserRole): boolean           { return isEditor(role); }

/* ── Display maps ────────────────────────────────────────────────── */
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  editor:      "Editor",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-gold/15 text-gold border-gold/30",
  admin:       "bg-primary/15 text-primary border-primary/30",
  editor:      "bg-teal/15 text-teal border-teal/30",
};
