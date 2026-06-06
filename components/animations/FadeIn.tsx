"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { viewportOnce, EASE_OUT_BEZIER } from "@/lib/animations";
import type { Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

const directionVariants: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  none:  { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

interface FadeInProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  blur?: boolean;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  blur = false,
}: FadeInProps) {
  const variants = blur
    ? {
        hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
        visible: { opacity: 1, filter: "blur(0px)", y: 0 },
      }
    : directionVariants[direction];

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: EASE_OUT_BEZIER,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/* Convenience wrappers */
export const FadeInUp    = (props: Omit<FadeInProps, "direction">) => <FadeIn direction="up"    {...props} />;
export const FadeInLeft  = (props: Omit<FadeInProps, "direction">) => <FadeIn direction="left"  {...props} />;
export const FadeInRight = (props: Omit<FadeInProps, "direction">) => <FadeIn direction="right" {...props} />;
export const FadeInBlur  = (props: Omit<FadeInProps, "blur">)      => <FadeIn blur={true}       {...props} />;
