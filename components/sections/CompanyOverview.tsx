"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Sun, Sprout, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { fadeUp, fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";

const ICON_MAP: Record<string, React.ElementType> = {
  hydropower: Droplets,
  solar:      Sun,
  agriculture: Sprout,
};

const PILLAR_STYLES: Array<{ color: string; bg: string }> = [
  { color: "text-teal",    bg: "bg-teal/10 border-teal/20"    },
  { color: "text-gold",    bg: "bg-gold/10 border-gold/20"    },
  { color: "text-primary", bg: "bg-primary/10 border-primary/20" },
];

const DEFAULT_PILLARS = [
  { label: "Hydropower",    detail: "Run-of-river & storage hydroelectric projects across Nepal's major river systems." },
  { label: "Solar Energy",  detail: "Ground-mounted and rooftop solar PV installations powering communities and industry." },
  { label: "Agriculture",   detail: "Modern rice milling with Japanese Satake technology through our subsidiary in Gaindakot, Nawalpur." },
];

interface CmsPillar { label?: string; detail?: string; type?: string; text?: string; attribution?: string; }

interface CmsAbout {
  title?:    string;
  body?:     string;
  subtitle?: string;
  badge?:    string;
  items?:    CmsPillar[];
}

export function CompanyOverview({ cms }: { cms?: CmsAbout | null }) {
  const sectionTitle = cms?.title    || null;
  const paragraph1   = cms?.body     || "";
  const paragraph2   = cms?.subtitle || "";

  const rawItems = cms?.items ?? [];
  const pillars  = rawItems.filter((i) => !i.type || i.type === "pillar");
  const quoteItem = rawItems.find((i) => i.type === "quote");

  const displayPillars = pillars.length > 0 ? pillars : DEFAULT_PILLARS;
  const quoteText      = quoteItem?.text        || cms?.badge || "";
  const quoteAttr      = quoteItem?.attribution || "";

  return (
    <Section variant="surface" id="about-overview">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">Who We Are</span>
            </div>

            <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight mb-5">
              {sectionTitle ? (
                <span>{sectionTitle}</span>
              ) : (
                <>An Integrated Force in <span className="text-gradient">Nepal&apos;s Growth Story</span></>
              )}
            </h2>

            {paragraph1 && <p className="text-foreground-muted leading-relaxed mb-4">{paragraph1}</p>}
            {paragraph2 && <p className="text-foreground-muted leading-relaxed mb-10">{paragraph2}</p>}

            <Button asChild size="lg" variant="gradient">
              <Link href="/about">Our Full Story <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </motion.div>

          {/* Right — sector cards + quote */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce} className="space-y-3">
            {displayPillars.map(({ label = "", detail = "" }, i) => {
              const style = PILLAR_STYLES[i % PILLAR_STYLES.length];
              const iconKey = label.toLowerCase().includes("hydro") ? "hydropower"
                : label.toLowerCase().includes("solar") ? "solar" : "agriculture";
              const Icon = ICON_MAP[iconKey] ?? Sprout;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl p-5 border border-border bg-surface-raised hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${style.bg} transition-transform duration-300 group-hover:scale-105`}>
                    <Icon className={`h-5 w-5 ${style.color}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{label}</h3>
                    <p className="text-sm text-foreground-muted leading-relaxed">{detail}</p>
                  </div>
                </div>
              );
            })}

            {quoteText && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="relative rounded-2xl overflow-hidden p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(0,84,42,0.50) 0%, rgba(0,82,30,0.35) 60%, rgba(0,45,20,0.50) 100%)",
                  border: "1px solid rgba(0,212,106,0.15)",
                }}
              >
                <div className="absolute top-0 right-0 h-24 w-24 blur-2xl pointer-events-none" style={{ background: "rgba(0,212,106,0.15)" }} />
                <p className="text-sm text-foreground/80 italic leading-relaxed relative z-10">&ldquo;{quoteText}&rdquo;</p>
                {quoteAttr && <p className="text-xs font-semibold text-primary mt-3 relative z-10">— {quoteAttr}</p>}
              </motion.div>
            )}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
