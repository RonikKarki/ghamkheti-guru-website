"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from "@/lib/animations";

const sectors = [
  {
    id: "hydropower",
    num: "01",
    label: "Hydraulic Force",
    sector: "Hydropower · Energy",
    stat: "4.9 MW", statLabel: "Pipeline",
    status: "PPA Stage",
    description: "Run-of-river hydroelectric project on the Sisakhola River in Solukhumbu — at PPA stage with Nepal Electricity Authority.",
    highlights: ["Sisakhola River, Solukhumbu", "PPA agreement in progress", "Environmental & DPR studies complete"],
    href: "/projects",
  },
  {
    id: "solar",
    num: "02",
    label: "Solar Terracing",
    sector: "Solar Energy · Energy",
    stat: "10 MW", statLabel: "Pipeline",
    status: "PPA Stage",
    description: "Ground-mounted solar PV installation in Solukhumbu at PPA stage — advancing Nepal's renewable energy transition.",
    highlights: ["Solukhumbu, Nepal", "PPA agreement with NEA", "National grid contribution"],
    href: "/projects",
  },
  {
    id: "agriculture",
    num: "03",
    label: "Agro-Industry",
    sector: "Agriculture · Agro-Industrial",
    stat: "8 T/hr", statLabel: "Capacity",
    status: "Operational",
    description: "Shree Suryodaya Khadya Udhyog Limited — modern rice milling with Japanese Satake technology in Gaindakot, Nawalpur.",
    highlights: ["Gaindakot, Nawalpur", "Japanese Satake technology", "Namche Gold & Manaslu brands"],
    href: "/subsidiaries",
  },
];

interface CmsPortfolio { title?: string; subtitle?: string; }

export function ProjectsShowcase({ cms }: { cms?: CmsPortfolio | null }) {
  const heading = cms?.title    || "System Convergence";
  const subtext = cms?.subtitle || "Three integrated sectors working as one — clean energy and agro-industry building Nepal's economic and environmental future.";

  return (
    <section className="py-24 md:py-32 bg-surface border-t border-border" id="sectors">
      <Container>

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 md:mb-20"
        >
          <div className="section-num">02 / Our Sectors</div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight">{heading}</h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 self-start sm:self-auto text-xs font-medium tracking-widest uppercase text-foreground-subtle hover:text-foreground transition-colors shrink-0"
            >
              All Projects <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {subtext && (
            <p className="mt-4 text-foreground-muted text-[15px] leading-relaxed max-w-2xl">{subtext}</p>
          )}
        </motion.div>

        {/* Sector columns — reference "System Convergence" 3-column text layout */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-16"
        >
          {sectors.map((s) => (
            <motion.div
              key={s.id}
              variants={staggerItem}
              className="group bg-surface hover:bg-background transition-colors duration-300 p-8 md:p-10 flex flex-col"
            >
              {/* Number + status row */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[10px] tracking-widest text-foreground-subtle">{s.num}</span>
                <span className="text-[10px] font-medium tracking-wide uppercase text-primary border border-primary/30 px-2.5 py-1">
                  {s.status}
                </span>
              </div>

              {/* Sector tag */}
              <p className="text-[10px] font-medium tracking-widest uppercase text-foreground-subtle mb-2">{s.sector}</p>

              {/* Title */}
              <h3 className="text-2xl font-display font-bold text-foreground tracking-tight mb-2">{s.label}</h3>

              {/* Big stat */}
              <div className="flex items-baseline gap-1.5 mb-5">
                <span className="font-mono text-4xl font-bold text-primary leading-none">{s.stat}</span>
                <span className="text-xs text-foreground-subtle uppercase tracking-wide">{s.statLabel}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground-muted leading-relaxed mb-6 flex-1">{s.description}</p>

              {/* Highlights */}
              <ul className="space-y-2 mb-8">
                {s.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-xs text-foreground-subtle">
                    <span className="mt-1.5 h-px w-4 bg-border-strong shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-foreground-subtle hover:text-foreground transition-colors group-hover:text-primary"
              >
                View Dossier <ArrowUpRight className="h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </Container>
    </section>
  );
}
