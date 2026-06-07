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
import { getPageBanner } from "@/lib/get-page-banner";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Services",
  description: "Services offered by Ghamkheti Guru Company Limited across energy, agriculture, and development.",
};

type AccentColor = "green" | "gold" | "teal" | "earth";

const ICON_MAP: Record<string, LucideIcon> = {
  Sun, Sprout, Code2, BarChart3, Cpu, ShieldCheck, Globe, Users,
  Droplets, Mountain, Zap, Leaf, Building, Truck,
};

export default async function ServicesPage() {
  await connectToDatabase();
  const [raw, pageBanner] = await Promise.all([
    ServicesContent.find().lean(),
    getPageBanner("services"),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms: Record<string, any> = Object.fromEntries(
    (JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>).map((d) => [d.section, d])
  );

  const banner    = cms.banner ?? {};
  const bannerTitle = banner.title || "Our Services";
  const bannerDesc  = banner.body  || "";

  const servicesData = cms.services ?? {};
  const services: Array<{ icon: LucideIcon; title: string; description: string; accent: AccentColor; details: string[] }> =
    servicesData.items?.length
      ? (servicesData.items as Array<{ icon?: string; title: string; description: string; accent?: string; details?: string[] }>).map((s) => ({
          icon:        ICON_MAP[s.icon ?? ""] ?? Sun,
          title:       s.title,
          description: s.description,
          accent:      (s.accent ?? "teal") as AccentColor,
          details:     s.details ?? [],
        }))
      : [];

  const processData = cms.process ?? {};
  const process: Array<{ step: string; title: string; description: string }> =
    processData.items?.length
      ? (processData.items as Array<{ step: string; title: string; description: string }>)
      : [];

  const ctaData  = cms.cta_banner ?? {};
  const ctaTitle = ctaData.title    || "Partner With Us";
  const ctaDesc  = ctaData.subtitle || "";

  return (
    <>
      <PageBanner
        badge="Services"
        title={bannerTitle}
        description={bannerDesc}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />

      {services.length > 0 && (
        <>
          <Section id="services">
            <Container>
              <SectionHeader badge="What We Do" title="Our Service Portfolio" titleGradient />
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

          <Section variant="alt">
            <Container>
              <SectionHeader badge="Deep Dive" title="What Each Service Includes" />
              <Grid cols={1} colsMd={2} gap="default">
                {services.map((s) => (
                  <GlassCard key={s.title} animated padding="lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        s.accent === "gold"  ? "bg-gold/10 text-gold"   :
                        s.accent === "teal"  ? "bg-teal/10 text-teal"   :
                        s.accent === "earth" ? "bg-earth/10 text-earth" :
                        "bg-primary/10 text-primary"}`}>
                        <s.icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                    </div>
                    {s.details.length > 0 && (
                      <ul className="space-y-2">
                        {s.details.map((d) => (
                          <li key={d} className="flex items-start gap-2.5">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" strokeWidth={2} />
                            <span className="text-xs text-foreground-muted">{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </GlassCard>
                ))}
              </Grid>
            </Container>
          </Section>
        </>
      )}

      {process.length > 0 && (
        <Section id="process">
          <Container>
            <SectionHeader badge="Our Process" title="How We Work" titleGradient />
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
      )}

      <CTABanner
        badge="Get Started"
        title={ctaTitle}
        description={ctaDesc}
        primaryLabel="Contact Us"
        primaryHref="/contact"
        secondaryLabel="View Projects"
        secondaryHref="/projects"
      />
    </>
  );
}
