"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, ArrowRight, Zap, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, EASE_OUT_BEZIER as E } from "@/lib/animations";
import { cn } from "@/lib/utils";

const projects = [
  {
    name: "Sisakhola Hydropower Project",
    capacity: "4.9 MW",
    river: "Sisakhola River",
    district: "Solududhkunda Municipality, Solukhumbu",
    type: "Run-of-River",
    status: "PPA Stage",
    statusColor: "text-teal bg-teal/10",
  },
];

const capabilities = [
  "4.9 MW run-of-river project in Solukhumbu",
  "PPA agreement in progress with NEA",
  "Environmental & Social Impact Assessment",
  "Detailed Project Report (DPR) preparation",
  "Long-term O&M planning",
];

export function HydropowerSection() {
  return (
    <Section variant="alt" id="hydropower">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left — project cards */}
          <div className="lg:col-span-3">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.div variants={staggerItem}>
                <Badge variant="overline" dot className="mb-4">
                  <Droplets className="h-3 w-3 mr-1.5 inline text-teal" />
                  Hydropower Development
                </Badge>
                <h2 className="text-display-lg font-display text-foreground text-balance mb-3">
                  Harnessing Nepal&apos;s{" "}
                  <span className="text-gradient">River Potential</span>
                </h2>
                <p className="text-foreground-muted leading-relaxed mb-8 max-w-xl">
                  Nepal holds the world&apos;s second-largest untapped hydropower potential.
                  We are at the forefront of developing that potential — responsibly,
                  reliably, and at national scale.
                </p>
              </motion.div>

              {/* Sisakhola river photo */}
              <motion.div variants={staggerItem} className="relative rounded-2xl overflow-hidden mb-5 aspect-video">
                <Image
                  src="/images/gallery/sisakhola-river-01.png"
                  alt="Sisakhola River — hydropower project site, Solududhkunda Municipality, Solukhumbu"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5">
                  <p className="text-[11px] font-medium text-white">Sisakhola River · Solududhkunda, Solukhumbu</p>
                </div>
              </motion.div>

              <div className="space-y-3">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.name}
                    variants={staggerItem}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-card border border-border p-5 hover:border-teal/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Droplets className="h-4.5 w-4.5 text-teal" strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold", p.statusColor)}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-xs text-foreground-subtle">{p.river} · {p.district} · {p.type}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-display font-bold text-gradient leading-none">{p.capacity}</p>
                      <p className="text-[10px] text-foreground-subtle mt-0.5">Capacity</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — capabilities */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: E }}
            className="lg:col-span-2 lg:sticky lg:top-28"
          >
            {/* Total capacity callout */}
            <div className="rounded-3xl overflow-hidden border border-teal/20 mb-6">
              <div className="bg-linear-to-br from-brand-deep via-surface to-background p-7 text-center relative">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-teal/8 blur-3xl" />
                <Zap className="h-8 w-8 text-teal mx-auto mb-3 opacity-80" strokeWidth={1.5} />
                <p className="text-display-xl font-display font-bold text-gradient leading-none mb-2">
                  4.9 MW
                </p>
                <p className="text-xs text-foreground-subtle uppercase tracking-wider">Hydropower Pipeline</p>
                <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3 text-center">
                  {[["PPA", "Stage"],["Solukhumbu", "District"]].map(([v, l]) => (
                    <div key={l}>
                      <p className="text-2xl font-display font-bold text-teal leading-none">{v}</p>
                      <p className="text-[10px] text-foreground-subtle mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="glass rounded-2xl p-6">
              <h4 className="font-semibold text-foreground text-sm mb-4">Full-cycle Capabilities</h4>
              <ul className="space-y-2.5">
                {capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-teal" strokeWidth={2} />
                    <span className="text-xs text-foreground-muted">{c}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline-brand" size="sm" className="w-full mt-6">
                <Link href="/projects#hydropower">
                  All Hydropower Projects
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
