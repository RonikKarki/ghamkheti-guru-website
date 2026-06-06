import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiNoContent, apiBadRequest } from "@/lib/api-response";
import { assertRole, getSessionUser } from "@/lib/auth-utils";
import { updateById, deleteById } from "@/lib/db-helpers";
import User from "@/models/User";
import type { UserRole } from "@/models/User";

type Ctx = { params: Promise<{ id: string }> };

const ALLOWED_ROLES: UserRole[] = ["super_admin", "admin", "editor"];

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  const session = await assertRole("editor");
  const { id }  = await ctx!.params;
  const { role, isActive, name } = await req.json();

  // Role/status changes require super_admin; name changes are self-service
  const isSelf        = session.id === id;
  const wantsPrivileged = role !== undefined || isActive !== undefined;
  if (wantsPrivileged || !isSelf) await assertRole("super_admin");

  if (role && !ALLOWED_ROLES.includes(role as UserRole)) {
    return apiBadRequest(`role must be one of: ${ALLOWED_ROLES.join(", ")}`);
  }

  const update: Record<string, unknown> = {};
  if (role     !== undefined) update.role     = role;
  if (isActive !== undefined) update.isActive = isActive;
  if (name     !== undefined) update.name     = name;

  const updated = await updateById(User, id, { $set: update }, { resourceName: "User" });
  return apiSuccess(updated, "User updated");
});

export const DELETE = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("super_admin");
  const sessionUser = await getSessionUser();
  const { id } = await ctx!.params;

  if (sessionUser?.id === id) {
    return apiBadRequest("You cannot delete your own account");
  }

  await deleteById(User, id, "User");
  return apiNoContent();
});
