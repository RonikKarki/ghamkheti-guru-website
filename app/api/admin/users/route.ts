import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiCreated, apiBadRequest } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { findMany, createOne } from "@/lib/db-helpers";
import { exists } from "@/lib/db-helpers";
import User from "@/models/User";
import type { UserRole } from "@/models/User";

const ALLOWED_ROLES: UserRole[] = ["super_admin", "admin", "editor"];

/** GET /api/admin/users — list all users (super_admin only) */
export const GET = withApiHandler(async () => {
  await assertRole("super_admin");

  const users = await findMany(User, {}, {
    select: "-password",
    sort:   { createdAt: -1 },
  });

  return apiSuccess(users);
});

/** POST /api/admin/users — create a new admin user (super_admin only) */
export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("super_admin");

  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return apiBadRequest("name, email, and password are required");
  }

  if (password.length < 8) {
    return apiBadRequest("Password must be at least 8 characters");
  }

  if (role && !ALLOWED_ROLES.includes(role as UserRole)) {
    return apiBadRequest(`role must be one of: ${ALLOWED_ROLES.join(", ")}`);
  }

  const emailExists = await exists(User, { email: email.toLowerCase().trim() });
  if (emailExists) {
    return apiBadRequest("A user with this email already exists");
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await createOne(User, {
    name:     name.trim(),
    email:    email.toLowerCase().trim(),
    password: hashed,
    role:     (role as UserRole) ?? "editor",
    isActive: true,
  });

  // Never return the password hash
  const { password: _pw, ...safeUser } = user as typeof user & { password?: string };
  return apiCreated(safeUser, "User created successfully");
});
