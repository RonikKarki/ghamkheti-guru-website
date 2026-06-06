import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AppError, withApiHandler } from "@/lib/api-error";
import InvestorDocument from "@/models/InvestorDocument";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/documents/:id/download
 * Increments the download counter then 302-redirects to the hosted file URL.
 * Restricted documents return 401 — the public page never renders links for them.
 */
export const GET = withApiHandler(async (_req: NextRequest, ctx?: Ctx) => {
  const { id } = await ctx!.params;
  await connectToDatabase();

  const doc = await InvestorDocument.findById(id).select("fileUrl isRestricted").lean();
  if (!doc) throw new AppError("Document not found", 404);
  if (doc.isRestricted) throw new AppError("This document requires authorised access.", 401);

  // Fire-and-forget counter increment — don't block the redirect
  InvestorDocument.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }).exec().catch(() => {});

  return NextResponse.redirect(doc.fileUrl, { status: 302 });
});
