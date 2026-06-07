"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Droplets, Sun, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { staggerContainer, staggerItem, EASE_OUT_BEZIER as E } from "@/lib/animations";

const pillars = [
  { icon: Droplets, label: "Hydropower"   },
  { icon: Sun,      label: "Solar Energy" },
  { icon: Sprout,   label: "Agriculture"  },
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
  const subheadline  = cms?.subtitle  || "From the Himalayan rivers to the Terai plains — developing world-class hydropower, solar installations, and agro-industrial enterprises for a stronger, greener Nepal.";
  const body         = cms?.body      || "";
  const primaryLabel = cms?.primaryCta?.label  || "Explore Our Projects";
  const primaryHref  = cms?.primaryCta?.href   || "/projects";
  const secondLabel  = cms?.secondaryCta?.label || "Investor Relations";
  const secondHref   = cms?.secondaryCta?.href  || "/investor-relations";
  const heroStats    = cms?.items?.length ? cms.items : DEFAULT_STATS;

  const slides = (heroImages ?? []).filter((s) => s.url && s.isVisible !== false);
  const [current, setCurrent]   = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        setPrevSlide(c);
        return (c + 1) % slides.length;
      });
    }, 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slides.length]);

  /* gradient keyword split */
  const headlineParts = (() => {
    const keywords = ["Sustainable", "Future", "Green", "Energy", "Nepal"];
    for (const kw of keywords) {
      if (headline.includes(kw)) {
        const idx = headline.indexOf(kw);
        return { before: headline.slice(0, idx), keyword: kw, after: headline.slice(idx + kw.length) };
      }
    }
    return null;
  })();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ backgroundColor: "#07080d" }}>

      {/* ── Background slides — CSS crossfade, no opacity:0 on mount ── */}
      {slides.map((slide, i) => (
        <div
          key={slide.url}
          aria-hidden={i !== current}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 2 : (i === prevSlide ? 1 : 0) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.url}
            alt={slide.alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay — always bg-black, never bg-background */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "#000", opacity: Math.max((slide.overlay ?? 65), 50) / 100 }}
          />
        </div>
      ))}

      {/* Bottom-to-top gradient for stats readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: "linear-gradient(to top, rgba(7,8,13,0.95) 0%, rgba(7,8,13,0.35) 40%, transparent 70%)",
        }}
      />

      {/* Fallback: no-image radial glow */}
      {slides.length === 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(0,212,106,0.16) 0%, transparent 65%), radial-gradient(ellipse 50% 80% at -5% 50%, rgba(0,212,106,0.07) 0%, transparent 60%)",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      )}

      {/* Top green spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          zIndex: 3,
          width: "90%",
          height: "65%",
          background: "radial-gradient(ellipse 70% 60% at 50% -5%, rgba(0,212,106,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 10 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrevSlide(current); setCurrent(i); }}
              aria-label={`Slide ${i + 1}`}
              className={`h-px rounded-full transition-all duration-500 ${
                i === current
                  ? "w-8 bg-primary shadow-[0_0_8px_rgba(0,212,106,0.7)]"
                  : "w-4 bg-white/30 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Content — white text, z above background layers ── */}
      <Container className="relative pt-36 pb-24 md:pt-44 md:pb-32" style={{ zIndex: 5 }}>
        <div className="max-w-5xl">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">

            {/* Overline pill */}
            <motion.div variants={staggerItem}>
              <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 rounded-full px-4 py-1.5 mb-10 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.20em] text-white/70">
                  Nepal&apos;s Integrated Energy &amp; Agriculture Leader
                </span>
              </div>
            </motion.div>

            {/* Headline — white always */}
            <motion.h1
              variants={staggerItem}
              className="text-display-2xl font-display leading-[1.04] mb-6 text-balance"
              style={{ color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              {headlineParts ? (
                <>
                  <span>{headlineParts.before}</span>
                  <span className="text-gradient">{headlineParts.keyword}</span>
                  <span>{headlineParts.after}</span>
                </>
              ) : headline}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={staggerItem}
              className="text-base md:text-lg leading-relaxed max-w-[560px] mb-10 text-pretty"
              style={{ color: "rgba(255,255,255,0.70)", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
            >
              {body || subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-14">
              <Button asChild size="xl" variant="gradient">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild size="xl"
                className="bg-white/10 border border-white/20 text-white hover:bg-white/15 hover:border-white/35 backdrop-blur-sm"
              >
                <Link href={secondHref}>{secondLabel}</Link>
              </Button>
            </motion.div>

            {/* Sector pills */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-2 mb-16">
              {pillars.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 border border-white/15 bg-white/5 rounded-full px-3.5 py-1.5 backdrop-blur-sm"
                >
                  <Icon className="h-3 w-3 text-primary" strokeWidth={2} />
                  <span className="text-[11px] font-medium text-white/70 tracking-wide">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div variants={staggerItem}>
              <div className="h-px w-full mb-8" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {heroStats.map((s, i) => (
                  <motion.div
                    key={s.label ?? i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.5, ease: E }}
                  >
                    <p className="text-2xl md:text-3xl font-display font-bold text-gradient leading-none mb-1.5 tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-xs tracking-wide" style={{ color: "rgba(255,255,255,0.40)" }}>{s.label}</p>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        style={{ zIndex: 10, color: "rgba(255,255,255,0.35)" }}
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
