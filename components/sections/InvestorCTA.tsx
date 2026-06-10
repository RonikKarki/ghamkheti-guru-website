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
  const heading      = cms?.title    || "Partner With Us for Sustainable Growth";
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
    <section className="py-24 md:py-32 bg-background border-t border-border">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Section label */}
          <div className="section-num mb-0">06 / Investor Relations</div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
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
                    <span className="mt-2 h-px w-4 bg-primary shrink-0" />
                    <span className="text-sm text-foreground-muted leading-relaxed">{text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                >
                  {primaryLabel} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={secondHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold border border-border text-foreground-muted hover:text-foreground hover:border-foreground-subtle transition-colors duration-200"
                >
                  {secondLabel}
                </Link>
              </div>
            </div>

            {/* Right — metrics grid */}
            <div className="grid grid-cols-2 gap-px bg-border">
              {displayMetrics.map((m, i) => (
                <div key={i} className="bg-surface p-6 text-center hover:bg-surface-raised transition-colors duration-300">
                  <p className="font-mono text-2xl md:text-3xl font-bold text-primary leading-none mb-1.5 tabular-nums">{m.v}</p>
                  <p className="text-[11px] text-foreground-subtle uppercase tracking-widest">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
