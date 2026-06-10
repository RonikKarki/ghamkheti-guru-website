"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, FileText, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/animations";

const HIGHLIGHT_ICONS = [TrendingUp, FileText, Shield, CheckCircle];

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
    <section className="py-20 md:py-28 bg-background">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-3xl border border-primary/20"
        >
          <div className="absolute inset-0 bg-linear-to-br from-brand-deep via-brand-mid/40 to-brand-deep" />
          <div className="absolute inset-0 noise-overlay opacity-20" />
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/4 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-black/20 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-48 w-48 -translate-y-1/2 rounded-full bg-gold/6 blur-2xl" />

          <div className="relative z-10 px-8 py-14 md:px-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-[0.65rem] font-semibold tracking-[0.14em] uppercase bg-white/10 text-white/90 border border-white/15">
                  Investor Relations
                </span>
                <h2 className="text-display-lg font-display text-white text-balance mb-5">{heading}</h2>
                <p className="text-white/70 leading-relaxed mb-8">{bodyText}</p>

                <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3 mb-10">
                  {displayHighlights.map((text, i) => {
                    const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                    return (
                      <motion.li key={i} variants={staggerItem} className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-white/70 leading-relaxed">{text}</span>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="xl" className="bg-white text-brand-deep font-semibold hover:bg-white/95">
                    <Link href={primaryHref}>{primaryLabel} <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild size="xl" className="bg-transparent border border-white/30 text-white hover:bg-white/10">
                    <Link href={secondHref}>{secondLabel}</Link>
                  </Button>
                </div>
              </div>

              {/* Right — metrics */}
              <div className="grid grid-cols-2 gap-4">
                {displayMetrics.map((m, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
                    <p className="text-2xl md:text-3xl font-display font-bold text-white leading-none mb-1">{m.v}</p>
                    <p className="text-[11px] text-white/60">{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
