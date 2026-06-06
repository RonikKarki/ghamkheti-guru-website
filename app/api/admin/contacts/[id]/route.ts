import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiNoContent } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { updateById, deleteById } from "@/lib/db-helpers";
import Contact from "@/models/Contact";
import type { ContactStatus, ContactPriority } from "@/models/Contact";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  const { status, priority, internalNotes } = await req.json();

  const update: Record<string, unknown> = {};
  if (status)        update.status        = status as ContactStatus;
  if (priority)      update.priority      = priority as ContactPriority;
  if (internalNotes !== undefined) update.internalNotes = internalNotes;

  const updated = await updateById(Contact, id, { $set: update }, { resourceName: "Contact" });
  return apiSuccess(updated, "Contact updated");
});

export const DELETE = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  await deleteById(Contact, id, "Contact");
  return apiNoContent();
});
