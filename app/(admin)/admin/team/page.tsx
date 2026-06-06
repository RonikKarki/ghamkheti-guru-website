import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import TeamContent from "@/models/TeamContent";
import type { TeamSection } from "@/models/TeamContent";
import TeamClient from "@/components/admin/team/TeamClient";

export const metadata: Metadata = { title: "Team CMS" };

const SECTIONS: TeamSection[] = ["banner", "departments", "leadership", "team_members"];

export default async function TeamCMSPage() {
  await requireRole("admin");
  await connectToDatabase();

  const raw = await TeamContent.find({ section: { $in: SECTIONS } }).lean();
  const serialized = JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bySection: Record<string, any> = Object.fromEntries(
    serialized.map((d) => [d.section, d])
  );

  const data = SECTIONS.map((s) => bySection[s] ?? { section: s, items: [] });

  return <TeamClient initialData={data} />;
}
