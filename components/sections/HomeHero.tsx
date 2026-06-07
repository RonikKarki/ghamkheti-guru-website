"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Droplets, Sun, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { staggerContainer, staggerItem, EASE_OUT_BEZIER as E } from "@/lib/animations";

const pillars = [
  { icon: Droplets, label: "Hydropower",   color: "text-teal" },
  { icon: Sun,      label: "Solar Energy", color: "text-gold" },
  { icon: Sprout,   label: "Agriculture",  color: "text-primary" },
];

const DEFAULT_STATS = [
  { value: "4.9 MW",  label: "Hydropower Pipeline" },
  { value: "10 MW",   label: "Solar Energy Pipeline" },
  { value: "8 T/Hr",  label: "Rice Mill Capacity" },
  { value: "3",       label: "Business Sectors" },
];

interface CmsHero {
  title?:        string;
  subtitle?:     string;
  body?:         string;
  primaryCta?:   { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  items?:        { value?: string; label?: string }[];
}

interface HeroImage { url: string; alt?: string; isVisible?: boolean; overlay?: number }

export function HomeHero({
  cms,
  heroImages,
}: {
  cms?: CmsHero | null;
  heroImages?: HeroImage[];
}) {
  const headline     = cms?.title     || "Powering Nepal's Sustainable Future";
  const subheadline  = cms?.subtitle  || "From the Himalayan rivers to the Terai plains — we develop world-class hydropower, solar installations, and agro-industrial enterprises that build a stronger, greener Nepal.";
  const body         = cms?.body      || "";
  const primaryLabel = cms?.primaryCta?.label  || "Explore Our Projects";
  const primaryHref  = cms?.primaryCta?.href   || "/projects";
  const secondLabel  = cms?.secondaryCta?.label || "Investor Relations";
  const secondHref   = cms?.secondaryCta?.href  || "/investor-relations";
  const heroStats    = cms?.items?.length ? cms.items : DEFAULT_STATS;

  const slides = heroImages?.filter((s) => s.url && s.isVisible !== false) ?? [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  /* Split headline for gradient highlight */
  const headlineParts = (() => {
    const keywords = ["Sustainable", "Future", "Green", "Energy", "Nepal"];
    for (const kw of keywords) {
      if (headline.includes(kw)) {
        const [before, after] = headline.split(kw);
        return { before, keyword: kw, after };
      }
    }
    return null;
  })();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background">

      {/* ── Sliding background images ── */}
      {slides.length > 0 && (
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[current].url}
                alt={slides[current].alt ?? ""}
                fill
                className="object-cover"
                priority={current === 0}
                sizes="100vw"
              />
              <div
                className="absolute inset-0 bg-background"
                style={{ opacity: (slides[current]?.overlay ?? 62) / 100 }}
              />
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-px rounded-full transition-all duration-500 ${
                    i === current
                      ? "w-8 bg-primary shadow-[0_0_8px_rgba(0,212,106,0.7)]"
                      : "w-4 bg-white/25 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Radial green spotlight — top centre ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "90%",
          height: "100%",
          background:
            "radial-gradient(ellipse 75% 60% at 50% -5%, rgba(0,212,106,0.16) 0%, transparent 65%)",
        }}
      />

      {/* Left ambient glow */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none"
        style={{
          width: "45%",
          height: "80%",
          background:
            "radial-gradient(ellipse 70% 80% at -10% 50%, rgba(0,212,106,0.07) 0%, transparent 65%)",
        }}
      />

      {/* ── Content ── */}
      <Container className="relative z-10 pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="max-w-5xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Overline pill */}
            <motion.div variants={staggerItem}>
              <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5 mb-10">
                <span className="h-1 w-1 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.20em] text-primary">
                  Nepal&apos;s Integrated Energy &amp; Agriculture Leader
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={staggerItem}
              className="text-display-2xl font-display text-foreground leading-[1.04] mb-6 text-balance"
            >
              {headlineParts ? (
                <>
                  <span>{headlineParts.before}</span>
                  <span className="text-gradient">{headlineParts.keyword}</span>
                  <span>{headlineParts.after}</span>
                </>
              ) : (
                headline
              )}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={staggerItem}
              className="text-base md:text-lg text-foreground-muted leading-relaxed max-w-[560px] mb-10 text-pretty"
            >
              {body || subheadline}
            </motion.p>

            {/* CTA row */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-14">
              <Button asChild size="xl" variant="gradient">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="glass">
                <Link href={secondHref}>{secondLabel}</Link>
              </Button>
            </motion.div>

            {/* Sector pills */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-2 mb-16">
              {pillars.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 border border-border bg-surface/60 rounded-full px-3.5 py-1.5 backdrop-blur-sm"
                >
                  <Icon className="h-3 w-3 text-primary" strokeWidth={2} />
                  <span className="text-[11px] font-medium text-foreground-muted tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div variants={staggerItem}>
              <div className="h-px w-full bg-border mb-8" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {heroStats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.5, ease: E }}
                  >
                    <p className="text-2xl md:text-3xl font-display font-bold text-gradient leading-none mb-1.5 tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-xs text-foreground-subtle tracking-wide">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6, ease: E }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground-subtle cursor-pointer z-20"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
