import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import ServicesContent from "@/models/ServicesContent";
import type { ServicesSection } from "@/models/ServicesContent";
import ServicesClient from "@/components/admin/services/ServicesClient";

export const metadata: Metadata = { title: "Services CMS" };

const SECTIONS: ServicesSection[] = ["banner", "services", "process", "cta_banner"];

export default async function ServicesCMSPage() {
  await requireRole("admin");
  await connectToDatabase();

  const raw = await ServicesContent.find({ section: { $in: SECTIONS } }).lean();
  const serialized = JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bySection: Record<string, any> = Object.fromEntries(
    serialized.map((d) => [d.section, d])
  );

  const data = SECTIONS.map((s) => bySection[s] ?? { section: s, items: [] });

  return <ServicesClient initialData={data} />;
}
