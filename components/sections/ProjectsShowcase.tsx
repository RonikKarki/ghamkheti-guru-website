"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Sun, Sprout, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { staggerContainer, staggerItem } from "@/lib/animations";

const sectors = [
  {
    id: "hydropower", icon: Droplets, label: "Hydropower", sector: "Energy",
    stat: "4.9 MW", statLabel: "Pipeline", status: "PPA Stage",
    accent: "text-teal", accentBg: "bg-teal/5 border-teal/15",
    statusStyle: { color: "#00c8b0", background: "rgba(0,200,176,0.08)", border: "1px solid rgba(0,200,176,0.15)" },
    description: "Run-of-river hydroelectric project on the Sisakhola River in Solukhumbu — at PPA stage with Nepal Electricity Authority.",
    highlights: ["Sisakhola River, Solukhumbu", "PPA agreement in progress", "Environmental & DPR studies complete"],
    href: "/projects",
  },
  {
    id: "solar", icon: Sun, label: "Solar Energy", sector: "Energy",
    stat: "10 MW", statLabel: "Pipeline", status: "PPA Stage",
    accent: "text-gold", accentBg: "bg-gold/5 border-gold/15",
    statusStyle: { color: "#f0c040", background: "rgba(240,192,64,0.08)", border: "1px solid rgba(240,192,64,0.15)" },
    description: "Ground-mounted solar PV installation in Solukhumbu at PPA stage — advancing Nepal's renewable energy transition.",
    highlights: ["Solukhumbu, Nepal", "PPA agreement with NEA", "National grid contribution"],
    href: "/projects",
  },
  {
    id: "agriculture", icon: Sprout, label: "Agriculture", sector: "Agro-Industrial",
    stat: "8 T/hr", statLabel: "Capacity", status: "Operational",
    accent: "text-primary", accentBg: "bg-primary/5 border-primary/15",
    statusStyle: { color: "#00d46a", background: "rgba(0,212,106,0.08)", border: "1px solid rgba(0,212,106,0.15)" },
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
  const heading = cms?.title    || "Three Sectors, One Mission";
  const subtext = cms?.subtitle || "Integrated development across clean energy and agro-industry — building Nepal's economic and environmental future from the ground up.";

  return (
    <section className="py-24 md:py-32 bg-surface border-t border-border">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="section-num">03 / Our Portfolio</div>
              <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight">{heading}</h2>
              <p className="mt-3 text-foreground-muted max-w-lg leading-relaxed text-[15px]">{subtext}</p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 shrink-0 self-start sm:self-auto px-4 py-2 text-xs font-semibold tracking-widest uppercase border border-border text-foreground-muted hover:text-foreground hover:border-foreground-subtle transition-colors duration-200"
            >
              All Projects <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>

        {/* Sector cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border"
        >
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.id}
                variants={staggerItem}
                className="group flex flex-col bg-surface p-6 hover:bg-surface-raised transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`flex h-10 w-10 items-center justify-center border ${sector.accentBg}`}>
                    <Icon className={`h-4.5 w-4.5 ${sector.accent}`} strokeWidth={1.8} />
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 tracking-wide"
                    style={sector.statusStyle}
                  >
                    {sector.status}
                  </span>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-subtle mb-1">{sector.sector}</p>
                <h3 className="text-xl font-display font-bold text-foreground mb-2 tracking-tight">{sector.label}</h3>
                <div className="flex items-baseline gap-1.5 mb-5">
                  <span className={`text-3xl font-mono font-bold leading-none ${sector.accent}`}>{sector.stat}</span>
                  <span className="text-xs text-foreground-subtle uppercase tracking-wide">{sector.statLabel}</span>
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed mb-5 flex-1">{sector.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {sector.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <span className={`h-px w-3 shrink-0 ${sector.accent === "text-teal" ? "bg-teal/60" : sector.accent === "text-gold" ? "bg-gold/60" : "bg-primary/60"}`} />
                      <span className="text-xs text-foreground-subtle">{h}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={sector.href}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase transition-opacity ${sector.accent} hover:opacity-70`}
                >
                  Explore {sector.label} <ArrowUpRight className="h-3 w-3" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
