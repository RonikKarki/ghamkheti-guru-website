"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from "@/lib/animations";
import { Container } from "@/components/common/Container";

type SectorItem = {
  num?: string;
  label?: string;
  sector?: string;
  description?: string;
  href?: string;
  isCenter?: boolean;
};

const DEFAULT_SECTORS: SectorItem[] = [
  {
    num: "01",
    label: "Hydraulic Force",
    sector: "Hydropower · Energy",
    description: "Run-of-river hydroelectric project on the Sisakhola River in Solukhumbu — at PPA stage with Nepal Electricity Authority.",
    href: "/projects",
    isCenter: false,
  },
  {
    num: "02",
    label: "Solar Terracing",
    sector: "Solar Energy · Energy",
    description: "Ground-mounted solar PV installation in Solukhumbu at PPA stage — advancing Nepal's renewable energy transition.",
    href: "/projects",
    isCenter: true,
  },
  {
    num: "03",
    label: "Agro-Industry",
    sector: "Agriculture · Agro-Industrial",
    description: "Shree Suryodaya Khadya Udhyog Limited — modern rice milling with Japanese Satake technology in Gaindakot, Nawalpur.",
    href: "/subsidiaries",
    isCenter: false,
  },
];

interface CmsPortfolio {
  title?: string;
  subtitle?: string;
  items?: SectorItem[];
}

export function ProjectsShowcase({ cms }: { cms?: CmsPortfolio | null }) {
  const heading = cms?.title    || "Our Sectors";
  const subtext = cms?.subtitle || "Three integrated sectors working as one — clean energy and agro-industry building Nepal's economic and environmental future.";
  const sectors = (cms?.items && cms.items.length > 0) ? cms.items : DEFAULT_SECTORS;
  const [hovered, setHovered] = useState<string | null>(null);

  const isAmber = (idx: number, s: SectorItem) =>
    hovered === String(idx) || (hovered === null && s.isCenter);

  return (
    <section style={{ backgroundColor: "#1a1a1a" }} id="sectors">

      {/* Section header */}
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="pt-20 pb-14 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-center gap-2.5 mb-5"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            <span style={{ display: "inline-block", width: "2rem", height: "1px", backgroundColor: "rgba(255,255,255,0.20)" }} />
            <span className="text-[10px] font-mono tracking-[0.20em] uppercase">02 / Our Sectors</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2
              className="font-display font-bold text-white tracking-tight"
              style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              {heading}
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-medium tracking-widest uppercase shrink-0 transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              All Projects <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {subtext && (
            <p
              className="mt-4 text-[15px] leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              {subtext}
            </p>
          )}
        </motion.div>
      </Container>

      {/* Three full-height columns */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", minHeight: "520px" }}
      >
        {sectors.map((s, idx) => {
          const amber = isAmber(idx, s);
          return (
            <motion.div
              key={idx}
              variants={staggerItem}
              onMouseEnter={() => setHovered(String(idx))}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col justify-between p-10 lg:p-14 border-b md:border-b-0 md:border-r last:border-r-0 cursor-default"
              style={{
                backgroundColor: amber ? "#e8960a" : "transparent",
                borderColor: "rgba(255,255,255,0.07)",
                transition: "background-color 0.3s ease",
              }}
            >
              {/* Large ghost number at top */}
              <div
                className="font-display font-black select-none leading-none mb-8"
                style={{
                  fontSize: "clamp(5rem, 10vw, 10rem)",
                  color: amber ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.05)",
                  lineHeight: 1,
                  transition: "color 0.3s ease",
                }}
              >
                {s.num}
              </div>

              {/* Content block at bottom */}
              <div className="mt-auto">
                <p
                  className="text-[10px] font-mono tracking-[0.18em] uppercase mb-4"
                  style={{
                    color: amber ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.35)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {s.sector}
                </p>
                <h3
                  className="font-display font-bold uppercase tracking-tight mb-4"
                  style={{
                    fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                    color: amber ? "#0a0a0a" : "white",
                    lineHeight: 1.1,
                    transition: "color 0.3s ease",
                  }}
                >
                  {s.label}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{
                    color: amber ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.45)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {s.description}
                </p>
                <Link
                  href={s.href || "/projects"}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{
                    color: amber ? "#0a0a0a" : "rgba(255,255,255,0.50)",
                    transition: "color 0.3s ease",
                  }}
                >
                  View Dossier <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
