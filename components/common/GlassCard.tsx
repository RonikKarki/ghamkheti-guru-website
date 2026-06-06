"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { hoverLiftGlow } from "@/lib/animations";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  gold?: boolean;
  glow?: boolean;
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
  padding = "default",
  animated = true,
  className,
  ...props
}: GlassCardProps) {
  const base = cn(
    gold ? "glass-gold" : "glass",
    "rounded-2xl",
    glow && "glow-card",
    paddingMap[padding],
    className
  );

  if (!animated) {
    return (
      <div
        className={cn(base, hover && "hover-lift cursor-pointer")}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={base}
      whileHover={hover ? hoverLiftGlow : undefined}
      transition={{ duration: 0.25 }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
