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
  variant = "default",
}: CTABannerProps) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-3xl border border-primary/20"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-brand-deep via-brand-mid to-brand-deep" />
          <div className="absolute inset-0 bg-mesh opacity-30" />

          {/* Decorative orbs */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-black/20 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-48 w-48 -translate-y-1/2 rounded-full bg-brand-gold/8 blur-2xl" />

          <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 text-center">
            {badge && (
              <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-[0.65rem] font-semibold tracking-[0.14em] uppercase bg-white/15 text-white/90 border border-white/15">
                {badge}
              </span>
            )}

            <h2 className="text-display-lg font-display text-white text-balance max-w-3xl mx-auto mb-5">
              {title}
            </h2>

            {description && (
              <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="xl"
                className="bg-white text-brand-deep font-semibold hover:bg-white/95 shadow-xl shadow-black/20"
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
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10"
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
