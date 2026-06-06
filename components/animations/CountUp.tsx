"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_BEZIER as E } from "@/lib/animations";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  separator?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  separator = ",",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;
    const controls = animate(motionValue, to, { duration, ease: E });
    return () => controls.stop();
  }, [isInView, motionValue, to, duration]);

  useEffect(() => {
    return springValue.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${formatNumber(v, decimals, separator)}${suffix}`;
      }
    });
  }, [springValue, decimals, separator, prefix, suffix]);

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}{formatNumber(from, decimals, separator)}{suffix}
    </span>
  );
}

function formatNumber(n: number, decimals: number, separator: string): string {
  const fixed = n.toFixed(decimals);
  if (!separator) return fixed;
  const [int, dec] = fixed.split(".");
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return dec !== undefined ? `${intFormatted}.${dec}` : intFormatted;
}
