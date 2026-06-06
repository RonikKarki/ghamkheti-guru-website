"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/animations/CountUp";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";

interface StatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  decimals?: number;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  index?: number;
}

export function StatCard({
  value,
  suffix = "",
  prefix = "",
  label,
  description,
  decimals = 0,
  className,
  variant = "default",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: E }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-7 text-center",
        variant === "default" && "bg-card border border-border glow-card",
        variant === "glass" && "glass rounded-2xl",
        variant === "gradient" && "bg-linear-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20",
        className
      )}
    >
      {/* Value */}
      <div className="flex items-baseline justify-center gap-1 mb-2">
        {prefix && <span className="text-2xl font-bold text-foreground-muted">{prefix}</span>}
        <CountUp
          to={value}
          decimals={decimals}
          suffix=""
          className="text-display-md font-display text-gradient"
        />
        {suffix && <span className="text-2xl font-bold text-primary">{suffix}</span>}
      </div>

      {/* Label */}
      <p className="font-semibold text-foreground text-sm tracking-wide">{label}</p>

      {description && (
        <p className="text-xs text-foreground-subtle mt-1">{description}</p>
      )}

      {/* Subtle corner decoration */}
      <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-primary/5 blur-xl pointer-events-none" />
    </motion.div>
  );
}
