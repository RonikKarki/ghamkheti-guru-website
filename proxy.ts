/**
 * Route proxy (middleware) — Ghamkheti Guru Company Limited
 *
 * HOW PROTECTION WORKS
 * ─────────────────────
 * NextAuth's `auth()` wraps this function. Before our logic runs, NextAuth
 * decodes the httpOnly JWT cookie and attaches the session to `req.auth`.
 * There is NO database query per request — all role information lives in
 * the signed JWT, which cannot be tampered with client-side.
 *
 * ROUTE MATRIX
 * ─────────────
 *   /login              Public. Authenticated users → /admin/dashboard.
 *   /admin/login        Alias for /login — same redirect behaviour.
 *   /admin/unauthorized Public (shown after insufficient-role redirect).
 *   /admin/users/**     super_admin only.
 *   /admin/settings/**  admin + super_admin.
 *   /admin/**           Any authenticated user (editor, admin, super_admin).
 *   Everything else     Pass through — public pages.
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/models/User";

const ROLE_WEIGHT: Record<UserRole, number> = {
  editor: 1, admin: 2, super_admin: 3,
};

function atLeast(role: UserRole | undefined, min: UserRole): boolean {
  if (!role) return false;
  return (ROLE_WEIGHT[role] ?? 0) >= ROLE_WEIGHT[min];
}

export default auth((req) => {
  const { nextUrl } = req;
  const session     = req.auth;
  const role        = session?.user?.role as UserRole | undefined;
  const path        = nextUrl.pathname;

  /* ── /login — redirect authenticated users away ── */
  if (path === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  /* ── /admin/unauthorized — always accessible ── */
  if (path === "/admin/unauthorized") {
    return NextResponse.next();
  }

  /* ── All /admin/** routes need authentication ── */
  if (path.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    /* ── /admin/users/** — super_admin only ── */
    if (path.startsWith("/admin/users") && !atLeast(role, "super_admin")) {
      return NextResponse.redirect(new URL("/admin/unauthorized", nextUrl));
    }

    /* ── /admin/settings/** — admin+ only ── */
    if (path.startsWith("/admin/settings") && !atLeast(role, "admin")) {
      return NextResponse.redirect(new URL("/admin/unauthorized", nextUrl));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico, sitemap.xml, robots.txt
     *  - api/auth/**   (NextAuth handlers — must run freely)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/auth).*)",
  ],
};
