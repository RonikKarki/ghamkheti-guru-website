"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/common/Container";
import { staggerContainer, staggerItem } from "@/lib/animations";

const pillars = [
  { icon: Leaf,  label: "Renewable Energy" },
  { icon: Zap,   label: "Agri-Technology" },
  { icon: Globe, label: "Sustainable Growth" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden noise-overlay">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 h-125 w-125 rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 h-100 w-100 rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-175 w-175 rounded-full bg-brand-mid/3 blur-[150px] pointer-events-none" />

      <Container className="relative z-10 pt-32 pb-24 md:pt-40 md:pb-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          {/* Overline */}
          <motion.div variants={staggerItem}>
            <Badge variant="overline" dot className="mb-7">
              Ghamkheti Guru Company Limited
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={staggerItem}
            className="text-display-2xl font-display text-foreground text-balance mb-7 leading-[1.04]"
          >
            Powering Africa&apos;s{" "}
            <span className="text-gradient">Green Future</span>
            <br className="hidden md:block" />
            Through Innovation
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-2xl mb-10 text-pretty"
          >
            We develop world-class renewable energy infrastructure, precision
            agriculture solutions, and enterprise technology platforms — built
            for Africa&apos;s next century of growth.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-4 mb-16">
            <Button asChild size="xl" variant="gradient">
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="glass">
              <Link href="/services">
                Explore Services
              </Link>
            </Button>
          </motion.div>

          {/* Pillars */}
          <motion.div
            variants={staggerItem}
            className="flex flex-wrap gap-3 mb-16"
          >
            {pillars.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 glass rounded-full px-4 py-2"
              >
                <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                <span className="text-xs font-medium text-foreground-muted">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border"
          >
            {[
              { value: "200+", label: "Projects" },
              { value: "50+",  label: "Enterprise Clients" },
              { value: "15+",  label: "Years" },
              { value: "98%",  label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-display font-bold text-gradient leading-none mb-1">
                  {s.value}
                </p>
                <p className="text-xs text-foreground-subtle">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
