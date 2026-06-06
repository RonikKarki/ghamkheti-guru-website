"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";
import { FadeIn, FadeInLeft, FadeInRight } from "@/components/animations/FadeIn";

const highlights = [
  "ISO 9001:2015 certified quality management",
  "Agile & DevOps delivery methodology",
  "Dedicated account management for every client",
  "Pan-African presence with global reach",
  "Open-source contributions and R&D investment",
];

export function AboutSection() {
  return (
    <Section id="about">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual side */}
          <FadeInLeft>
            <div className="relative">
              {/* Main visual */}
              <div className="relative rounded-3xl overflow-hidden aspect-4/3 bg-linear-to-br from-brand-deep via-surface to-background border border-border-strong flex items-center justify-center">
                {/* Ambient orbs */}
                <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-brand-gold/8 blur-2xl" />

                <div className="relative text-center p-12 z-10">
                  <p className="text-overline text-foreground-subtle mb-3">Est. 2008</p>
                  <span className="block text-8xl md:text-9xl font-display font-black text-gradient opacity-30 select-none leading-none">GG</span>
                  <span className="block text-8xl md:text-9xl font-display font-black text-gradient absolute inset-x-0 select-none leading-none" style={{ top: "50%", transform: "translateY(-50%)" }}>GG</span>
                </div>
              </div>

              {/* Floating stat cards */}
              <GlassCard
                animated
                padding="sm"
                className="absolute -bottom-5 -right-5 w-44 text-center"
              >
                <p className="text-2xl font-display font-bold text-gradient leading-none mb-1">200+</p>
                <p className="text-xs text-foreground-subtle">Projects Delivered</p>
              </GlassCard>

              <GlassCard
                animated
                padding="sm"
                className="absolute -top-5 -left-5 w-40 text-center"
              >
                <p className="text-2xl font-display font-bold text-gradient leading-none mb-1">50+</p>
                <p className="text-xs text-foreground-subtle">Enterprise Clients</p>
              </GlassCard>
            </div>
          </FadeInLeft>

          {/* Content side */}
          <FadeInRight>
            <Badge variant="overline" dot className="mb-5">About Us</Badge>

            <h2 className="text-display-lg font-display text-foreground text-balance mb-5">
              A Trusted Partner for{" "}
              <span className="text-gradient">Enterprise Growth</span>
            </h2>

            <p className="text-foreground-muted leading-relaxed mb-4">
              Founded in 2008, Ghamkheti Guru Company Limited has grown into one of
              Africa&apos;s most trusted enterprise technology and consulting firms. We
              combine deep industry expertise with cutting-edge technical capabilities
              to deliver solutions that last.
            </p>
            <p className="text-foreground-muted leading-relaxed mb-8">
              Our multidisciplinary teams work across renewable energy, agriculture,
              finance, healthcare, and government — helping organisations navigate
              complexity and accelerate their digital journey.
            </p>

            <ul className="space-y-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-4.5 w-4.5 shrink-0 text-primary mt-0.5" strokeWidth={2} />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button asChild size="lg" variant="gradient">
              <Link href="/about">
                Our Full Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </FadeInRight>
        </div>
      </Container>
    </Section>
  );
}
