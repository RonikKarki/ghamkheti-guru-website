"use client";

import { motion } from "framer-motion";
import { Leaf, Globe2, Users, Shield, TrendingUp, Wind } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from "@/lib/animations";

interface CmsGoal { title?: string; description?: string }

interface CmsSustainability {
  title?: string;
  body?:  string;
  items?: CmsGoal[];
}

const GOAL_ICONS = [Leaf, Globe2, Users, Shield, TrendingUp, Wind];

const GOAL_COLORS = [
  "text-primary bg-primary/10 border-primary/20",
  "text-teal bg-teal/10 border-teal/20",
  "text-gold bg-gold/10 border-gold/20",
  "text-earth bg-earth/10 border-earth/20",
  "text-primary bg-primary/10 border-primary/20",
  "text-teal bg-teal/10 border-teal/20",
];

const DEFAULT_GOALS = [
  { title: "Net-Zero by 2045",           description: "All our operations across hydropower, solar, and agriculture will achieve carbon neutrality ahead of the national target." },
  { title: "100% Renewable Generation",  description: "Every facility we operate runs on renewable energy — powering our mills, offices, and construction sites with clean electricity." },
  { title: "Community First Development",description: "We employ locally, procure locally, and invest 3% of project revenues into community development funds." },
  { title: "Biodiversity Protection",    description: "Mandatory Biodiversity Management Plans for all hydropower projects — protecting Nepal's extraordinary natural heritage." },
  { title: "SDG Alignment",             description: "Our projects directly contribute to SDG 7 (Affordable Clean Energy), SDG 2 (Zero Hunger), and SDG 8 (Decent Work)." },
];

export function SustainabilitySection({ cms }: { cms?: CmsSustainability | null }) {
  const sectionTitle = cms?.title || "Prosperity That Endures";
  const description  = cms?.body  || "Our growth is inseparable from Nepal's ecological and social health. Every megawatt we generate and every tonne of rice we mill is measured against our environmental and community commitments.";
  const goals        = cms?.items?.length ? cms.items : DEFAULT_GOALS;

  return (
    <Section id="sustainability">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge variant="overline" dot className="mb-4">Sustainability &amp; Vision</Badge>
          <h2 className="text-display-lg font-display text-foreground text-balance mb-4">
            {sectionTitle.includes("Endures") ? (
              <>
                Prosperity That{" "}
                <span className="text-gradient">Endures</span>
              </>
            ) : (
              <span>{sectionTitle}</span>
            )}
          </h2>
          <p className="text-foreground-muted leading-relaxed text-lg">{description}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {goals.slice(0, 6).map((g, i) => {
            const Icon  = GOAL_ICONS[i] ?? Leaf;
            const color = GOAL_COLORS[i] ?? GOAL_COLORS[0];
            return (
              <motion.div
                key={g.title ?? i}
                variants={staggerItem}
                className="flex gap-4 rounded-2xl bg-card border border-border p-5 hover:border-primary/20 transition-colors"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${color}`}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
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
    </Section>
  );
}
