import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiCreated, apiBadRequest } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { findMany, createOne } from "@/lib/db-helpers";
import InvestorDocument from "@/models/InvestorDocument";
import type { DocumentType } from "@/models/InvestorDocument";

export const GET = withApiHandler(async () => {
  await assertRole("editor");
  const docs = await findMany(InvestorDocument, {}, { sort: { publishedAt: -1, createdAt: -1 } });
  return apiSuccess(docs);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("admin");
  const body = await req.json();
  const { title, type, fileUrl, fiscalYear, description, isRestricted, fileSize, fileType, publishedAt, order, showOnHomepage, homepageLabel } = body;

  if (!title || !type || !fileUrl) {
    return apiBadRequest("title, type, and fileUrl are required");
  }

  const doc = await createOne(InvestorDocument, {
    title,
    type: type as DocumentType,
    fileUrl,
    fiscalYear:      fiscalYear      || undefined,
    description:     description     || undefined,
    fileType:        fileType        || "pdf",
    fileSize:        fileSize        ? Number(fileSize) : undefined,
    isRestricted:    Boolean(isRestricted),
    publishedAt:     publishedAt     ? new Date(publishedAt) : new Date(),
    order:           order           != null ? Number(order) : 0,
    showOnHomepage:  Boolean(showOnHomepage),
    homepageLabel:   homepageLabel   || undefined,
  });

  return apiCreated(doc, "Document added successfully");
});
