"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Sun, Sprout, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/animations";

const sectors = [
  {
    id: "hydropower", icon: Droplets, label: "Hydropower", sector: "Energy",
    stat: "4.9 MW", statLabel: "Pipeline", status: "PPA Stage",
    statusColor: "text-teal bg-teal/10 border-teal/20",
    iconBg: "bg-teal/10 border-teal/20", iconColor: "text-teal", statColor: "text-teal",
    gradientStyle: { background: "linear-gradient(135deg, rgba(0,200,176,0.10) 0%, rgba(0,200,176,0.03) 60%, transparent 100%)" },
    borderHover: "hover:border-teal/30",
    description: "Run-of-river hydroelectric project on the Sisakhola River in Solukhumbu — at PPA stage with Nepal Electricity Authority.",
    highlights: ["Sisakhola River, Solukhumbu", "PPA agreement in progress", "Environmental & DPR studies complete"],
    href: "/projects",
  },
  {
    id: "solar", icon: Sun, label: "Solar Energy", sector: "Energy",
    stat: "10 MW", statLabel: "Pipeline", status: "PPA Stage",
    statusColor: "text-gold bg-gold/10 border-gold/20",
    iconBg: "bg-gold/10 border-gold/20", iconColor: "text-gold", statColor: "text-gold",
    gradientStyle: { background: "linear-gradient(135deg, rgba(240,192,64,0.10) 0%, rgba(240,192,64,0.03) 60%, transparent 100%)" },
    borderHover: "hover:border-gold/30",
    description: "Ground-mounted solar PV installation in Solukhumbu at PPA stage — advancing Nepal's renewable energy transition.",
    highlights: ["Solukhumbu, Nepal", "PPA agreement with NEA", "National grid contribution"],
    href: "/projects",
  },
  {
    id: "agriculture", icon: Sprout, label: "Agriculture", sector: "Agro-Industrial",
    stat: "8 T/hr", statLabel: "Capacity", status: "Operational",
    statusColor: "text-primary bg-primary/10 border-primary/20",
    iconBg: "bg-primary/10 border-primary/20", iconColor: "text-primary", statColor: "text-primary",
    gradientStyle: { background: "linear-gradient(135deg, rgba(0,212,106,0.10) 0%, rgba(0,212,106,0.03) 60%, transparent 100%)" },
    borderHover: "hover:border-primary/30",
    description: "Shree Suryodaya Khadya Udhyog Limited — modern rice milling with Japanese Satake technology in Gaindakot, Nawalpur.",
    highlights: ["Gaindakot, Nawalpur", "Japanese Satake technology", "Namche Gold & Manaslu brands"],
    href: "/subsidiaries",
  },
];

interface CmsPortfolio {
  title?:    string;
  subtitle?: string;
}

export function ProjectsShowcase({ cms }: { cms?: CmsPortfolio | null }) {
  const heading  = cms?.title    || "Three Sectors, One Mission";
  const subtext  = cms?.subtitle || "Integrated development across clean energy and agro-industry — building Nepal's economic and environmental future from the ground up.";

  return (
    <Section id="projects-overview">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-4">
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">Our Portfolio</span>
              </div>
              <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight">{heading}</h2>
              <p className="mt-3 text-foreground-muted max-w-lg leading-relaxed">{subtext}</p>
            </div>
            <Button asChild variant="outline" size="default" className="shrink-0 self-start sm:self-auto">
              <Link href="/projects">All Projects <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </motion.div>

        {/* Sector cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.id}
                variants={staggerItem}
                className={`group relative flex flex-col rounded-2xl border border-border bg-surface transition-all duration-300 overflow-hidden ${sector.borderHover}`}
              >
                <div className="absolute inset-0 opacity-100 pointer-events-none" style={sector.gradientStyle} />
                <div className="relative z-10 p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${sector.iconBg}`}>
                      <Icon className={`h-5 w-5 ${sector.iconColor}`} strokeWidth={1.8} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${sector.statusColor}`}>{sector.status}</span>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-subtle mb-1">{sector.sector}</p>
                  <h3 className="text-xl font-display font-bold text-foreground mb-1 tracking-tight">{sector.label}</h3>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className={`text-3xl font-display font-bold leading-none ${sector.statColor}`}>{sector.stat}</span>
                    <span className="text-xs text-foreground-subtle">{sector.statLabel}</span>
                  </div>
                  <p className="text-sm text-foreground-muted leading-relaxed mb-5 flex-1">{sector.description}</p>
                  <ul className="space-y-1.5 mb-6">
                    {sector.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <span className={`h-1 w-1 rounded-full shrink-0 ${sector.iconColor}`} />
                        <span className="text-xs text-foreground-subtle">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={sector.href} className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${sector.iconColor} hover:opacity-80`}>
                    Explore {sector.label} <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
