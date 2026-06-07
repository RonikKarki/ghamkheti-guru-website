"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Badge } from "@/components/ui/badge";
import { fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";

interface CmsChairman {
  badge?:    string;
  subtitle?: string;
  title?:    string;
  items?:    { text?: string }[];
}

export function ChairmanSection({ cms }: { cms?: CmsChairman | null }) {
  const chairmanName  = cms?.badge    || "";
  const chairmanTitle = cms?.subtitle || "";
  const headline      = cms?.title    || null;
  const paragraphs    = cms?.items?.length
    ? cms.items.map((p) => p.text ?? "").filter(Boolean)
    : [];

  if (!chairmanName && !paragraphs.length) return null;

  return (
    <Section variant="alt">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Portrait side */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-4/3 bg-linear-to-br from-brand-deep via-surface to-background border border-border-strong flex items-center justify-center">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gold/6 blur-2xl" />
              <div className="relative z-10 text-center px-8">
                <div className="h-32 w-32 mx-auto rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4">
                  <span className="text-5xl font-display font-black text-gradient">
                    {chairmanName ? chairmanName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "GG"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">{chairmanName || "Chairman"}</p>
                <p className="text-xs text-foreground-subtle">Ghamkheti Guru Company Limited</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 glass rounded-2xl px-5 py-4 text-center w-44">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">Est.</p>
              <p className="text-3xl font-display font-bold text-gradient leading-none">2009</p>
              <p className="text-[10px] text-foreground-subtle mt-1">Kathmandu, Nepal</p>
            </div>
          </motion.div>

          {/* Message side */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Badge variant="overline" dot className="mb-5">Chairman&apos;s Message</Badge>

            <h2 className="text-display-lg font-display text-foreground text-balance mb-6">
              {headline ? (
                <span>{headline}</span>
              ) : (
                <>
                  Built on{" "}
                  <span className="text-gradient">Vision</span>,{" "}
                  Driven by{" "}
                  <span className="text-gradient">Purpose</span>
                </>
              )}
            </h2>

            <Quote className="h-8 w-8 text-primary/20 mb-4" strokeWidth={1.5} />

            <blockquote className="space-y-4 mb-8">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-foreground-muted leading-relaxed italic">
                  {para}
                </p>
              ))}
            </blockquote>

            <div className="border-l-2 border-primary pl-4">
              <p className="font-semibold text-foreground">{chairmanName}</p>
              <p className="text-sm text-foreground-subtle">{chairmanTitle}</p>
              <p className="text-xs text-foreground-subtle">Ghamkheti Guru Company Limited</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
