"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/common/Container";
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
          className="relative overflow-hidden"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          {/* Amber radial spotlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 70% at 50% -5%, rgba(232,150,10,0.18) 0%, transparent 65%)",
            }}
          />

          {/* Subtle dot grid texture */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Top amber accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent, rgba(232,150,10,0.5), transparent)" }}
          />

          <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 text-center">
            {badge && (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6"
                style={{ border: "1px solid rgba(232,150,10,0.30)", backgroundColor: "rgba(232,150,10,0.08)" }}
              >
                <span className="h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: "#e8960a" }} />
                <span
                  className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "#e8960a" }}
                >
                  {badge}
                </span>
              </div>
            )}

            <h2
              className="font-display font-bold text-white text-balance max-w-3xl mx-auto mb-5 tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              {title}
            </h2>

            {description && (
              <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "#e8960a", color: "#0a0a0a" }}
              >
                <Mail className="h-4 w-4" />
                {primaryLabel}
              </Link>

              {secondaryLabel && secondaryHref && (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.80)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.40)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
                >
                  {secondaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
