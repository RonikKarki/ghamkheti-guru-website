import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import Subsidiary from "@/models/Subsidiary";
import SubsidiariesClient from "@/components/admin/subsidiaries/SubsidiariesClient";

export const metadata: Metadata = { title: "Subsidiaries" };

export default async function SubsidiariesPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  await requireAuth();
  await connectToDatabase();
  const raw = await Subsidiary.find().sort({ order: 1, createdAt: -1 }).lean();
  const subsidiaries = JSON.parse(JSON.stringify(raw));
  const params = await searchParams;
  return <SubsidiariesClient initialData={subsidiaries} initialOpen={params.new === "1"} />;
}
