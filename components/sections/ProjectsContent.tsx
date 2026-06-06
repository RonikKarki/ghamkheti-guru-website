"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils";
import { Droplets, Sun, Sprout, Globe, MapPin, CheckCircle, Calendar, Mountain } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CTABanner } from "@/components/common/CTABanner";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/animations";

export type ProjectCategory = "All" | "Hydropower" | "Solar Energy" | "Agriculture" | "Tourism";

export interface PublicProject {
  _id:         string;
  name:        string;
  category:    string; // DB lowercase, mapped to display label
  status:      string; // DB snake_case, mapped to display label
  description: string;
  location: {
    district:  string;
    province?: string;
    river?:    string;
  };
  capacity?: {
    value: number;
    unit:  string;
  };
  highlights: Array<{ label: string; value: string }>;
  order:      number;
}

const CATEGORY_LABEL: Record<string, ProjectCategory> = {
  hydropower:   "Hydropower",
  solar:        "Solar Energy",
  agriculture:  "Agriculture",
  "agri-solar": "Agriculture",
  tourism:      "Tourism",
};

const STATUS_LABEL: Record<string, string> = {
  operational:         "Operational",
  under_construction:  "Under Construction",
  commissioning:       "Commissioning",
  under_development:   "Under Development",
  licensed:            "Licensed",
  on_hold:             "On Hold",
};

const statusConfig: Record<string, string> = {
  "Operational":        "text-primary bg-primary/10",
  "Under Construction": "text-gold bg-gold/10",
  "Under Development":  "text-teal bg-teal/10",
  "Licensed":           "text-earth bg-earth/10",
  "Commissioning":      "text-teal bg-teal/10",
  "On Hold":            "text-foreground-subtle bg-surface-raised",
};

const categoryAccent: Record<string, { icon: string; border: string }> = {
  "Hydropower":   { icon: "text-teal bg-teal/10 border-teal/20",          border: "hover:border-teal/30" },
  "Solar Energy": { icon: "text-gold bg-gold/10 border-gold/20",          border: "hover:border-gold/30" },
  "Agriculture":  { icon: "text-primary bg-primary/10 border-primary/20", border: "hover:border-primary/30" },
  "Tourism":      { icon: "text-earth bg-earth/10 border-earth/20",       border: "hover:border-earth/30" },
};

const categoryIcon: Record<string, LucideIcon> = {
  "Hydropower":   Droplets,
  "Solar Energy": Sun,
  "Agriculture":  Sprout,
  "Tourism":      Mountain,
};

interface Props {
  projects: PublicProject[];
}

export function ProjectsContent({ projects }: Props) {
  const [active, setActive] = useState<ProjectCategory>("All");

  // Build category list from actual projects
  const presentCategories = Array.from(
    new Set(projects.map((p) => CATEGORY_LABEL[p.category] ?? "Tourism"))
  );
  const filterCategories: { label: ProjectCategory; icon: LucideIcon; count: number }[] = [
    { label: "All", icon: Globe, count: projects.length },
    ...(["Hydropower", "Solar Energy", "Agriculture", "Tourism"] as const)
      .filter((c) => presentCategories.includes(c))
      .map((c) => ({
        label: c as ProjectCategory,
        icon: categoryIcon[c],
        count: projects.filter((p) => (CATEGORY_LABEL[p.category] ?? "Tourism") === c).length,
      })),
  ];

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => (CATEGORY_LABEL[p.category] ?? "Tourism") === active);

  return (
    <>
      {/* Category filter */}
      <Section size="sm" variant="alt">
        <Container>
          <div className="flex flex-wrap gap-3 justify-center">
            {filterCategories.map(({ label, icon: Icon, count }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                  active === label
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border border-border text-foreground-muted hover:border-primary/30 hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                {label}
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  active === label ? "bg-white/20" : "bg-surface-raised"
                )}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Projects grid */}
      <Section>
        <Container>
          {filtered.length === 0 ? (
            <p className="text-center py-16 text-foreground-muted text-sm">No projects in this category yet.</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {filtered.map((p) => {
                    const displayCategory = CATEGORY_LABEL[p.category] ?? "Tourism";
                    const displayStatus   = STATUS_LABEL[p.status]    ?? p.status;
                    const Icon            = categoryIcon[displayCategory];
                    const accent          = categoryAccent[displayCategory];
                    const capacityStr     = p.capacity
                      ? `${p.capacity.value} ${p.capacity.unit}`
                      : "—";

                    return (
                      <motion.div
                        key={p._id}
                        variants={staggerItem}
                        className={cn(
                          "group rounded-2xl bg-card border border-border p-6 transition-colors duration-300",
                          accent.border
                        )}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5", accent.icon)}>
                              <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground leading-snug text-base mb-1">{p.name}</h3>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-subtle">
                                {p.location.river && (
                                  <>
                                    <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{p.location.river}</span>
                                    <span>·</span>
                                  </>
                                )}
                                <span>{p.location.district}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-display font-bold text-gradient leading-none">{capacityStr}</p>
                            <p className="text-[10px] text-foreground-subtle mt-0.5">{displayCategory}</p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-semibold", statusConfig[displayStatus] ?? "text-foreground-subtle bg-surface-raised")}>
                            {displayStatus}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-foreground-muted leading-relaxed mb-4">{p.description}</p>

                        {/* Highlights */}
                        {p.highlights.length > 0 && (
                          <ul className="space-y-1.5">
                            {p.highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 shrink-0 text-primary" strokeWidth={2} />
                                <span className="text-xs text-foreground-muted">
                                  {h.label}: <span className="font-medium">{h.value}</span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </Container>
      </Section>

      <CTABanner
        badge="Invest or Partner"
        title="Explore Partnership Opportunities"
        description="Our project pipeline offers structured investment opportunities across hydropower, solar, and agriculture."
        primaryLabel="Investor Relations"
        primaryHref="/investor-relations"
        secondaryLabel="Contact Our Team"
        secondaryHref="/contact"
      />
    </>
  );
}
