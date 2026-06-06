import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiNoContent } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { deleteById } from "@/lib/db-helpers";
import { connectToDatabase } from "@/lib/mongodb";
import { AppError } from "@/lib/api-error";
import Project from "@/models/Project";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = withApiHandler(async (req: NextRequest, ctx?: Ctx) => {
  await assertRole("editor");
  const { id } = await ctx!.params;
  const body   = await req.json();

  // Convert date strings to Date objects if provided
  const update: Record<string, unknown> = { ...body };
  if (body.codDate)           update.codDate           = new Date(body.codDate);
  if (body.constructionStart) update.constructionStart = new Date(body.constructionStart);

  await connectToDatabase();
  const project = await Project.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  ).lean();

  if (!project) throw new AppError("Project not found", 404);
  return apiSuccess(project, "Project updated");
});

export const DELETE = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  await assertRole("admin");
  const { id } = await ctx!.params;
  await connectToDatabase();
  await deleteById(Project, id, "Project");
  return apiNoContent();
});
