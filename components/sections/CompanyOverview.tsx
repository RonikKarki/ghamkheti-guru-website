"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Sun, Sprout, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { fadeUp, fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";

const ICON_MAP: Record<string, React.ElementType> = {
  hydropower:  Droplets,
  solar:       Sun,
  agriculture: Sprout,
};

const PILLAR_ACCENTS = [
  { color: "text-teal",    border: "border-teal/20",    bg: "bg-teal/5"    },
  { color: "text-gold",    border: "border-gold/20",    bg: "bg-gold/5"    },
  { color: "text-primary", border: "border-primary/20", bg: "bg-primary/5" },
];

const DEFAULT_PILLARS = [
  { label: "Hydropower",   detail: "Run-of-river & storage hydroelectric projects across Nepal's major river systems." },
  { label: "Solar Energy", detail: "Ground-mounted and rooftop solar PV installations powering communities and industry." },
  { label: "Agriculture",  detail: "Modern rice milling with Japanese Satake technology through our subsidiary in Gaindakot, Nawalpur." },
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

  const rawItems      = cms?.items ?? [];
  const pillars       = rawItems.filter((i) => !i.type || i.type === "pillar");
  const quoteItem     = rawItems.find((i) => i.type === "quote");
  const displayPillars = pillars.length > 0 ? pillars : DEFAULT_PILLARS;
  const quoteText      = quoteItem?.text || cms?.badge || "";
  const quoteAttr      = quoteItem?.attribution || "";

  return (
    <section className="py-24 md:py-32 bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — text */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <div className="section-num">02 / Who We Are</div>

            <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight mb-6">
              {sectionTitle ? (
                <span>{sectionTitle}</span>
              ) : (
                <>An Integrated Force in Nepal&apos;s <span className="text-gradient">Growth Story</span></>
              )}
            </h2>

            {paragraph1 && (
              <p className="text-foreground-muted leading-relaxed mb-4 text-[15px]">{paragraph1}</p>
            )}
            {paragraph2 && (
              <p className="text-foreground-muted leading-relaxed mb-10 text-[15px]">{paragraph2}</p>
            )}
            {!paragraph1 && !paragraph2 && (
              <p className="text-foreground-muted leading-relaxed mb-10 text-[15px]">
                Ghamkheti Guru Company Limited is a Kathmandu-based integrated development company delivering clean energy, modern agro-industry, and sustainable tourism across Nepal.
              </p>
            )}

            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              Our Full Story <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          {/* Right — pillar rows + quote */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce} className="space-y-2.5">
            {displayPillars.map(({ label = "", detail = "" }, i) => {
              const accent  = PILLAR_ACCENTS[i % PILLAR_ACCENTS.length];
              const iconKey = label.toLowerCase().includes("hydro") ? "hydropower"
                : label.toLowerCase().includes("solar") ? "solar" : "agriculture";
              const Icon    = ICON_MAP[iconKey] ?? Sprout;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-start gap-4 p-5 border ${accent.border} ${accent.bg} group hover:border-opacity-50 transition-all duration-300`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center border ${accent.border}`}>
                    <Icon className={`h-4.5 w-4.5 ${accent.color}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{label}</h3>
                    <p className="text-sm text-foreground-muted leading-relaxed">{detail}</p>
                  </div>
                </motion.div>
              );
            })}

            {quoteText && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="relative p-5 border border-primary/15"
                style={{ background: "rgba(0,212,106,0.04)" }}
              >
                <p className="text-sm text-foreground/75 italic leading-relaxed">&ldquo;{quoteText}&rdquo;</p>
                {quoteAttr && (
                  <p className="text-xs font-semibold text-primary mt-3">— {quoteAttr}</p>
                )}
              </motion.div>
            )}
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
