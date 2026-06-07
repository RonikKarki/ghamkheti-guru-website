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

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background">
      {/* Sliding background images */}
      {slides.length > 0 && (
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
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
              {/* Dark overlay — opacity controlled per slide from admin */}
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: (slides[current]?.overlay ?? 55) / 100 }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gradient overlay (always present, stronger when no photos) */}
      <div className={`absolute inset-0 bg-hero-gradient ${slides.length > 0 ? "opacity-60" : ""}`} />
      <div className="absolute inset-0 noise-overlay opacity-40" />

      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 h-150 w-150 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 h-125 w-125 rounded-full bg-teal/4 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-100 w-100 rounded-full bg-brand-gold/4 blur-[100px] pointer-events-none" />

      {/* Mountain silhouette (hidden when photos present) */}
      {slides.length === 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none opacity-10">
          <svg viewBox="0 0 1440 280" preserveAspectRatio="none" className="w-full h-full" fill="currentColor">
            <path className="text-primary" d="M0 280L180 140L360 200L540 80L720 160L900 40L1080 120L1260 60L1440 100V280H0Z" />
            <path className="text-brand-deep" d="M0 280L240 180L480 240L660 120L840 200L1020 80L1200 150L1440 100V280H0Z" opacity="0.6" />
          </svg>
        </div>
      )}

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <Container className="relative z-10 pt-36 pb-24 md:pt-44 md:pb-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          {/* Overline badge */}
          <motion.div variants={staggerItem}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground-muted">
                Nepal&apos;s Integrated Energy &amp; Agriculture Leader
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={staggerItem}
            className="text-display-2xl font-display text-foreground leading-[1.02] mb-6 text-balance"
          >
            {headline.includes("Sustainable") ? (
              <>
                {headline.split("Sustainable")[0]}
                <span className="relative inline-block">
                  <span className="text-gradient">Sustainable</span>
                </span>
                {headline.split("Sustainable")[1]}
              </>
            ) : (
              <span>{headline}</span>
            )}
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-2xl mb-10 text-pretty"
          >
            {body || subheadline}
          </motion.p>

          {/* CTA row */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-4 mb-14">
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

          {/* Sector pillars */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-16">
            {pillars.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 glass rounded-full px-4 py-2">
                <Icon className={`h-3.5 w-3.5 ${color}`} strokeWidth={2} />
                <span className="text-xs font-medium text-foreground-muted">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero stats */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border"
          >
            {heroStats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-display font-bold text-gradient leading-none mb-1">
                  {s.value}
                </p>
                <p className="text-xs text-foreground-subtle">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6, ease: E }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-foreground-subtle cursor-pointer z-20"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
      >
        <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
