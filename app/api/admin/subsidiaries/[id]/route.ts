import { NextRequest } from "next/server";
import { withApiHandler, AppError } from "@/lib/api-error";
import { apiSuccess, apiNoContent } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import { deleteById } from "@/lib/db-helpers";
import Subsidiary from "@/models/Subsidiary";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("editor");
  const { id } = await ctx!.params;
  const body   = await req.json();
  await connectToDatabase();
  const sub = await Subsidiary.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  ).lean();
  if (!sub) throw new AppError("Subsidiary not found", 404);
  return apiSuccess(sub, "Subsidiary updated");
});

export const DELETE = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  await connectToDatabase();
  await deleteById(Subsidiary, id, "Subsidiary");
  return apiNoContent();
});
