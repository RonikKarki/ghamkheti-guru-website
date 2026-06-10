"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { fadeUp, viewportOnce } from "@/lib/animations";

interface CmsPillar { label?: string; detail?: string; type?: string; text?: string; attribution?: string; }
interface CmsAbout {
  title?:    string;
  body?:     string;
  subtitle?: string;
  badge?:    string;
  items?:    CmsPillar[];
}

export function CompanyOverview({ cms }: { cms?: CmsAbout | null }) {
  const sectionTitle = cms?.title    || "An Integrated\nForce in\nNepal's Growth";
  const paragraph1   = cms?.body     || "Ghamkheti Guru Company Limited is a Kathmandu-based integrated development company delivering clean energy, modern agro-industry, and sustainable tourism across Nepal.";
  const paragraph2   = cms?.subtitle || "";

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border" id="about">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Two-column editorial layout — label + title LEFT, body text RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24 items-start">

            {/* LEFT: section label + huge stacked condensed title */}
            <div>
              <div className="section-num mb-8">01 / Who We Are</div>
              <h2
                className="font-display font-bold text-foreground tracking-tight"
                style={{
                  fontSize: "clamp(2.8rem, 5vw, 5.5rem)",
                  lineHeight: 1,
                  whiteSpace: "pre-line",
                  letterSpacing: "-0.03em",
                }}
              >
                {sectionTitle}
              </h2>
            </div>

            {/* RIGHT: body paragraphs + CTA */}
            <div className="pt-2 lg:pt-20">
              {paragraph1 && (
                <p className="text-foreground leading-relaxed mb-6 text-[17px]">
                  {paragraph1}
                </p>
              )}
              {paragraph2 && (
                <p className="text-foreground-muted leading-relaxed mb-10 text-[16px]">
                  {paragraph2}
                </p>
              )}
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
              >
                Our Full Story <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
