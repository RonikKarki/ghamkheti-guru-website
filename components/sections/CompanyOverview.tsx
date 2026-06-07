"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Sun, Sprout, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { fadeUp, fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";

const pillars = [
  {
    icon: Droplets, label: "Hydropower",
    color: "text-teal", bg: "bg-teal/10 border-teal/20",
    detail: "Run-of-river & storage hydroelectric projects across Nepal's major river systems.",
  },
  {
    icon: Sun, label: "Solar Energy",
    color: "text-gold", bg: "bg-gold/10 border-gold/20",
    detail: "Ground-mounted and rooftop solar PV installations powering communities and industry.",
  },
  {
    icon: Sprout, label: "Agriculture",
    color: "text-primary", bg: "bg-primary/10 border-primary/20",
    detail: "Modern rice milling with Japanese Satake technology through our subsidiary in Gaindakot, Nawalpur.",
  },
];

interface CmsAbout {
  title?:    string;
  body?:     string;
  subtitle?: string;
}

const DEFAULT_P1 = "Ghamkheti Guru Company Limited is an integrated development company operating across Energy, Agriculture, and Tourism in Nepal. Our energy portfolio includes the Sisakhola Hydropower Project (4.9 MW) and a 10 MW Solar Power Project — both in Solukhumbu and at the PPA stage.";
const DEFAULT_P2 = "Our wholly-owned subsidiary Shree Suryodaya Khadya Udhyog Limited operates a modern rice mill in Gaindakot, Nawalpur — equipped with Japanese Satake technology at 8 tons per hour, producing Namche Gold and Manaslu rice brands.";

export function CompanyOverview({ cms }: { cms?: CmsAbout | null }) {
  const sectionTitle = cms?.title    || null;
  const paragraph1   = cms?.body     || DEFAULT_P1;
  const paragraph2   = cms?.subtitle || DEFAULT_P2;

  return (
    <Section variant="surface" id="about-overview">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {/* Overline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                Who We Are
              </span>
            </div>

            <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight mb-5">
              {sectionTitle ? (
                <span>{sectionTitle}</span>
              ) : (
                <>
                  An Integrated Force in{" "}
                  <span className="text-gradient">Nepal&apos;s Growth Story</span>
                </>
              )}
            </h2>

            <p className="text-foreground-muted leading-relaxed mb-4">{paragraph1}</p>
            <p className="text-foreground-muted leading-relaxed mb-10">{paragraph2}</p>

            <Button asChild size="lg" variant="gradient">
              <Link href="/about">
                Our Full Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right — sector cards + quote */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-3"
          >
            {pillars.map(({ icon: Icon, label, color, bg, detail }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl p-5 border border-border bg-surface-raised hover:border-primary/20 transition-all duration-300 group"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${bg} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{label}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}

            {/* Chairman quote */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative rounded-2xl overflow-hidden p-5"
              style={{
                background: "linear-gradient(135deg, rgba(0,84,42,0.50) 0%, rgba(0,82,30,0.35) 60%, rgba(0,45,20,0.50) 100%)",
                border: "1px solid rgba(0,212,106,0.15)",
              }}
            >
              {/* Green radial glow inside card */}
              <div
                className="absolute top-0 right-0 h-24 w-24 blur-2xl pointer-events-none"
                style={{ background: "rgba(0,212,106,0.15)" }}
              />
              <p className="text-sm text-foreground/80 italic leading-relaxed relative z-10">
                &ldquo;Our mandate is not just commercial success — it is to be a cornerstone
                of Nepal&apos;s sustainable development for the next hundred years.&rdquo;
              </p>
              <p className="text-xs font-semibold text-primary mt-3 relative z-10">
                — Chairman, Ghamkheti Guru Co. Ltd.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
