import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole, getSessionUser } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import HomepageContent from "@/models/HomepageContent";
import type { HomepageSection } from "@/models/HomepageContent";

type Ctx = { params: Promise<{ section: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { section } = await ctx!.params;
  const body = await req.json();
  const sessionUser = await getSessionUser();

  await connectToDatabase();

  const updated = await HomepageContent.findOneAndUpdate(
    { section: section as HomepageSection },
    { $set: { ...body, updatedBy: sessionUser?.email, isActive: true } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();

  return apiSuccess(updated, "Section updated");
});
