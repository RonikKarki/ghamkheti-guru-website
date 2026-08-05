import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiNoContent } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { updateById, deleteById } from "@/lib/db-helpers";
import Newsletter from "@/models/Newsletter";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  const { isActive } = await req.json();

  const updated = await updateById(Newsletter, id, { $set: { isActive } }, { resourceName: "Subscriber" });
  return apiSuccess(updated, "Subscriber updated");
});

export const DELETE = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  await deleteById(Newsletter, id, "Subscriber");
  return apiNoContent();
});
