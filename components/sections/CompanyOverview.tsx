"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Sun, Sprout, ArrowRight, Award, Globe2, TrendingUp } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp, fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";

const pillars = [
  {
    icon: Droplets, label: "Hydropower", color: "text-teal", bg: "bg-teal/10 border-teal/20",
    detail: "Run-of-river & storage hydroelectric projects across Nepal's major river systems.",
  },
  {
    icon: Sun, label: "Solar Energy", color: "text-gold", bg: "bg-gold/10 border-gold/20",
    detail: "Ground-mounted and rooftop solar PV installations powering communities and industry.",
  },
  {
    icon: Sprout, label: "Agriculture", color: "text-primary", bg: "bg-primary/10 border-primary/20",
    detail: "Modern rice milling with Japanese Satake technology through our subsidiary in Gaindakot, Nawalpur.",
  },
];

const credentials = [
  { icon: Award,      text: "Quality-Focused Operations" },
  { icon: Globe2,     text: "Projects in Solukhumbu & Nawalpur" },
  { icon: TrendingUp, text: "Energy, Agriculture & Tourism Sectors" },
];

interface CmsAbout {
  title?:    string;
  body?:     string;
  subtitle?: string;
}

const DEFAULT_P1 = "Ghamkheti Guru Company Limited is an integrated development company operating across Energy, Agriculture, and Tourism in Nepal. Our energy portfolio includes the Sisakhola Hydropower Project (4.9 MW) and a 10 MW Solar Power Project — both in Solukhumbu and at the PPA stage — reflecting our commitment to Nepal's clean energy future.";
const DEFAULT_P2 = "In agriculture, our wholly-owned subsidiary Shree Suryodaya Khadya Udhyog Limited operates a modern rice mill in Gaindakot, Nawalpur — equipped with Japanese Satake technology at 8 tons per hour and producing Namche Gold, a premium long grain rice brand. We are building a portfolio that advances Nepal's energy security, food sovereignty, and sustainable development.";

export function CompanyOverview({ cms }: { cms?: CmsAbout | null }) {
  const sectionTitle = cms?.title    || null;
  const paragraph1   = cms?.body     || DEFAULT_P1;
  const paragraph2   = cms?.subtitle || DEFAULT_P2;

  return (
    <Section id="about-overview">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text content */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Badge variant="overline" dot className="mb-5">Who We Are</Badge>

            <h2 className="text-display-lg font-display text-foreground text-balance mb-5">
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
            <p className="text-foreground-muted leading-relaxed mb-8">{paragraph2}</p>

            <ul className="space-y-3 mb-10">
              {credentials.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm text-foreground">{text}</span>
                </li>
              ))}
            </ul>

            <Button asChild size="lg" variant="gradient">
              <Link href="/about">
                Our Full Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right — pillars */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-4"
          >
            {pillars.map(({ icon: Icon, label, color, bg, detail }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl p-5 border glass transition-all duration-300 hover:border-primary/30"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{label}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-linear-to-br from-brand-deep via-brand-mid/30 to-brand-deep border border-primary/15 p-5">
              <p className="text-sm text-foreground-muted italic leading-relaxed">
                &ldquo;Our mandate is not just commercial success — it is to be a cornerstone
                of Nepal&apos;s sustainable development for the next hundred years.&rdquo;
              </p>
              <p className="text-xs font-semibold text-primary mt-3">— Chairman, Ghamkheti Guru Co. Ltd.</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
