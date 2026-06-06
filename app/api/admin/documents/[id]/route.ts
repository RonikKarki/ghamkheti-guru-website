import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiNoContent, apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { deleteById, updateById } from "@/lib/db-helpers";
import InvestorDocument from "@/models/InvestorDocument";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  const body = await req.json();
  const updated = await updateById(InvestorDocument, id, { $set: body }, { resourceName: "Document" });
  return apiSuccess(updated, "Document updated");
});

export const DELETE = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  await deleteById(InvestorDocument, id, "Document");
  return apiNoContent();
});
