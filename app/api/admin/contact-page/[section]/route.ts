import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole, getSessionUser } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import ContactContent from "@/models/ContactContent";
import type { ContactSection } from "@/models/ContactContent";

type Ctx = { params: Promise<{ section: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { section } = await ctx!.params;
  const body = await req.json();
  const sessionUser = await getSessionUser();

  await connectToDatabase();

  const updated = await ContactContent.findOneAndUpdate(
    { section: section as ContactSection },
    { $set: { ...body, updatedBy: sessionUser?.email, isActive: true } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();

  return apiSuccess(updated, "Section updated");
});
