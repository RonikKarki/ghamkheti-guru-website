/**
 * Server-only auth utilities — Ghamkheti Guru Company Limited
 *
 * Protected by "server-only" — importing this file in a client component
 * will cause a build error, preventing accidental mongoose/async_hooks leaks.
 *
 * Client components that need role labels/helpers should import from
 * lib/role-utils.ts instead.
 */

import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/api-error";
import { isAtLeast } from "@/lib/role-utils";
import type { UserRole } from "@/lib/role-utils";

// Re-export client-safe helpers so server files only need one import
export {
  ROLES, ROLE_LABELS, ROLE_COLORS,
  isAtLeast, isSuperAdmin, isAdmin, isEditor,
  canManageUsers, canAccessSettings, canDelete, canEdit,
} from "@/lib/role-utils";
export type { UserRole } from "@/lib/role-utils";

/* ── Session accessors ───────────────────────────────────────────── */

export async function getSession(): Promise<Session | null> {
  return auth();
}

export async function getSessionUser(): Promise<Session["user"] | null> {
  const session = await auth();
  return session?.user ?? null;
}

/* ── Redirect guards (Server Components) ────────────────────────── */

export async function requireAuth(): Promise<Session["user"]> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireRole(minimum: UserRole): Promise<Session["user"]> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isAtLeast(session.user.role, minimum)) redirect("/admin/unauthorized");
  return session.user;
}

/* ── Throw guards (API routes) ───────────────────────────────────── */

export async function assertRole(minimum: UserRole): Promise<Session["user"]> {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (!isAtLeast(session.user.role, minimum)) throw new ForbiddenError();
  return session.user;
}
