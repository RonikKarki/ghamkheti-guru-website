import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";
import NewsClient from "@/components/admin/news/NewsClient";

export const metadata: Metadata = { title: "News" };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  await requireAuth();
  await connectToDatabase();
  const raw = await News.find().sort({ createdAt: -1 }).lean();
  const params = await searchParams;
  return <NewsClient initialData={JSON.parse(JSON.stringify(raw))} initialOpen={params.new === "1"} />;
}
