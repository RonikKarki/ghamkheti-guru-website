import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import AboutContent from "@/models/AboutContent";
import type { AboutSection } from "@/models/AboutContent";
import AboutClient from "@/components/admin/about/AboutClient";

export const metadata: Metadata = { title: "About Us CMS" };

const SECTIONS: AboutSection[] = [
  "banner",
  "intro",
  "mission_vision",
  "values",
  "board",
  "timeline",
];

export default async function AboutCMSPage() {
  await requireRole("admin");
  await connectToDatabase();

  const raw = await AboutContent.find({ section: { $in: SECTIONS } }).lean();
  const serialized = JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bySection: Record<string, any> = Object.fromEntries(
    serialized.map((d) => [d.section, d])
  );

  const data = SECTIONS.map((s) => bySection[s] ?? { section: s, items: [] });

  return <AboutClient initialData={data} />;
}
