"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/animations";

const DEFAULT_HIGHLIGHTS = [
  "Stable long-term Power Purchase Agreements with Nepal Electricity Authority",
  "Audited annual reports and quarterly financial disclosures",
  "Full compliance with Securities Board of Nepal (SEBON) standards",
];

const DEFAULT_METRICS = [
  { v: "4.9 MW",  l: "Hydropower Pipeline" },
  { v: "10 MW",   l: "Solar Energy Pipeline" },
  { v: "25+ Yrs", l: "PPA Tenor" },
  { v: "8 T/Hr",  l: "Rice Mill Capacity" },
];

interface CmsItem { type?: string; v?: string; l?: string; text?: string; }
interface CmsInvestorCta {
  title?:        string;
  subtitle?:     string;
  items?:        CmsItem[];
  primaryCta?:   { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function InvestorCTA({ cms }: { cms?: CmsInvestorCta | null }) {
  const heading      = cms?.title    || "Active Deployments";
  const bodyText     = cms?.subtitle || "Join us in developing transformative energy and infrastructure projects that contribute to Nepal's economic progress and sustainable development.";
  const primaryLabel = cms?.primaryCta?.label  || "View Portfolio";
  const primaryHref  = cms?.primaryCta?.href   || "/projects";
  const secondLabel  = cms?.secondaryCta?.label || "Investor Relations";
  const secondHref   = cms?.secondaryCta?.href  || "/investor-relations";

  const allItems   = cms?.items ?? [];
  const metrics    = allItems.filter((i) => i.type === "metric" || i.v).slice(0, 4);
  const highlights = allItems.filter((i) => i.type === "highlight" || i.text).map((i) => i.text ?? "").filter(Boolean);

  const displayMetrics    = metrics.length    > 0 ? metrics    : DEFAULT_METRICS;
  const displayHighlights = highlights.length > 0 ? highlights : DEFAULT_HIGHLIGHTS;

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border" id="invest">
      <Container>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div className="section-num">06 / Investor Relations</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start mt-10">
            {/* Left */}
            <div>
              <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight mb-6">
                {heading}
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-10 text-[15px]">{bodyText}</p>

              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4 mb-10"
              >
                {displayHighlights.map((text, i) => (
                  <motion.li key={i} variants={staggerItem} className="flex items-start gap-3">
                    <span className="mt-2 h-px w-5 bg-primary shrink-0" />
                    <span className="text-sm text-foreground-muted leading-relaxed">{text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-semibold tracking-widest uppercase bg-foreground text-background hover:opacity-80 transition-opacity duration-200"
                >
                  {primaryLabel} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={secondHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-semibold tracking-widest uppercase border border-border text-foreground-muted hover:text-foreground hover:border-foreground-subtle transition-colors duration-200"
                >
                  {secondLabel}
                </Link>
              </div>
            </div>

            {/* Right — metrics 2×2 grid */}
            <div className="grid grid-cols-2 gap-px bg-border">
              {displayMetrics.map((m, i) => (
                <div key={i} className="bg-background hover:bg-surface transition-colors duration-300 p-8 text-center">
                  <p className="font-mono text-3xl md:text-4xl font-bold text-foreground leading-none mb-2 tabular-nums">{m.v}</p>
                  <p className="text-[10px] text-foreground-subtle uppercase tracking-widest">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
