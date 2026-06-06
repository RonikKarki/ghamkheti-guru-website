import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiNoContent } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { updateById, deleteById } from "@/lib/db-helpers";
import News from "@/models/News";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("editor");
  const { id } = await ctx!.params;
  const body = await req.json();

  const update: Record<string, unknown> = { ...body };
  if (body.status === "published" && !body.publishedAt) {
    update.publishedAt = new Date();
  }

  const updated = await updateById(News, id, { $set: update }, { resourceName: "Article" });
  return apiSuccess(updated, "Article updated");
});

export const DELETE = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  await deleteById(News, id, "Article");
  return apiNoContent();
});
