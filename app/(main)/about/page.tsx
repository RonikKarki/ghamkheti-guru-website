import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GlassCard } from "@/components/common/GlassCard";
import { Grid } from "@/components/common/Grid";
import { CTABanner } from "@/components/common/CTABanner";
import { StatsSection } from "@/components/sections/StatsSection";
import { ChairmanSection } from "@/components/sections/ChairmanSection";
import { connectToDatabase } from "@/lib/mongodb";
import AboutContent from "@/models/AboutContent";
import {
  Target, Eye, Heart, Shield, Zap, Globe2,
  Droplets, Sun, Sprout, Award, CheckCircle,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story of Ghamkheti Guru Company Limited — Nepal's integrated Energy, Agriculture, and Tourism development company.",
  alternates: { canonical: "/about" },
  keywords: ["about Ghamkheti Guru", "Nepal infrastructure company", "hydropower solar agriculture Nepal"],
};

// ── Defaults (used when CMS has no data for a section) ────────────────────────

const DEFAULT_VALUES = [
  { title: "Excellence",    description: "We hold our projects and people to the highest international standards — from feasibility through long-term operations." },
  { title: "Impact",        description: "Our measure of success extends beyond megawatts and tonnage to livelihoods improved and ecosystems protected." },
  { title: "Integrity",     description: "We operate with full transparency to government bodies, investors, host communities, and the public." },
  { title: "Innovation",    description: "We continually invest in technology — whether digital SCADA for hydro assets or satellite imagery for agri-precision." },
  { title: "Sustainability", description: "We design every project with a 50-year view, ensuring that economic returns and ecological health grow together." },
  { title: "Foresight",     description: "We anticipate where Nepal's energy mix and food systems are heading, positioning our investments a decade ahead of the curve." },
];

const VALUE_ICONS = [Target, Heart, Shield, Zap, Globe2, Eye];

const DEFAULT_SECTORS = [
  {
    icon: Droplets, name: "Hydropower", accent: "text-teal bg-teal/10 border-teal/20",
    points: ["Sisakhola Hydropower Project — 4.9 MW", "Solududhkunda Municipality, Solukhumbu", "PPA stage with Nepal Electricity Authority", "Run-of-river technology"],
  },
  {
    icon: Sun, name: "Solar Energy", accent: "text-gold bg-gold/10 border-gold/20",
    points: ["Solar Power Project — 10 MW", "Located in Solukhumbu, Nepal", "PPA stage with Nepal Electricity Authority", "Clean renewable energy development"],
  },
  {
    icon: Sprout, name: "Agriculture & Agro-Industrial", accent: "text-primary bg-primary/10 border-primary/20",
    points: ["Shree Suryodaya Khadya Udhyog Limited", "Modern rice mill — 8 T/Hr capacity", "Namche Gold — premium long grain rice brand", "Gaindakot, Nawalpur (Est. 2077 BS)"],
  },
];

const DEFAULT_LEADERSHIP = [
  { title: "Chairman & Managing Director", bio: "Visionary entrepreneur with 25+ years in Nepal's infrastructure sector." },
  { title: "Chief Executive Officer",      bio: "Former senior executive at a leading DFI; specialist in project finance." },
  { title: "Chief Technical Officer",      bio: "Civil engineer with 20+ years on hydropower EPC projects across South Asia." },
  { title: "Chief Financial Officer",      bio: "Chartered accountant; expert in large-scale project financing and SEBON compliance." },
];

const DEFAULT_TIMELINE = [
  { year: "Foundation", event: "Ghamkheti Guru Company Limited established with a mandate to develop Nepal's energy and agro-industrial potential." },
  { year: "Agriculture", event: "Incorporated Shree Suryodaya Khadya Udhyog Limited — a wholly-owned rice mill in Gaindakot, Nawalpur, equipped with advanced Japanese Satake technology." },
  { year: "Energy", event: "Initiated development of the Sisakhola Hydropower Project (4.9 MW) in Solukhumbu — advancing toward PPA with Nepal Electricity Authority." },
  { year: "Solar", event: "Advanced a 10 MW solar power project in Solukhumbu to the PPA stage, expanding the company's clean energy portfolio." },
  { year: "Ahead", event: "Exploring tourism sector opportunities across Nepal, building toward a fully integrated Energy, Agriculture, and Tourism group." },
];

const DEFAULT_FACTS = [
  { label: "Headquarters", value: "Kathmandu, Nepal" },
  { label: "Sectors",      value: "Energy · Agriculture · Tourism" },
  { label: "Energy Projects", value: "Solukhumbu (PPA Stage)" },
  { label: "Rice Brand",   value: "Namche Gold (Premium Long Grain)" },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  await connectToDatabase();
  const raw = await AboutContent.find().lean();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms: Record<string, any> = Object.fromEntries(
    (JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>).map((d) => [d.section, d])
  );

  // ── CMS-driven content ────────────────────────────────────────────────────
  const banner       = cms.banner        ?? {};
  const intro        = cms.intro         ?? {};
  const missionVision = cms.mission_vision ?? {};
  const valuesData   = cms.values        ?? {};
  const leadershipData = cms.leadership  ?? {};
  const timelineData = cms.timeline      ?? {};

  const bannerTitle = banner.title || "Building Nepal's Sustainable Future";
  const bannerDesc  = banner.body  || "An integrated Energy, Agriculture, and Tourism company developing responsible infrastructure across Nepal.";

  const introPara1 = intro.body     || "Ghamkheti Guru Company Limited was established with a clear mandate: to develop Nepal's extraordinary natural resources — its rivers, its sunlight, and its fertile plains — into engines of national prosperity.";
  const introPara2 = intro.subtitle || "We are an integrated company spanning Energy, Agriculture, and Tourism. Our energy portfolio includes the Sisakhola Hydropower Project (4.9 MW) and a 10 MW Solar Power Project — both in Solukhumbu and at the PPA stage. Our wholly-owned subsidiary, Shree Suryodaya Khadya Udhyog Limited, operates a modern rice mill in Gaindakot, Nawalpur.";
  const introPara3 = intro.title    || "We work with the Government of Nepal and the Nepal Electricity Authority to bring projects from licence to commercial operation — advancing Nepal's energy security and agricultural development.";
  const facts: { label: string; value: string }[] = intro.items?.length ? intro.items as { label: string; value: string }[] : DEFAULT_FACTS;

  const mission = missionVision.body     || "To develop Nepal's natural wealth into world-class energy and agro-industrial infrastructure — delivering reliable power, food security, and economic opportunity while protecting the environment for future generations.";
  const vision  = missionVision.subtitle || "To be Nepal's defining integrated infrastructure company — the partner of choice for government, investors, and communities seeking proven expertise at the intersection of energy, agriculture, and sustainable development.";

  const values: { title: string; description: string }[] = valuesData.items?.length ? valuesData.items as { title: string; description: string }[] : DEFAULT_VALUES;

  const leadership: { title: string; bio: string }[] = leadershipData.items?.length ? leadershipData.items as { title: string; bio: string }[] : DEFAULT_LEADERSHIP;

  const timeline: { year: string; event: string }[] = timelineData.items?.length ? timelineData.items as { year: string; event: string }[] : DEFAULT_TIMELINE;

  return (
    <>
      <PageBanner
        badge="About Us"
        title={bannerTitle}
        description={bannerDesc}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Company Introduction */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader badge="Our Story" title="Who We Are" centered={false} className="mb-6" />
              <p className="text-foreground-muted leading-relaxed mb-4">{introPara1}</p>
              <p className="text-foreground-muted leading-relaxed mb-4">{introPara2}</p>
              <p className="text-foreground-muted leading-relaxed">{introPara3}</p>
            </div>
            <div className="space-y-4">
              {facts.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-foreground-subtle">{label}</span>
                  <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <StatsSection />

      {/* Mission & Vision */}
      <Section variant="alt">
        <Container>
          <SectionHeader badge="Purpose" title="Mission & Vision" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard animated padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground">Our Mission</h3>
              </div>
              <p className="text-foreground-muted leading-relaxed">{mission}</p>
            </GlassCard>
            <GlassCard animated padding="lg" gold>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gold/15 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground">Our Vision</h3>
              </div>
              <p className="text-foreground-muted leading-relaxed">{vision}</p>
            </GlassCard>
          </div>
        </Container>
      </Section>

      {/* Core Values */}
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

      {/* Business Sectors — always static real data */}
      <Section variant="surface">
        <Container>
          <SectionHeader badge="Business Sectors" title="What We Do" titleGradient description="Three integrated sectors, one shared purpose." />
          <Grid cols={1} colsMd={3} gap="lg">
            {DEFAULT_SECTORS.map((s) => (
              <div key={s.name} className="rounded-2xl bg-card border border-border p-6">
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-5 ${s.accent}`}>
                  <s.icon className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-4">{s.name}</h3>
                <ul className="space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" strokeWidth={2} />
                      <span className="text-xs text-foreground-muted">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

      <ChairmanSection />

      {/* Leadership Team */}
      <Section variant="alt">
        <Container>
          <SectionHeader badge="Leadership" title="Executive Leadership" description="Experienced leaders driving Nepal's energy and agriculture transformation." />
          <Grid cols={1} colsMd={2} colsLg={4} gap="default">
            {leadership.map((l) => (
              <div key={l.title} className="rounded-2xl bg-card border border-border p-6 text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-display font-bold text-gradient">
                    {l.title.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1 leading-snug">{l.title}</h4>
                <p className="text-xs text-foreground-subtle leading-relaxed">{l.bio}</p>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Timeline */}
      <Section>
        <Container size="md">
          <SectionHeader badge="Our Journey" title="Company Milestones" description="Key milestones in the growth of Ghamkheti Guru Company Limited." />
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
