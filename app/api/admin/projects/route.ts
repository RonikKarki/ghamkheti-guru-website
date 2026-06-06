import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiCreated, apiBadRequest } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import { generateUniqueSlug } from "@/lib/slugify";
import Project from "@/models/Project";
import type { ProjectCategory, ProjectStatus } from "@/models/Project";

export const GET = withApiHandler(async () => {
  await assertRole("editor");
  await connectToDatabase();
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return apiSuccess(projects);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("editor");
  const body = await req.json();

  const {
    name, category, status, description,
    location, capacity, investmentValue,
    codDate, constructionStart,
    ppa, highlights, images,
    isFeatured, order,
    seoTitle, seoDescription,
  } = body;

  if (!name?.trim())               return apiBadRequest("name is required");
  if (!category)                   return apiBadRequest("category is required");
  if (!description?.trim())        return apiBadRequest("description is required");
  if (!location?.district?.trim()) return apiBadRequest("location.district is required");
  if (!location?.province?.trim()) return apiBadRequest("location.province is required");

  await connectToDatabase();
  const slug = await generateUniqueSlug(Project, name);

  const doc: Record<string, unknown> = {
    slug,
    name:        name.trim(),
    category:    category as ProjectCategory,
    status:      (status as ProjectStatus) ?? "under_development",
    description: description.trim(),
    location,
    isFeatured:  isFeatured ?? false,
    order:       order ?? 0,
    highlights:  Array.isArray(highlights) ? highlights : [],
    images:      Array.isArray(images)     ? images     : [],
  };

  if (capacity?.value)    doc.capacity       = capacity;
  if (investmentValue)    doc.investmentValue = investmentValue;
  if (codDate)            doc.codDate        = new Date(codDate);
  if (constructionStart)  doc.constructionStart = new Date(constructionStart);
  if (ppa?.authority)     doc.ppa            = ppa;
  if (seoTitle)           doc.seoTitle       = seoTitle;
  if (seoDescription)     doc.seoDescription = seoDescription;

  const project = await Project.create(doc);
  return apiCreated(project, "Project created successfully");
});
