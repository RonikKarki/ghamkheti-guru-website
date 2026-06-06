import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FeatureCard } from "@/components/common/FeatureCard";
import { Grid } from "@/components/common/Grid";
import { GlassCard } from "@/components/common/GlassCard";
import { CTABanner } from "@/components/common/CTABanner";
import {
  Sun, Sprout, Code2, BarChart3, Cpu, ShieldCheck, Globe, Users,
  CheckCircle, Droplets, Mountain, Zap, Leaf, Building, Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import ServicesContent from "@/models/ServicesContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore the full range of services offered by Ghamkheti Guru Company Limited across energy, agriculture, and consulting.",
};

type AccentColor = "green" | "gold" | "teal" | "earth";

const ICON_MAP: Record<string, LucideIcon> = {
  Sun, Sprout, Code2, BarChart3, Cpu, ShieldCheck, Globe, Users,
  Droplets, Mountain, Zap, Leaf, Building, Truck,
};

const DEFAULT_SERVICES: Array<{ icon: LucideIcon; title: string; description: string; accent: AccentColor; details: string[] }> = [
  {
    icon: Sun,
    title: "Renewable Energy",
    description: "Solar, wind, and hybrid energy infrastructure — from feasibility studies through EPC and long-term O&M.",
    accent: "gold",
    details: [
      "Utility-scale solar PV development",
      "Wind energy & hybrid minigrids",
      "SCADA integration & monitoring",
      "25-year O&M contracts",
      "Biogas & waste-to-energy",
      "Energy storage solutions",
    ],
  },
  {
    icon: Sprout,
    title: "Precision Agriculture",
    description: "Data-driven crop management, irrigation automation, and agri-tech platforms that maximise yield sustainably.",
    accent: "green",
    details: [
      "IoT sensor networks & analytics",
      "Automated drip irrigation",
      "Satellite imagery & AI insights",
      "Smallholder farmer platforms",
      "Carbon credit certification",
      "Agrivoltaic system design",
    ],
  },
  {
    icon: Code2,
    title: "Software Development",
    description: "Enterprise applications, APIs, and digital platforms engineered for scale and reliability.",
    accent: "teal",
    details: [
      "Custom enterprise applications",
      "Open banking & fintech platforms",
      "Health information systems",
      "Microservices & API design",
      "Cloud-native development",
      "DevOps & CI/CD pipelines",
    ],
  },
  {
    icon: BarChart3,
    title: "Business Consulting",
    description: "Strategic advisory that aligns technology investment with measurable business outcomes.",
    accent: "earth",
    details: [
      "Digital strategy & roadmapping",
      "Technology investment advisory",
      "Market entry & feasibility",
      "Organisational transformation",
      "Board-level advisory services",
      "Due diligence & valuation",
    ],
  },
  {
    icon: Cpu,
    title: "Digital Transformation",
    description: "End-to-end modernisation programmes that unlock operational efficiency and new revenue streams.",
    accent: "teal",
    details: [
      "Legacy system modernisation",
      "ERP & CRM implementation",
      "Process automation (RPA/AI)",
      "Digital twin development",
      "Change management",
      "KPI frameworks & dashboards",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Comprehensive security audits, compliance frameworks, and 24/7 monitoring to protect critical assets.",
    accent: "green",
    details: [
      "Security architecture review",
      "Penetration testing",
      "SOC & 24/7 monitoring",
      "ISO 27001 & GDPR compliance",
      "OT/ICS security for energy",
      "Incident response planning",
    ],
  },
  {
    icon: Globe,
    title: "Cloud & Infrastructure",
    description: "Scalable cloud architecture, migration, and managed infrastructure for enterprise workloads.",
    accent: "gold",
    details: [
      "Multi-cloud architecture",
      "Cloud migration programmes",
      "Managed infrastructure services",
      "Disaster recovery & HA",
      "Network design & SD-WAN",
      "Data centre optimisation",
    ],
  },
  {
    icon: Users,
    title: "Capacity Building",
    description: "Professional development programmes that upskill teams in the latest technologies and methodologies.",
    accent: "earth",
    details: [
      "Technology training workshops",
      "Leadership development",
      "Agile & DevOps coaching",
      "Energy sector certification",
      "Graduate internship programmes",
      "Knowledge transfer frameworks",
    ],
  },
];

const DEFAULT_PROCESS = [
  { step: "01", title: "Discovery",  description: "We start with a thorough discovery of your organisation, goals, constraints, and existing capabilities." },
  { step: "02", title: "Strategy",   description: "Our specialists design a tailored solution roadmap with clear milestones, KPIs, and investment phasing." },
  { step: "03", title: "Delivery",   description: "Agile delivery with regular client touchpoints, sprint reviews, and complete transparency throughout." },
  { step: "04", title: "Optimise",   description: "Post-delivery, we continuously monitor, optimise, and evolve the solution to maximise long-term ROI." },
];

export default async function ServicesPage() {
  await connectToDatabase();
  const raw = await ServicesContent.find().lean();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms: Record<string, any> = Object.fromEntries(
    (JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>).map((d) => [d.section, d])
  );

  // ── Banner ────────────────────────────────────────────────────────────────
  const banner    = cms.banner ?? {};
  const bannerTitle = banner.title || "End-to-End Solutions Built for Scale";
  const bannerDesc  = banner.body  || "From renewable energy infrastructure to enterprise software and strategic consulting — we deliver complete, lasting impact across every engagement.";

  // ── Services ──────────────────────────────────────────────────────────────
  const servicesData = cms.services ?? {};
  const services: typeof DEFAULT_SERVICES = servicesData.items?.length
    ? (servicesData.items as Array<{ icon?: string; title: string; description: string; accent?: string; details?: string[] }>).map((s) => ({
        icon:        ICON_MAP[s.icon ?? ""] ?? Sun,
        title:       s.title,
        description: s.description,
        accent:      (s.accent ?? "teal") as AccentColor,
        details:     s.details ?? [],
      }))
    : DEFAULT_SERVICES;

  // ── Process ───────────────────────────────────────────────────────────────
  const processData = cms.process ?? {};
  const process: typeof DEFAULT_PROCESS = processData.items?.length
    ? (processData.items as Array<{ step: string; title: string; description: string }>)
    : DEFAULT_PROCESS;

  // ── CTA Banner ────────────────────────────────────────────────────────────
  const ctaData  = cms.cta_banner ?? {};
  const ctaTitle = ctaData.title    || "Ready to Explore What We Can Build Together?";
  const ctaDesc  = ctaData.subtitle || "Tell us about your project and our specialist team will respond with a tailored approach within 24 hours.";

  return (
    <>
      <PageBanner
        badge="Services"
        title={bannerTitle}
        description={bannerDesc}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      {/* Services grid */}
      <Section id="services">
        <Container>
          <SectionHeader
            badge="What We Do"
            title="Our Service Portfolio"
            titleGradient
            description="Core practice areas staffed by domain specialists with deep sector knowledge and proven delivery experience."
          />
          <Grid cols={1} colsMd={2} colsLg={4} gap="default">
            {services.map((s, i) => (
              <FeatureCard
                key={s.title}
                icon={s.icon}
                title={s.title}
                description={s.description}
                accent={s.accent}
                index={i}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Service detail cards */}
      <Section variant="alt">
        <Container>
          <SectionHeader
            badge="Deep Dive"
            title="What Each Service Includes"
            description="Every practice area is a full-capability offering — not a brochure item."
          />
          <Grid cols={1} colsMd={2} gap="default">
            {services.map((s, i) => (
              <GlassCard key={s.title} animated padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0
                    ${s.accent === "gold"  ? "bg-gold/10 text-gold"   :
                      s.accent === "teal"  ? "bg-teal/10 text-teal"   :
                      s.accent === "earth" ? "bg-earth/10 text-earth" :
                      "bg-primary/10 text-primary"}`}>
                    <s.icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                </div>
                <ul className="space-y-2">
                  {s.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" strokeWidth={2} />
                      <span className="text-xs text-foreground-muted">{d}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* How we work */}
      <Section id="process">
        <Container>
          <SectionHeader
            badge="Our Process"
            title="How We Deliver Excellence"
            titleGradient
            description="A proven engagement model that ensures clarity, accountability, and results at every stage."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border z-0" />
                )}
                <div className="relative z-10 bg-card border border-border rounded-2xl p-6 h-full">
                  <span className="block text-4xl font-display font-black text-primary/15 leading-none mb-4">
                    {p.step}
                  </span>
                  <h4 className="font-semibold text-foreground mb-2">{p.title}</h4>
                  <p className="text-xs text-foreground-muted leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTABanner
        badge="Get Started"
        title={ctaTitle}
        description={ctaDesc}
        primaryLabel="Request a Proposal"
        primaryHref="/contact"
        secondaryLabel="View Projects"
        secondaryHref="/projects"
      />
    </>
  );
}
