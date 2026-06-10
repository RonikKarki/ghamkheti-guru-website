import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import HomepageContent, { type HomepageSection } from "@/models/HomepageContent";
import HomepageClient from "@/components/admin/homepage/HomepageClient";

export const metadata: Metadata = { title: "Homepage CMS" };

const SECTIONS: HomepageSection[] = [
  "hero",
  "hero_images",
  "company_overview",
  "portfolio",
  "stats",
  "chairman_message",
  "sustainability",
  "investor_cta",
];

export default async function HomepageCMSPage() {
  await requireRole("admin");
  await connectToDatabase();

  const raw = await HomepageContent.find({ section: { $in: SECTIONS } }).lean();
  const serialized = JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bySection: Record<string, any> = Object.fromEntries(
    serialized.map((d) => [d.section, d])
  );

  const data = SECTIONS.map((s) => bySection[s] ?? { section: s, items: [] });

  return <HomepageClient initialData={data} />;
}
