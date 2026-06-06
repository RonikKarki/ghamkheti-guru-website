/**
 * POST /api/auth/seed
 *
 * One-time endpoint to create the first Super Admin account.
 * Only works when NO users exist in the database yet.
 * Disabled completely in production unless ALLOW_SEED=true is set.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/auth/seed \
 *     -H "Content-Type: application/json" \
 *     -d '{"name":"Your Name","email":"you@example.com","password":"strong-password"}'
 */

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { withApiHandler } from "@/lib/api-error";
import { apiCreated, apiBadRequest, apiForbidden } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const POST = withApiHandler(async (req: NextRequest) => {
  const isProd      = process.env.NODE_ENV === "production";
  const allowInProd = process.env.ALLOW_SEED === "true";

  if (isProd && !allowInProd) {
    return apiForbidden("Seed endpoint is disabled in production");
  }

  await connectToDatabase();

  const existingCount = await User.countDocuments();
  if (existingCount > 0) {
    return apiBadRequest("Seed is only allowed when no users exist");
  }

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return apiBadRequest("name, email, and password are required");
  }

  if (password.length < 8) {
    return apiBadRequest("Password must be at least 8 characters");
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await User.create({
    name:     name.trim(),
    email:    email.toLowerCase().trim(),
    password: hashed,
    role:     "super_admin",
    isActive: true,
  });

  return apiCreated(
    { id: user._id.toString(), email: user.email, role: user.role },
    "Super Admin created. You can now sign in."
  );
});
