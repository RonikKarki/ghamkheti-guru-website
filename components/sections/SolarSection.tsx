"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, ArrowRight, CheckCircle } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/common/GlassCard";
import { fadeLeft, fadeRight, viewportOnce, staggerContainer, staggerItem } from "@/lib/animations";

const solarProjects = [
  { name: "Solukhumbu Solar Power Project", capacity: "10 MW", location: "Solukhumbu", status: "PPA Stage" },
];

const advantages = [
  "10 MW solar PV capacity in Solukhumbu",
  "PPA agreement with Nepal Electricity Authority",
  "Clean, renewable energy for the national grid",
  "Contributing to Nepal's renewable energy targets",
];

export function SolarSection() {
  return (
    <Section id="solar">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — visual */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative"
          >
            {/* Solar panel grid visual */}
            <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-brand-deep via-surface to-background border border-border-strong aspect-4/3 flex items-center justify-center">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-gold/8 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/6 blur-2xl" />

              {/* Solar panel SVG grid */}
              <svg viewBox="0 0 400 300" className="w-3/4 opacity-20 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                {[0,1,2,3].map((row) =>
                  [0,1,2,3,4].map((col) => (
                    <rect key={`${row}-${col}`} x={col * 76 + 10} y={row * 66 + 10} width="64" height="54" rx="4" />
                  ))
                )}
              </svg>

              {/* Central sun icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Sun className="h-10 w-10 text-gold" strokeWidth={1.5} />
                </div>
              </div>

              {/* MW callout */}
              <div className="absolute bottom-5 left-5 glass rounded-xl px-4 py-3">
                <p className="text-2xl font-display font-bold text-gradient leading-none">10 MW</p>
                <p className="text-[10px] text-foreground-subtle mt-0.5 uppercase tracking-wider">Solar Energy Pipeline</p>
              </div>
            </div>

            {/* Floating stat card */}
            <GlassCard animated padding="sm" className="absolute -top-4 -right-4 w-40 text-center">
              <p className="text-xl font-display font-bold text-gold leading-none mb-1">PPA Stage</p>
              <p className="text-[10px] text-foreground-subtle">Solukhumbu, Nepal</p>
            </GlassCard>
          </motion.div>

          {/* Right — content */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Badge variant="overline" dot className="mb-5">
              <Sun className="h-3 w-3 mr-1.5 inline text-gold" />
              Solar Energy
            </Badge>

            <h2 className="text-display-lg font-display text-foreground text-balance mb-5">
              Sunlight to{" "}
              <span className="text-gradient-gold">Clean Power</span>,{" "}
              Across Nepal
            </h2>

            <p className="text-foreground-muted leading-relaxed mb-8">
              Our 10 MW solar power project in Solukhumbu, Nepal is at the PPA stage —
              a clean energy investment that will contribute to the district&apos;s
              growing power needs and support Nepal&apos;s national renewable energy goals.
            </p>

            {/* Project mini-table */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="space-y-2 mb-8"
            >
              {solarProjects.map((p, i) => (
                <motion.div key={p.name} variants={staggerItem} className="flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-foreground-subtle">{p.location}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-display font-bold text-gold">{p.capacity}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      p.status === "Operational" ? "bg-primary/10 text-primary" :
                      p.status === "Under Construction" ? "bg-gold/10 text-gold" :
                      "bg-teal/10 text-teal"
                    }`}>{p.status}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Advantages */}
            <ul className="space-y-2 mb-8">
              {advantages.map((a) => (
                <li key={a} className="flex items-center gap-2.5">
                  <CheckCircle className="h-3.5 w-3.5 text-gold shrink-0" strokeWidth={2} />
                  <span className="text-sm text-foreground-muted">{a}</span>
                </li>
              ))}
            </ul>

            <Button asChild variant="gold" size="lg">
              <Link href="/projects#solar">
                View Solar Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
