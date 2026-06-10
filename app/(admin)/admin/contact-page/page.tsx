import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import ContactContent from "@/models/ContactContent";
import type { ContactSection } from "@/models/ContactContent";
import ContactPageClient from "@/components/admin/contact/ContactPageClient";

export const metadata: Metadata = { title: "Contact Page CMS" };

const SECTIONS: ContactSection[] = ["page_header", "intro", "offices", "map"];

export default async function ContactPageCMSPage() {
  await requireRole("admin");
  await connectToDatabase();

  const raw = await ContactContent.find({ section: { $in: SECTIONS } }).lean();
  const serialized = JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>;
  const bySection: Record<string, unknown> = Object.fromEntries(serialized.map((d) => [d.section, d]));
  const data = SECTIONS.map((s) => bySection[s] ?? { section: s, items: [] });

  return <ContactPageClient initialData={data} />;
}
