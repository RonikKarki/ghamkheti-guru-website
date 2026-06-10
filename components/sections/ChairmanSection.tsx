"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";

interface CmsChairman {
  badge?:    string;
  subtitle?: string;
  title?:    string;
  body?:     string;
  items?:    { text?: string; photo?: string; estYear?: string; estLocation?: string; type?: string }[];
}

export function ChairmanSection({ cms }: { cms?: CmsChairman | null }) {
  const chairmanName  = cms?.badge    || "";
  const chairmanTitle = cms?.subtitle || "";
  const headline      = cms?.title    || null;

  const metaItem = cms?.items?.find((i) => i.type === "meta" || i.estYear);
  const photo    = metaItem?.photo || cms?.body || "";
  const estYear  = metaItem?.estYear    || "2009";
  const estLoc   = metaItem?.estLocation || "Kathmandu, Nepal";

  const paragraphs = (cms?.items ?? [])
    .filter((i) => i.text && i.type !== "meta")
    .map((i) => i.text!)
    .filter(Boolean);

  if (!chairmanName && !paragraphs.length) return null;

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Portrait side */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative">
            <div className="relative aspect-4/5 bg-surface border border-border overflow-hidden flex items-center justify-center">
              {photo ? (
                <Image
                  src={photo}
                  alt={chairmanName || "Leadership"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="text-center px-8">
                  <div className="h-28 w-28 mx-auto border border-primary/30 flex items-center justify-center mb-4">
                    <span className="text-4xl font-display font-black text-gradient">
                      {chairmanName ? chairmanName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "GG"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{chairmanName || "Leadership"}</p>
                  <p className="text-xs text-foreground-subtle">Ghamkheti Guru Company Limited</p>
                </div>
              )}
              {/* Est. badge — bottom-right overlay */}
              <div className="absolute bottom-0 right-0 bg-background border border-border px-5 py-4 text-center">
                <p className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-[0.16em] mb-0.5">Est.</p>
                <p className="text-2xl font-mono font-bold text-primary leading-none">{estYear}</p>
                <p className="text-[10px] text-foreground-subtle mt-1">{estLoc}</p>
              </div>
            </div>
          </motion.div>

          {/* Message side */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce} className="lg:pt-4">
            <div className="section-num">04 / Leadership</div>

            <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight mb-8">
              {headline ? (
                <span>{headline}</span>
              ) : (
                <>Built on <span className="text-gradient">Vision</span>, Driven by <span className="text-gradient">Purpose</span></>
              )}
            </h2>

            <div className="w-8 h-px bg-primary mb-8" />

            <blockquote className="space-y-5 mb-10">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-foreground-muted leading-[1.8] text-[15px] italic">{para}</p>
              ))}
              {!paragraphs.length && (
                <p className="text-foreground-muted leading-[1.8] text-[15px] italic">
                  We are committed to developing Nepal&apos;s natural resources responsibly, creating lasting value for our communities, investors, and the nation.
                </p>
              )}
            </blockquote>

            <div className="border-l-2 border-primary pl-5">
              <p className="font-semibold text-foreground text-sm">{chairmanName || "Ghamkheti Guru"}</p>
              {chairmanTitle && <p className="text-xs text-foreground-subtle mt-0.5">{chairmanTitle}</p>}
              <p className="text-xs text-foreground-subtle mt-0.5">Ghamkheti Guru Company Limited</p>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
