"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  client: string;
  year: string | number;
  href?: string;
  tags?: string[];
  accentColor?: "green" | "gold" | "teal" | "earth";
  className?: string;
  index?: number;
  featured?: boolean;
}

const accentMap = {
  green: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  gold:  { bg: "bg-gold/10",    text: "text-gold",    border: "border-gold/20" },
  teal:  { bg: "bg-teal/10",    text: "text-teal",    border: "border-teal/20" },
  earth: { bg: "bg-earth/10",   text: "text-earth",   border: "border-earth/20" },
};

export function ProjectCard({
  title,
  description,
  category,
  client,
  year,
  href = "#",
  tags = [],
  accentColor = "green",
  className,
  index = 0,
  featured = false,
}: ProjectCardProps) {
  const accent = accentMap[accentColor];

  return (
    <motion.a
      href={href}
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: E }}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-card border border-border",
        "transition-colors duration-300 hover:border-primary/25",
        featured && "md:col-span-2 lg:col-span-2",
        className
      )}
    >
      {/* Visual header */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "h-56 md:h-72" : "h-48"
        )}
      >
        <div className="absolute inset-0 bg-linear-to-br from-brand-deep via-surface to-background" />
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-brand-gold/6 blur-2xl" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", accent.bg, accent.text)}>
            {category}
          </span>
        </div>

        {/* Arrow */}
        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
        </div>

        {/* Large decorative text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[120px] font-display font-black text-primary/5 leading-none select-none">
            {String(year).slice(-2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3 text-xs text-foreground-subtle">
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {client}
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {year}
          </span>
        </div>

        <h3 className={cn(
          "font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors",
          featured ? "text-xl md:text-2xl" : "text-base"
        )}>
          {title}
        </h3>

        <p className="text-sm text-foreground-muted leading-relaxed flex-1 mb-4">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-raised text-foreground-subtle"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className={cn("h-0.5 w-0 group-hover:w-full transition-all duration-500", accent.bg.replace("/10", "/40"))} />
    </motion.a>
  );
}
