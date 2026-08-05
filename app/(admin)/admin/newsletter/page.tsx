import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import NewsletterClient from "@/components/admin/newsletter/NewsletterClient";

export const metadata: Metadata = { title: "Newsletter Subscribers" };

export default async function NewsletterPage() {
  await requireRole("admin");
  await connectToDatabase();
  const raw = await Newsletter.find().sort({ createdAt: -1 }).lean();
  return <NewsletterClient initialData={JSON.parse(JSON.stringify(raw))} />;
}
