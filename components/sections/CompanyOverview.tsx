"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { fadeUp, viewportOnce } from "@/lib/animations";

interface CmsPillar { label?: string; detail?: string; type?: string; text?: string; attribution?: string; url?: string; alt?: string; }
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
  const sideImages   = (cms?.items ?? []).filter((i) => i.type === "image" && i.url).slice(0, 2);

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-background border-t border-border" id="about">
      {/* Brand emblem watermark behind the title */}
      <div
        className="absolute pointer-events-none select-none"
        aria-hidden="true"
        style={{
          top: "50%",
          left: "-6%",
          transform: "translateY(-50%)",
          width: "clamp(280px, 30vw, 480px)",
          height: "clamp(280px, 30vw, 480px)",
          opacity: 0.1,
        }}
      >
        <Image src="/images/logos/ghamkheti-emblem.png" alt="" fill className="object-contain" />
      </div>

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
            <div className="relative">
              <div className="section-num mb-8">Who We Are</div>
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

              {/* Small accent photos beside the headline */}
              {sideImages.length > 0 && (
                <div className="flex items-end gap-4 mt-8">
                  {sideImages.map((img, i) => (
                    <div
                      key={img.url}
                      className="relative overflow-hidden rounded-xl border border-border shadow-lg"
                      style={{
                        width: i === 0 ? "8.5rem" : "6.5rem",
                        height: i === 0 ? "10.5rem" : "8rem",
                        transform: i === 1 ? "translateY(0.75rem) rotate(2deg)" : "rotate(-1.5deg)",
                      }}
                    >
                      <Image src={img.url!} alt={img.alt ?? ""} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
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
