"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem, EASE_OUT_BEZIER as E } from "@/lib/animations";

const AMBER = "#E0962F";
const DARK  = "#0F0D09";
const CREAM_TEXT = "#ECE6DA";
const MONO  = "var(--font-space-mono), 'Space Mono', monospace";
const BRICO = "var(--font-bricolage), 'Bricolage Grotesque', system-ui, sans-serif";

const SECTORS = [
  { num: "01", word: "Energy",      label: "Hydropower & Solar",    desc: "Clean power for a growing nation" },
  { num: "02", word: "Agriculture", label: "Agro-Industry",         desc: "Farming, processing & food security" },
  { num: "03", word: "Tourism",     label: "Tourism & Hospitality", desc: "Destinations across Nepal" },
];

const DEFAULT_STATS = [
  { value: "4.9 MW", label: "Hydropower" },
  { value: "10 MW",  label: "Solar"      },
  { value: "8 T/Hr", label: "Rice Mill"  },
  { value: "03",     label: "Sectors"    },
];

interface CmsHero {
  title?:        string;
  subtitle?:     string;
  body?:         string;
  primaryCta?:   { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  items?:        { value?: string; label?: string }[];
}
interface HeroImage { url: string; alt?: string; isVisible?: boolean }

export function HomeHero({
  cms,
  heroImages,
}: {
  cms?: CmsHero | null;
  heroImages?: HeroImage[];
}) {
  const [index,   setIndex]   = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const INTERVAL = 5000;

  const visible = (heroImages ?? []).filter((s) => s.url && s.isVisible !== false);

  const slideCount = visible.length || 1;

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
      setAnimKey((k) => k + 1);
    }, INTERVAL);
  }, [slideCount]);

  useEffect(() => {
    restartTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restartTimer]);

  const go = (k: number) => {
    const next = ((k % slideCount) + slideCount) % slideCount;
    setIndex(next);
    setAnimKey((ak) => ak + 1);
    restartTimer();
  };

  const sector       = SECTORS[index % SECTORS.length];
  const heroStats    = cms?.items?.length ? cms.items : DEFAULT_STATS;
  const body         = cms?.body || cms?.subtitle || "From the Himalayan rivers to the Terai plains — developing world-class hydropower, solar installations, and agro-industrial enterprises for a stronger, greener Nepal.";
  const primaryLabel = cms?.primaryCta?.label  || "Explore Projects";
  const primaryHref  = cms?.primaryCta?.href   || "/projects";
  const secondLabel  = cms?.secondaryCta?.label || "Our Story";
  const secondHref   = cms?.secondaryCta?.href  || "/about";

  return (
    <section className="relative flex min-h-screen bg-background overflow-hidden">

      {/* ══════════════════════════════════════════════
          LEFT PANEL — cream editorial (original design)
          ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col w-full lg:w-[52%] shrink-0 pt-28 pb-10 px-8 md:px-12 lg:px-16 overflow-hidden">

        {/* Ghost watermark */}
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
            {cms?.title ? (
              <span className="text-foreground">{cms.title}</span>
            ) : (
              <>
                <span className="text-foreground">Powering Nepal&apos;s</span>
                <br />
                <span className="text-foreground">Future Through </span>
                <span
                  key={`word-${index}-${animKey}`}
                  style={{
                    color: "#e8960a",
                    display: "inline-block",
                    animation: "ghSwap .7s cubic-bezier(.2,.75,.2,1) both",
                  }}
                >
                  {sector.word}
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={staggerItem}
            className="text-[15px] leading-[1.75] mb-10 max-w-136 text-foreground-muted"
          >
            {body}
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

          {/* Geo tag */}
          <motion.div variants={staggerItem} className="mb-10">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] border border-foreground/10 text-foreground-subtle">
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

        {/* Mobile sector selector */}
        <div className="lg:hidden flex items-center gap-3 mt-6 pb-2">
          {SECTORS.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.12em",
                color: i === index ? "#e8960a" : "rgba(0,0,0,0.35)",
                transition: "color 0.3s",
              }}
            >
              <span
                style={{
                  height: 2,
                  width: i === index ? 24 : 8,
                  background: i === index ? "#e8960a" : "rgba(0,0,0,0.2)",
                  borderRadius: 2,
                  transition: "all 0.4s ease",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              {s.num}
            </button>
          ))}
          <span className="ml-auto font-mono text-[10px] text-foreground-subtle">
            {sector.word.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT PANEL — diagonal image slider
          ══════════════════════════════════════════════ */}
      <div
        className="hidden lg:block flex-1 relative overflow-hidden"
      >
        {/* Diagonal left-edge clip — outer div is transparent so cream shows in the cut */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
            overflow: "hidden",
            backgroundColor: DARK,
          }}
        >
          {/* Images — fade transition through all heroImages */}
          {visible.length > 0 ? visible.map((slide, i) => (
            <div
              key={slide.url}
              style={{
                position: "absolute",
                inset: 0,
                transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1)",
                opacity: i === index ? 1 : 0,
                zIndex: i === index ? 2 : 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.url}
                alt={slide.alt ?? ""}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )) : (
            /* No images: amber glow placeholder */
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 60% 50%, rgba(224,150,47,0.12) 0%, transparent 65%), ${DARK}`,
              }}
            />
          )}

          {/* Subtle bottom scrim */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15,13,9,0.5) 0%, transparent 40%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          {/* Slide counter — bottom right */}
          {visible.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 28,
                right: 28,
                zIndex: 6,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.16em",
                color: "rgba(236,230,218,0.5)",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {visible.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      height: 2,
                      width: i === index ? 28 : 10,
                      background: i === index ? AMBER : "rgba(236,230,218,0.3)",
                      border: "none",
                      borderRadius: 2,
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.4s ease",
                    }}
                  />
                ))}
              </div>
              <span>{String(index + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}</span>
            </div>
          )}

        </div>
      </div>

      {/* Mobile background image */}
      <div className="lg:hidden absolute inset-0 z-0" aria-hidden="true">
        {visible[index]?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={visible[index]!.url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, #e8e5dc 0%, rgba(232,229,220,0.92) 60%, #e8e5dc 100%)",
          }}
        />
      </div>
    </section>
  );
}
