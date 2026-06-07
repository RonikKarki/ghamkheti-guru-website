"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { fadeUp, viewportOnce } from "@/lib/animations";

interface CTABannerProps {
  badge?: string;
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "default" | "minimal" | "dark";
}

export function CTABanner({
  badge = "Ready to Start?",
  title,
  description,
  primaryLabel = "Contact Us",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: CTABannerProps) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #001a0d 0%, #003820 35%, #00521e 60%, #002d14 100%)",
          }}
        >
          {/* Radial green spotlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% -10%, rgba(0,212,106,0.30) 0%, transparent 65%)",
            }}
          />

          {/* Secondary glow — bottom right */}
          <div
            className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(0,200,176,0.12)" }}
          />

          {/* Dot grid texture */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Border glow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(0,212,106,0.18)" }}
          />

          <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 text-center">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-display-lg font-display text-white text-balance max-w-3xl mx-auto mb-5 tracking-tight">
              {title}
            </h2>

            {description && (
              <p className="text-white/65 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="xl"
                className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-[0_0_28px_rgba(0,212,106,0.35)]"
              >
                <Link href={primaryHref}>
                  <Mail className="h-4 w-4" />
                  {primaryLabel}
                </Link>
              </Button>

              {secondaryLabel && secondaryHref && (
                <Button
                  asChild
                  size="xl"
                  className="bg-transparent border border-white/20 text-white hover:bg-white/8 hover:border-white/35"
                >
                  <Link href={secondaryHref}>
                    {secondaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
