import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import InvestorDocument from "@/models/InvestorDocument";
import DocumentsClient from "@/components/admin/documents/DocumentsClient";

export const metadata: Metadata = { title: "Investor Relations" };

export default async function InvestorRelationsPage() {
  await requireRole("admin");
  await connectToDatabase();
  const raw = await InvestorDocument.find().sort({ order: 1, publishedAt: -1 }).lean();
  return <DocumentsClient initialData={JSON.parse(JSON.stringify(raw))} />;
}
