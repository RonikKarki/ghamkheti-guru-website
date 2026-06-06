"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";
import type { LucideIcon } from "lucide-react";

type AccentColor = "green" | "gold" | "teal" | "earth" | "default";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  accent?: AccentColor;
  className?: string;
  index?: number;
}

const accentMap: Record<AccentColor, { icon: string; badge: string; border: string }> = {
  green:   { icon: "bg-primary/15 text-primary",    badge: "bg-primary/10",    border: "hover:border-primary/30" },
  gold:    { icon: "bg-gold/15 text-gold",           badge: "bg-gold/10",       border: "hover:border-gold/30" },
  teal:    { icon: "bg-teal/15 text-teal",           badge: "bg-teal/10",       border: "hover:border-teal/30" },
  earth:   { icon: "bg-earth/15 text-earth",         badge: "bg-earth/10",      border: "hover:border-earth/30" },
  default: { icon: "bg-surface-raised text-foreground-muted", badge: "bg-surface-raised", border: "hover:border-border-strong" },
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  accent = "green",
  className,
  index = 0,
}: FeatureCardProps) {
  const colors = accentMap[accent];

  const inner = (
    <motion.div
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: E }}
      className={cn(
        "group relative flex flex-col gap-5 rounded-2xl p-6 md:p-7",
        "bg-card border border-border glow-card",
        "transition-colors duration-300",
        colors.border,
        className
      )}
    >
      {/* Icon */}
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colors.icon)}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-foreground text-base mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-foreground-muted leading-relaxed">{description}</p>
      </div>

      {/* Arrow link indicator */}
      {href && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Learn more
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Corner gradient accent */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-br-none rounded-tl-none rounded-tr-2xl rounded-bl-full bg-linear-to-bl from-primary/5 to-transparent pointer-events-none" />
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {inner}
      </a>
    );
  }
  return inner;
}
