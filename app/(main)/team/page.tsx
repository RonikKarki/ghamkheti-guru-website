import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { TeamCard } from "@/components/common/TeamCard";
import { Grid } from "@/components/common/Grid";
import { CTABanner } from "@/components/common/CTABanner";
import { connectToDatabase } from "@/lib/mongodb";
import TeamContent from "@/models/TeamContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the leadership and expert team behind Ghamkheti Guru Company Limited.",
};

interface LeadershipItem  { name: string; role: string; department: string; bio: string; linkedin?: string }
interface TeamMemberItem  { name: string; role: string; department: string; linkedin?: string }
interface DepartmentItem  { name: string; count: number }

const DEFAULT_LEADERSHIP: LeadershipItem[] = [
  { name: "Chairman & Managing Director", role: "Leadership", department: "Leadership", bio: "Visionary entrepreneur with 25+ years in Nepal's infrastructure sector.", linkedin: "#" },
  { name: "Chief Executive Officer",      role: "Leadership", department: "Leadership", bio: "Former senior executive at a leading DFI; specialist in project finance.",   linkedin: "#" },
  { name: "Chief Technical Officer",      role: "Leadership", department: "Leadership", bio: "Civil engineer with 20+ years on hydropower EPC projects across South Asia.", linkedin: "#" },
];

const DEFAULT_TEAM: TeamMemberItem[] = [];

const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  { name: "Energy",      count: 0 },
  { name: "Agriculture", count: 0 },
  { name: "Operations",  count: 0 },
];

export default async function TeamPage() {
  await connectToDatabase();
  const raw = await TeamContent.find().lean();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms: Record<string, any> = Object.fromEntries(
    (JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>).map((d) => [d.section, d])
  );

  // ── Banner ────────────────────────────────────────────────────────────────
  const banner      = cms.banner ?? {};
  const bannerTitle = banner.title || "The People Behind the Impact";
  const bannerDesc  = banner.body  || "Specialists across energy, technology, agriculture, and consulting — united by a mission to build Nepal's sustainable future.";

  // ── Departments ───────────────────────────────────────────────────────────
  const deptData    = cms.departments ?? {};
  const departments: DepartmentItem[] = deptData.items?.length
    ? (deptData.items as DepartmentItem[])
    : DEFAULT_DEPARTMENTS;

  // ── Leadership ────────────────────────────────────────────────────────────
  const leadData   = cms.leadership ?? {};
  const leadership: LeadershipItem[] = leadData.items?.length
    ? (leadData.items as LeadershipItem[])
    : DEFAULT_LEADERSHIP;

  // ── Team Members ──────────────────────────────────────────────────────────
  const teamData    = cms.team_members ?? {};
  const teamMembers: TeamMemberItem[] = teamData.items?.length
    ? (teamData.items as TeamMemberItem[])
    : DEFAULT_TEAM;

  return (
    <>
      <PageBanner
        badge="Our Team"
        title={bannerTitle}
        description={bannerDesc}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team" }]}
      />

      {/* Department stats */}
      {departments.length > 0 && (
        <Section variant="alt" size="sm">
          <Container>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {departments.map((d) => (
                <div key={d.name} className="text-center p-4 rounded-xl bg-card border border-border">
                  <p className="text-2xl font-display font-bold text-gradient leading-none mb-1">{d.count}</p>
                  <p className="text-xs text-foreground-subtle">{d.name}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Leadership */}
      <Section>
        <Container>
          <SectionHeader
            badge="Leadership"
            title="Executive Leadership"
            titleGradient
            description="Visionary leaders driving Nepal's energy and agriculture transformation."
          />
          <Grid cols={1} colsMd={3} gap="lg">
            {leadership.map((m, i) => (
              <TeamCard
                key={m.name}
                name={m.name}
                role={m.role}
                department={m.department}
                bio={m.bio}
                linkedin={m.linkedin ?? "#"}
                size="lg"
                index={i}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Full team */}
      {teamMembers.length > 0 && (
        <Section variant="surface">
          <Container>
            <SectionHeader
              badge="Our Experts"
              title="Specialist Teams"
              description="Domain experts who bring deep technical knowledge and sector experience to every engagement."
            />
            <Grid cols={1} colsMd={3} colsLg={3} gap="default">
              {teamMembers.map((m, i) => (
                <TeamCard
                  key={m.name}
                  name={m.name}
                  role={m.role}
                  department={m.department}
                  linkedin={m.linkedin ?? "#"}
                  index={i}
                />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      <CTABanner
        badge="Join Our Team"
        title="We&apos;re Always Looking for Exceptional Talent"
        description="If you&apos;re passionate about building Nepal&apos;s future through energy and sustainable development, we&apos;d love to hear from you."
        primaryLabel="Get in Touch"
        primaryHref="/contact"
        secondaryLabel="Learn About Us"
        secondaryHref="/about"
      />
    </>
  );
}
