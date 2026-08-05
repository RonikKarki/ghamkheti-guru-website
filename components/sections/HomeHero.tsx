"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem, EASE_OUT_BEZIER as E } from "@/lib/animations";

const AMBER = "#E0962F";
const DARK  = "#0F0D09";
const MONO  = "var(--font-space-mono), 'Space Mono', monospace";

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

  const INTERVAL = 6000;

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
  const body         = cms?.body || cms?.subtitle || "Developing world-class hydropower, solar installations, and agro-industrial enterprises — from the Himalayan rivers to the Terai plains.";
  const primaryLabel = cms?.primaryCta?.label  || "Explore Projects";
  const primaryHref  = cms?.primaryCta?.href   || "/projects";
  const secondLabel  = cms?.secondaryCta?.label || "Our Story";
  const secondHref   = cms?.secondaryCta?.href  || "/about";

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden" style={{ backgroundColor: DARK }}>

      {/* ══ Full-bleed photo slideshow ══ */}
      <div className="absolute inset-0" aria-hidden="true">
        {visible.length > 0 ? (
          visible.map((slide, i) => (
            <div
              key={slide.url}
              style={{
                position: "absolute",
                inset: 0,
                transition: "opacity 1.4s cubic-bezier(0.4,0,0.2,1)",
                opacity: i === index ? 1 : 0,
                zIndex: i === index ? 2 : 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.url}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))
        ) : (
          /* No images yet: dark brand backdrop with amber glow */
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 70% 40%, rgba(224,150,47,0.14) 0%, transparent 60%), ${DARK}`,
            }}
          />
        )}

        {/* Readability scrim — darker on the left where the text sits */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            background: "linear-gradient(78deg, rgba(10,9,6,0.85) 0%, rgba(10,9,6,0.58) 34%, rgba(10,9,6,0.18) 62%, rgba(10,9,6,0.30) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            background: "linear-gradient(to top, rgba(10,9,6,0.78) 0%, transparent 34%)",
          }}
        />

        {/* Faint brand emblem behind the headline */}
        <div
          className="pointer-events-none select-none"
          style={{
            position: "absolute",
            zIndex: 4,
            left: "-6%",
            top: "48%",
            transform: "translateY(-50%)",
            width: "clamp(320px, 38vw, 560px)",
            height: "clamp(320px, 38vw, 560px)",
            opacity: 0.06,
          }}
        >
          <Image src="/images/logos/ghamkheti-emblem.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* ══ Content ══ */}
      <div className="relative z-10 w-full px-8 md:px-12 lg:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl pt-32 pb-40 md:pt-36 md:pb-44"
        >
          {/* Overline */}
          <motion.div variants={staggerItem} className="mb-7">
            <div className="flex items-center gap-2.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              <span style={{ display: "inline-block", width: "2rem", height: "1px", backgroundColor: "currentColor" }} />
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase">
                Ghamkheti Guru Company Limited
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={staggerItem}
            className="font-display font-bold text-balance text-white mb-6"
            style={{
              fontSize: "clamp(2.8rem, 5vw + 0.5rem, 5.6rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
            }}
          >
            {cms?.title ? (
              cms.title
            ) : (
              <>
                Powering Nepal&apos;s
                <br />
                Future Through{" "}
                <span
                  key={`word-${index}-${animKey}`}
                  style={{
                    color: AMBER,
                    display: "inline-block",
                    animation: "ghSwap .7s cubic-bezier(.2,.75,.2,1) both",
                  }}
                >
                  {sector.word}
                </span>
              </>
            )}
          </motion.h1>

          {/* Short supporting line */}
          <motion.p
            variants={staggerItem}
            className="text-base md:text-lg leading-relaxed max-w-xl mb-10"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {body}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-5">
            <Link
              href={primaryHref}
              className="group inline-flex h-12 items-center gap-2.5 bg-white px-7 text-sm font-semibold text-[#0F0D09] transition-colors duration-200 hover:bg-white/90"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={secondHref}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {secondLabel} →
            </Link>
          </motion.div>

          {/* Slim stats strip */}
          <motion.div
            variants={staggerItem}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t pt-7"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            {heroStats.map((s, i) => (
              <motion.div
                key={s.label ?? i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.07, duration: 0.5, ease: E }}
                className="flex items-baseline gap-2"
              >
                <span className="font-mono text-xl md:text-2xl font-bold leading-none" style={{ color: AMBER }}>
                  {s.value}
                </span>
                <span className="text-[10px] tracking-[0.14em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ══ Bottom bar — photo caption + slide controls ══ */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 md:px-12 lg:px-16">
        <div
          className="flex items-center justify-between gap-6 border-t py-5"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          {/* Caption — what the current photo shows */}
          <div className="min-w-0">
            {visible[index]?.alt ? (
              <div key={`caption-${index}-${animKey}`} style={{ animation: "ghCaptionIn .6s cubic-bezier(.2,.75,.2,1) both" }}>
                <p className="mb-1 text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: "rgba(255,255,255,0.45)" }}>
                  {sector.label}
                </p>
                <p className="truncate text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {visible[index]!.alt}
                </p>
              </div>
            ) : (
              <p className="text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}>
                Energy · Agriculture · Tourism
              </p>
            )}
          </div>

          {/* Slide dots + counter */}
          {visible.length > 1 && (
            <div
              className="flex shrink-0 items-center gap-3"
              style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)" }}
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
                      background: i === index ? AMBER : "rgba(255,255,255,0.3)",
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
    </section>
  );
}
