import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiNoContent } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { updateById, deleteById } from "@/lib/db-helpers";
import Gallery from "@/models/Gallery";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("editor");
  const { id } = await ctx!.params;
  const body   = await req.json();
  const updated = await updateById(Gallery, id, { $set: body }, { resourceName: "Gallery" });
  return apiSuccess(updated, "Item updated");
});

export const DELETE = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  await deleteById(Gallery, id, "Gallery");
  return apiNoContent();
});
