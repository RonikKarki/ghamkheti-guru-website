"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Variants } from "framer-motion";
import { EASE_OUT_BEZIER as E } from "@/lib/animations";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0.1,
  once = true,
}: StaggerContainerProps) {
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "scale" | "none";
}) {
  const itemVariants: Record<string, Variants> = {
    up:    { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: E } } },
    left:  { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: E } } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: E } } },
    none:  { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } },
  };

  return (
    <motion.div variants={itemVariants[direction]} className={cn(className)}>
      {children}
    </motion.div>
  );
}
