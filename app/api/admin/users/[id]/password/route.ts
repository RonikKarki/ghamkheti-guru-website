import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiBadRequest } from "@/lib/api-response";
import { assertRole, getSessionUser } from "@/lib/auth-utils";
import { AppError } from "@/lib/api-error";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  const session = await assertRole("editor");
  const { id }  = await ctx!.params;

  // Users can only change their own password unless they are super_admin
  if (session.id !== id) {
    await assertRole("super_admin");
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return apiBadRequest("currentPassword and newPassword are required");
  }
  if (newPassword.length < 8) {
    return apiBadRequest("New password must be at least 8 characters");
  }

  await connectToDatabase();
  const user = await User.findById(id).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const valid = await bcrypt.compare(currentPassword, user.password as string);
  if (!valid) return apiBadRequest("Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  return apiSuccess(null, "Password updated successfully");
});
