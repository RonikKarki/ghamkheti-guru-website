/**
 * NextAuth v5 configuration — Ghamkheti Guru Company Limited
 *
 * HOW IT WORKS
 * ─────────────
 * 1. User submits email + password on /login.
 * 2. `authorize()` queries MongoDB, verifies bcrypt hash, returns user object.
 * 3. NextAuth creates an encrypted JWT containing {id, email, name, role}.
 * 4. JWT is stored in an httpOnly cookie — never exposed to JS on the client.
 * 5. Every request through proxy.ts calls `auth()` which decodes the cookie
 *    and exposes `req.auth` — zero DB query needed for basic auth checks.
 * 6. Server components call `auth()` directly to read the session.
 *
 * ROLE HIERARCHY
 * ───────────────
 *   super_admin  Full access: users, settings, all content.
 *   admin        Content management + contacts. Cannot manage users.
 *   editor       Create/edit content only. No delete, no settings, no users.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import type { UserRole } from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();

        const user = await User.findOne({
          email:    (credentials.email as string).toLowerCase().trim(),
          isActive: true,
        }).select("+password");

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        // Async — don't block login on failure
        User.findByIdAndUpdate(user._id, {
          $inc: { loginCount: 1 },
          $set: { lastLoginAt: new Date() },
        }).exec().catch(() => {});

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          image: user.image,
          role:  user.role as UserRole,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user.role ?? "editor") as UserRole;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = (token.id   ?? "") as string;
        session.user.role = (token.role ?? "editor") as UserRole;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});
