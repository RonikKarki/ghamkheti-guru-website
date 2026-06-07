"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  gold?: boolean;
  glow?: boolean;
  gradientBorder?: boolean;
  padding?: "none" | "sm" | "default" | "lg";
  animated?: boolean;
}

const paddingMap = {
  none:    "",
  sm:      "p-4",
  default: "p-6",
  lg:      "p-8 md:p-10",
};

export function GlassCard({
  children,
  hover = true,
  gold = false,
  glow = false,
  gradientBorder = false,
  padding = "default",
  animated = true,
  className,
  ...props
}: GlassCardProps) {
  const base = cn(
    "rounded-2xl transition-all duration-300",
    gold
      ? "glass-gold"
      : gradientBorder
        ? "bg-surface border border-transparent"
        : "bg-surface border border-border",
    glow && "glow-card",
    hover && "hover:border-primary/20 hover:shadow-[0_0_28px_rgba(0,212,106,0.10)]",
    gradientBorder && "border-gradient",
    paddingMap[padding],
    className
  );

  if (!animated) {
    return (
      <div className={cn(base, hover && "hover:-translate-y-1 cursor-pointer")} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={base}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
