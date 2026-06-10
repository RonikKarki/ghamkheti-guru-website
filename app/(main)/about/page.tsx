import type { Metadata } from "next";
import Image from "next/image";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GlassCard } from "@/components/common/GlassCard";
import { Grid } from "@/components/common/Grid";
import { CTABanner } from "@/components/common/CTABanner";
import { connectToDatabase } from "@/lib/mongodb";
import AboutContent from "@/models/AboutContent";
import { getPageBanner } from "@/lib/get-page-banner";
import Link from "next/link";
import { Target, Eye, Heart, Shield, Zap, Globe2, Quote, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story of Ghamkheti Guru Company Limited — Nepal's integrated Energy, Agriculture, and Tourism development company.",
  alternates: { canonical: "/about" },
  keywords: ["about Ghamkheti Guru", "Nepal infrastructure company", "hydropower solar agriculture Nepal"],
};

const VALUE_ICONS = [Target, Heart, Shield, Zap, Globe2, Eye];

export default async function AboutPage() {
  await connectToDatabase();
  const [raw, pageBanner] = await Promise.all([
    AboutContent.find().lean(),
    getPageBanner("about"),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms: Record<string, any> = Object.fromEntries(
    (JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>).map((d) => [d.section, d])
  );

  const banner        = cms.banner        ?? {};
  const intro         = cms.intro         ?? {};
  const missionVision = cms.mission_vision ?? {};
  const leaderData    = cms.leadership    ?? {};
  const valuesData    = cms.values        ?? {};
  const boardData     = cms.board         ?? {};
  const timelineData  = cms.timeline      ?? {};

  const bannerTitle = banner.title || "About Ghamkheti Guru";
  const bannerDesc  = banner.body  || "";

  const introPara1 = intro.body     || "";
  const introPara2 = intro.subtitle || "";
  const introPara3 = intro.title    || "";
  const facts: { label: string; value: string }[] = intro.items?.length ? intro.items as { label: string; value: string }[] : [];

  const mission = missionVision.body     || "";
  const vision  = missionVision.subtitle || "";

  const values: { title: string; description: string }[] = valuesData.items?.length
    ? valuesData.items as { title: string; description: string }[]
    : [];

  const boardMembers: { name: string; title: string; bio?: string; photo?: string }[] = boardData.items?.length
    ? boardData.items as { name: string; title: string; bio?: string; photo?: string }[]
    : [];

  const timeline: { year: string; event: string }[] = timelineData.items?.length
    ? timelineData.items as { year: string; event: string }[]
    : [];

  const leaderName    = leaderData.title    ?? "";
  const leaderRole    = leaderData.subtitle ?? "";
  const leaderMessage = leaderData.body     ?? "";
  const leaderInfo    = (leaderData.items?.[0] ?? {}) as { photo?: string; quote?: string };

  const hasIntro      = introPara1 || introPara2 || introPara3 || facts.length > 0;
  const hasMission    = mission || vision;
  const hasLeader     = leaderName || leaderMessage;
  const hasValues     = values.length > 0;
  const hasBoard      = boardMembers.length > 0;
  const hasTimeline   = timeline.length > 0;

  return (
    <>
      <PageBanner
        badge="About Us"
        title={bannerTitle}
        description={bannerDesc}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />

      {/* Company Introduction */}
      {hasIntro && (
        <Section>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <SectionHeader badge="Our Story" title="Who We Are" centered={false} className="mb-6" />
                {introPara1 && <p className="text-foreground-muted leading-relaxed mb-4">{introPara1}</p>}
                {introPara2 && <p className="text-foreground-muted leading-relaxed mb-4">{introPara2}</p>}
                {introPara3 && <p className="text-foreground-muted leading-relaxed">{introPara3}</p>}
              </div>
              {facts.length > 0 && (
                <div className="space-y-0 divide-y divide-border">
                  {facts.map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-3">
                      <span className="text-sm text-foreground-subtle">{label}</span>
                      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Mission & Vision */}
      {hasMission && (
        <Section variant="alt">
          <Container>
            <SectionHeader badge="Purpose" title="Mission & Vision" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mission && (
                <GlassCard animated padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-foreground">Our Mission</h3>
                  </div>
                  <p className="text-foreground-muted leading-relaxed">{mission}</p>
                </GlassCard>
              )}
              {vision && (
                <GlassCard animated padding="lg" gold>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gold/15 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-foreground">Our Vision</h3>
                  </div>
                  <p className="text-foreground-muted leading-relaxed">{vision}</p>
                </GlassCard>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Leadership Message */}
      {hasLeader && (
        <Section>
          <Container>
            <SectionHeader badge="Leadership" title="Message from Our Leadership" centered={false} className="mb-10" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {/* Photo + name card */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative h-48 w-48 rounded-2xl overflow-hidden bg-surface border border-border shrink-0">
                  {leaderInfo.photo ? (
                    <Image src={leaderInfo.photo} alt={leaderName} fill className="object-cover" sizes="192px" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                      <span className="text-4xl font-bold text-primary">
                        {leaderName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "GG"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  {leaderName && <p className="font-semibold text-foreground">{leaderName}</p>}
                  {leaderRole && <p className="text-sm text-primary mt-0.5">{leaderRole}</p>}
                </div>
                {leaderInfo.quote && (
                  <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 text-left w-full">
                    <Quote className="h-5 w-5 text-primary mb-2 opacity-60" />
                    <p className="text-sm text-foreground leading-relaxed italic">{leaderInfo.quote}</p>
                  </div>
                )}
              </div>
              {/* Message */}
              <div className="lg:col-span-2 space-y-4">
                {leaderMessage.split("\n\n").filter(Boolean).map((para: string, i: number) => (
                  <p key={i} className="text-foreground-muted leading-relaxed">{para}</p>
                ))}
                {leaderName && (
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground text-sm">{leaderName}</p>
                    {leaderRole && <p className="text-xs text-primary mt-0.5">{leaderRole}</p>}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Core Values */}
      {hasValues && (
        <Section>
          <Container>
            <SectionHeader badge="Principles" title="Our Core Values" titleGradient />
            <Grid cols={1} colsMd={2} colsLg={3} gap="default">
              {values.slice(0, 6).map((v, i) => {
                const Icon = VALUE_ICONS[i] ?? Target;
                return (
                  <GlassCard key={v.title} animated padding="default">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1.5">{v.title}</h4>
                        <p className="text-sm text-foreground-muted leading-relaxed">{v.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Board of Directors */}
      {hasBoard && (
        <Section>
          <Container>
            <SectionHeader
              badge="Governance"
              title="Board of Directors"
              description="Our board brings together expertise in energy, finance, agriculture, and public policy."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {boardMembers.map((member, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-surface border border-border shrink-0">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10">
                        <span className="text-2xl font-bold text-primary">
                          {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm leading-snug">{member.name}</p>
                    <p className="text-xs text-primary mt-0.5">{member.title}</p>
                    {member.bio && (
                      <p className="text-xs text-foreground-muted mt-1.5 leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Timeline */}
      {hasTimeline && (
        <Section>
          <Container size="md">
            <SectionHeader badge="Our Journey" title="Company Milestones" />
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {timeline.map((m, i) => (
                  <div key={`${m.year}-${i}`} className="relative pl-16">
                    <div className="absolute left-0 top-1 h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary leading-tight text-center">{m.year}</span>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/25 transition-colors">
                      <p className="text-sm text-foreground leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Meet the Team */}
      <Section variant="alt">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="section-num mb-3">Our People</div>
              <h2
                className="font-display font-bold text-foreground tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
              >
                Meet the Team Behind the Vision
              </h2>
              <p className="mt-3 text-foreground-muted text-[15px] leading-relaxed max-w-lg">
                The specialists, engineers, and professionals driving our projects across energy, agriculture, and sustainable development.
              </p>
            </div>
            <Link
              href="/team"
              className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold tracking-wide bg-foreground text-background hover:opacity-80 transition-opacity duration-200 shrink-0"
            >
              Meet the Team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </Section>

      <CTABanner
        badge="Partner With Us"
        title="Build Nepal's Future With Ghamkheti Guru"
        description="Whether you're an investor, government body, or community organisation — we're ready to collaborate."
        primaryLabel="Get in Touch"
        primaryHref="/contact"
        secondaryLabel="Our Projects"
        secondaryHref="/projects"
      />
    </>
  );
}
