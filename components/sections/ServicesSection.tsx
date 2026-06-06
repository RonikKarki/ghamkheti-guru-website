"use client";

import Link from "next/link";
import { Code2, BarChart3, Cpu, Globe, ShieldCheck, Users, Sprout, Sun } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FeatureCard } from "@/components/common/FeatureCard";
import { Grid } from "@/components/common/Grid";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

type AccentColor = "green" | "gold" | "teal" | "earth" | "default";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: AccentColor;
}

const services: Service[] = [
  {
    icon: Sun,
    title: "Renewable Energy",
    description: "Solar, wind, and hybrid energy infrastructure — from feasibility studies through EPC and long-term O&M.",
    accent: "gold",
  },
  {
    icon: Sprout,
    title: "Precision Agriculture",
    description: "Data-driven crop management, irrigation automation, and agri-tech platforms that maximise yield sustainably.",
    accent: "green",
  },
  {
    icon: Code2,
    title: "Software Development",
    description: "Enterprise applications, APIs, and digital platforms engineered for scale and reliability.",
    accent: "teal",
  },
  {
    icon: BarChart3,
    title: "Business Consulting",
    description: "Strategic advisory that aligns technology investment with measurable business outcomes.",
    accent: "earth",
  },
  {
    icon: Cpu,
    title: "Digital Transformation",
    description: "End-to-end modernisation programmes that unlock operational efficiency and new revenue streams.",
    accent: "teal",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Comprehensive security audits, compliance frameworks, and 24/7 monitoring to protect critical assets.",
    accent: "green",
  },
  {
    icon: Globe,
    title: "Cloud & Infrastructure",
    description: "Scalable cloud architecture, migration, and managed infrastructure for enterprise workloads.",
    accent: "gold",
  },
  {
    icon: Users,
    title: "Capacity Building",
    description: "Professional development programmes that upskill teams in the latest technologies and methodologies.",
    accent: "earth",
  },
];

export function ServicesSection() {
  return (
    <Section variant="alt" id="services">
      <Container>
        <SectionHeader
          badge="What We Do"
          title="Services Built for Scale"
          titleGradient
          description="From renewable energy to enterprise technology — we deliver end-to-end solutions that create lasting impact."
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

        <div className="mt-12 text-center">
          <Button asChild variant="outline-brand" size="lg">
            <Link href="/services">Explore All Services</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
