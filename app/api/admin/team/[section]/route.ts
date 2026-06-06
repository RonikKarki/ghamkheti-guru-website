import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole, getSessionUser } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import TeamContent from "@/models/TeamContent";
import type { TeamSection } from "@/models/TeamContent";

type Ctx = { params: Promise<{ section: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { section } = await ctx!.params;
  const body = await req.json();
  const sessionUser = await getSessionUser();

  await connectToDatabase();

  const updated = await TeamContent.findOneAndUpdate(
    { section: section as TeamSection },
    { $set: { ...body, updatedBy: sessionUser?.email } },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return apiSuccess(updated, "Section updated");
});
