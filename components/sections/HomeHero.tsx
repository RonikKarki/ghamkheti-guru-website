"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem, EASE_OUT_BEZIER as E } from "@/lib/animations";

const DEFAULT_STATS = [
  { value: "4.9 MW",  label: "Hydropower" },
  { value: "10 MW",   label: "Solar" },
  { value: "8 T/Hr",  label: "Rice Mill" },
  { value: "03",      label: "Sectors" },
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
  const headline     = cms?.title     || "";
  const subheadline  = cms?.subtitle  || "From the Himalayan rivers to the Terai plains — developing world-class hydropower, solar installations, and agro-industrial enterprises for a stronger, greener Nepal.";
  const body         = cms?.body      || "";
  const primaryLabel = cms?.primaryCta?.label  || "Explore Projects";
  const primaryHref  = cms?.primaryCta?.href   || "/projects";
  const secondLabel  = cms?.secondaryCta?.label || "Our Story";
  const secondHref   = cms?.secondaryCta?.href  || "/about";
  const heroStats    = cms?.items?.length ? cms.items : DEFAULT_STATS;

  const slides  = (heroImages ?? []).filter((s) => s.url && s.isVisible !== false);
  const [current, setCurrent]     = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => { setPrevSlide(c); return (c + 1) % slides.length; });
    }, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slides.length]);

  return (
    <section className="relative flex min-h-screen bg-background">

      {/* ── LEFT PANEL — cream background, editorial text ── */}
      <div className="relative z-10 flex flex-col justify-between w-full lg:w-[52%] shrink-0 pt-28 pb-10 px-8 md:px-12 lg:px-16 overflow-hidden">

        {/* Ghost watermark text behind content */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display font-black uppercase leading-none"
            style={{
              fontSize: "clamp(8rem, 20vw, 20rem)",
              color: "rgba(0,0,0,0.04)",
              letterSpacing: "-0.06em",
              whiteSpace: "nowrap",
            }}
          >
            GURU
          </span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col flex-1 justify-end pb-4 relative"
        >
          {/* Section label */}
          <motion.div variants={staggerItem} className="mb-8">
            <div className="flex items-center gap-2.5 text-foreground-subtle">
              <span style={{ display: "inline-block", width: "2rem", height: "1px", backgroundColor: "currentColor" }} />
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase">
                Ghamkheti Guru · Energy &amp; Agriculture
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={staggerItem}
            className="font-display font-bold text-balance mb-6"
            style={{
              fontSize: "clamp(2.6rem, 4.5vw + 0.5rem, 5.2rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
            }}
          >
            {headline ? (
              <span className="text-foreground">{headline}</span>
            ) : (
              <>
                <span className="text-foreground">The Sun Flows</span>
                <br />
                <span className="text-foreground">Through </span>
                <span style={{ color: "#e8960a" }}>Grain</span>
              </>
            )}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={staggerItem}
            className="text-[15px] leading-[1.75] mb-10 max-w-136 text-foreground-muted"
          >
            {body || subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-foreground tracking-wide group"
            >
              <span
                className="inline-flex items-center justify-center h-10 px-5 border transition-colors duration-200 group-hover:bg-foreground group-hover:text-background"
                style={{ borderColor: "rgba(0,0,0,0.25)" }}
              >
                {primaryLabel}
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href={secondHref}
              className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200"
            >
              {secondLabel} →
            </Link>
          </motion.div>

          {/* Geo metadata tag */}
          <motion.div variants={staggerItem} className="mb-10">
            <div
              className="inline-flex items-center gap-3 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] border border-foreground/10 text-foreground-subtle"
            >
              <span>Alt 1,400m</span>
              <span className="opacity-40">·</span>
              <span>27.7172° N</span>
              <span className="opacity-40">·</span>
              <span>85.3240° E</span>
              <span className="opacity-40">·</span>
              <span>Kathmandu, Nepal</span>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div variants={staggerItem}>
            <div className="h-px mb-7 bg-border" />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {heroStats.map((s, i) => (
                <motion.div
                  key={s.label ?? i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.07, duration: 0.5, ease: E }}
                  className="flex items-baseline gap-1.5"
                >
                  <span className="font-mono text-xl md:text-2xl font-bold leading-none text-primary">
                    {s.value}
                  </span>
                  <span className="text-[10px] tracking-[0.14em] uppercase text-foreground-subtle">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — image slider (desktop) ── */}
      <div className="hidden lg:block flex-1 relative overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
        {slides.length > 0 ? (
          slides.map((slide, i) => (
            <div
              key={slide.url}
              aria-hidden={i !== current}
              className="absolute inset-0 transition-opacity duration-1800 ease-in-out"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 2 : (i === prevSlide ? 1 : 0) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.url} alt={slide.alt ?? ""} className="absolute inset-0 w-full h-full object-contain" />
              {/* Left-edge gradient blending with cream left panel */}
              <div
                className="absolute inset-y-0 left-0 w-16 pointer-events-none"
                style={{ background: "linear-gradient(to right, #e8e5dc, transparent)", zIndex: 3 }}
              />
            </div>
          ))
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#d4d0c4",
              backgroundImage: "radial-gradient(circle, rgba(232,150,10,0.08) 0%, transparent 60%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        )}

        {/* Slide indicators — bottom right */}
        {slides.length > 1 && (
          <div className="absolute bottom-10 right-10 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPrevSlide(current); setCurrent(i); }}
                aria-label={`Slide ${i + 1}`}
                style={{
                  height: "1px",
                  width: i === current ? "2.5rem" : "1rem",
                  backgroundColor: i === current ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.30)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  display: "block",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Slide counter — top right */}
        {slides.length > 1 && (
          <div
            className="absolute top-8 right-8 font-mono text-[10px] tracking-widest z-10"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
        )}
      </div>

      {/* ── MOBILE: image behind text as background ── */}
      {slides.length > 0 && (
        <div className="lg:hidden absolute inset-0" aria-hidden="true">
          {slides.map((slide, i) => (
            <div
              key={slide.url}
              className="absolute inset-0 transition-opacity duration-1800"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 z-10" style={{ background: "rgba(232,229,220,0.88)" }} />
        </div>
      )}
    </section>
  );
}
