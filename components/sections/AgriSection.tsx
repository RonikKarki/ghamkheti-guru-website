"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sprout, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, EASE_OUT_BEZIER as E } from "@/lib/animations";

const riceBrands = [
  {
    name: "Namche Gold",
    description: "Finest Long Grain Rice — Premium Quality",
    image: "/images/gallery/namche-gold-packaging.png",
  },
  {
    name: "Manaslu",
    description: "Premium Rice Brand by Shree Suryodaya",
    image: null,
  },
];

export function AgriSection() {
  return (
    <Section variant="surface" id="agriculture">
      <Container>
        {/* Two-column layout: photo left, content right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12">
          {/* Left — mill photos */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-3"
          >
            <motion.div variants={staggerItem} className="relative rounded-2xl overflow-hidden aspect-video">
              <Image
                src="/images/gallery/rice-mill-exterior-trucks.png"
                alt="Shree Suryodaya Khadya Udhyog Limited rice mill facility, Gaindakot, Nawalpur"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5">
                <p className="text-[11px] font-medium text-white">Rice Mill Facility · Gaindakot, Nawalpur</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div variants={staggerItem} className="relative rounded-xl overflow-hidden aspect-video">
                <Image
                  src="/images/gallery/rice-mill-satake-tower.png"
                  alt="Japanese Satake milling technology tower at Shree Suryodaya"
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <p className="text-[10px] font-medium text-white">Satake Technology</p>
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="relative rounded-xl overflow-hidden aspect-video bg-card border border-border flex items-center justify-center p-4">
                <Image
                  src="/images/logos/suryodaya-logo.png"
                  alt="Shree Suryodaya Khadya Udhyog Limited logo"
                  fill
                  className="object-contain p-3"
                  sizes="25vw"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: E }}
          >
            <Badge variant="overline" dot className="mb-5">
              <Sprout className="h-3 w-3 mr-1.5 inline text-primary" />
              Agriculture &amp; Agro-Industrial
            </Badge>
            <h2 className="text-display-lg font-display text-foreground text-balance mb-4">
              From Field to{" "}
              <span className="text-gradient">Market</span>,{" "}
              at Scale
            </h2>
            <p className="text-foreground-muted leading-relaxed mb-6">
              Our wholly-owned subsidiary, Shree Suryodaya Khadya Udhyog Limited, operates
              a modern rice milling facility in Gaindakot, Nawalpur — equipped with advanced
              Japanese Satake technology at 8 tons per hour capacity.
            </p>

            {/* Key facts */}
            <div className="space-y-3 mb-8">
              {[
                { label: "Capacity",    value: "8 Tons / Hour" },
                { label: "Technology",  value: "Japanese Satake Milling" },
                { label: "Location",    value: "Gaindakot, Nawalpur, Nepal" },
                { label: "Established", value: "2077 BS" },
                { label: "Ownership",   value: "100% Ghamkheti Guru Co. Ltd." },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                  <span className="text-sm text-foreground-subtle">{label}</span>
                  <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Rice brands */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3">Rice Brands</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
                  <Image
                    src="/images/gallery/namche-gold-packaging.png"
                    alt="Namche Gold rice"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Namche Gold</p>
                    <p className="text-[10px] text-foreground-subtle">Finest Long Grain Rice</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sprout className="h-4 w-4 text-primary" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Manaslu</p>
                    <p className="text-[10px] text-foreground-subtle">Premium Rice Brand</p>
                  </div>
                </div>
              </div>
            </div>

            <Button asChild variant="gradient" size="lg">
              <Link href="/projects#agriculture">
                View Agriculture Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: E }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl bg-linear-to-r from-brand-deep/60 via-brand-mid/20 to-transparent border border-primary/15 p-6"
        >
          <div>
            <p className="font-semibold text-foreground mb-1">100% Owned by Ghamkheti Guru Co. Ltd.</p>
            <p className="text-sm text-foreground-muted">
              Shree Suryodaya Khadya Udhyog Limited supports the agricultural economy of Nawalpur with
              reliable, high-throughput milling and two premium rice brands — Namche Gold and Manaslu.
            </p>
          </div>
          <Button asChild variant="outline-brand" size="lg" className="shrink-0">
            <Link href="/projects#agriculture">
              Agriculture Portfolio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
