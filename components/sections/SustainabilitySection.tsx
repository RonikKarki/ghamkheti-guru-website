"use client";

import { motion } from "framer-motion";
import { Leaf, Globe2, Users, Shield, TrendingUp, Wind } from "lucide-react";
import { Container } from "@/components/common/Container";
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from "@/lib/animations";

interface CmsGoal { title?: string; description?: string }

interface CmsSustainability {
  title?: string;
  body?:  string;
  items?: CmsGoal[];
}

const GOAL_ICONS = [Leaf, Globe2, Users, Shield, TrendingUp, Wind];

const DEFAULT_GOALS = [
  { title: "Net-Zero by 2045",            description: "All our operations across hydropower, solar, and agriculture will achieve carbon neutrality ahead of the national target." },
  { title: "100% Renewable Generation",   description: "Every facility we operate runs on renewable energy — powering our mills, offices, and construction sites with clean electricity." },
  { title: "Community First Development", description: "We employ locally, procure locally, and invest 3% of project revenues into community development funds." },
  { title: "Biodiversity Protection",     description: "Mandatory Biodiversity Management Plans for all hydropower projects — protecting Nepal's extraordinary natural heritage." },
  { title: "SDG Alignment",              description: "Our projects directly contribute to SDG 7 (Affordable Clean Energy), SDG 2 (Zero Hunger), and SDG 8 (Decent Work)." },
];

export function SustainabilitySection({ cms }: { cms?: CmsSustainability | null }) {
  const sectionTitle = cms?.title || "Prosperity That Endures";
  const description  = cms?.body  || "Our growth is inseparable from Nepal's ecological and social health. Every megawatt we generate and every tonne of rice we mill is measured against our environmental and community commitments.";
  const goals        = cms?.items?.length ? cms.items : DEFAULT_GOALS;

  return (
    <section className="py-24 md:py-32 bg-surface border-t border-border">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14"
        >
          <div className="section-num">05 / Sustainability &amp; Vision</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <h2 className="text-display-lg font-display text-foreground text-balance tracking-tight">
              {sectionTitle}
            </h2>
            <p className="text-foreground-muted leading-relaxed text-[15px] lg:pt-2">{description}</p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
        >
          {goals.slice(0, 6).map((g, i) => {
            const Icon = GOAL_ICONS[i] ?? Leaf;
            return (
              <motion.div
                key={g.title ?? i}
                variants={staggerItem}
                className="flex gap-4 bg-surface p-6 hover:bg-surface-raised transition-colors duration-300"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/20 mt-0.5">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1.5">{g.title}</h4>
                  <p className="text-xs text-foreground-muted leading-relaxed">{g.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
