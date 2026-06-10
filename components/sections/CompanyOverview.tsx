"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { fadeUp, viewportOnce } from "@/lib/animations";

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
  const sectionTitle  = cms?.title    || null;
  const paragraph1    = cms?.body     || "";
  const paragraph2    = cms?.subtitle || "";

  const rawItems       = cms?.items ?? [];
  const pillars        = rawItems.filter((i) => !i.type || i.type === "pillar");
  const quoteItem      = rawItems.find((i) => i.type === "quote");
  const displayPillars = pillars.length > 0 ? pillars : DEFAULT_PILLARS;
  const quoteText      = quoteItem?.text || cms?.badge || "";
  const quoteAttr      = quoteItem?.attribution || "";

  return (
    /* Light section — matches reference "01 / Nexus" */
    <section className="py-24 md:py-32 bg-background border-t border-border" id="about">
      <Container>

        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 md:mb-20"
        >
          <div className="section-num">01 / Who We Are</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight">
              {sectionTitle ?? (
                <>An Integrated Force in Nepal&apos;s <span className="text-gradient">Growth Story</span></>
              )}
            </h2>
            <div>
              {(paragraph1 || !sectionTitle) && (
                <p className="text-foreground-muted leading-relaxed text-[15px] mb-3">
                  {paragraph1 || "Ghamkheti Guru Company Limited is a Kathmandu-based integrated development company delivering clean energy, modern agro-industry, and sustainable tourism across Nepal."}
                </p>
              )}
              {paragraph2 && (
                <p className="text-foreground-muted leading-relaxed text-[15px]">{paragraph2}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Three pillars — numbered columns, reference "System Convergence" style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-14">
          {displayPillars.map(({ label = "", detail = "" }, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-background p-8 md:p-10 hover:bg-surface transition-colors duration-300"
            >
              <div className="font-mono text-[10px] tracking-widest text-foreground-subtle mb-6">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-3 tracking-tight">{label}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote + CTA row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          {quoteText && (
            <blockquote className="max-w-lg border-l-2 border-primary pl-5">
              <p className="text-sm text-foreground-muted italic leading-relaxed">&ldquo;{quoteText}&rdquo;</p>
              {quoteAttr && <p className="text-xs font-semibold text-primary mt-2">— {quoteAttr}</p>}
            </blockquote>
          )}
          <Link
            href="/about"
            className="inline-flex items-center gap-2.5 self-start sm:self-auto px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-200 shrink-0"
          >
            Our Full Story <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </Container>
    </section>
  );
}
