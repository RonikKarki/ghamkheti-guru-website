"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";

interface TestimonialCardProps {
  content: string;
  name: string;
  role: string;
  company: string;
  rating?: number;
  image?: string;
  className?: string;
  index?: number;
}

export function TestimonialCard({
  content,
  name,
  role,
  company,
  rating = 5,
  image,
  className,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: E }}
      className={cn(
        "relative flex flex-col rounded-2xl p-7",
        "bg-card border border-border glow-card",
        "hover:border-primary/20 transition-colors duration-300",
        className
      )}
    >
      {/* Quote icon */}
      <Quote className="h-8 w-8 text-primary/20 mb-5 shrink-0" strokeWidth={1.5} />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={cn("h-3.5 w-3.5", i < rating ? "fill-gold text-gold" : "fill-surface-raised text-surface-raised")}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Content */}
      <p className="text-sm text-foreground-muted leading-relaxed flex-1 mb-7">
        &ldquo;{content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {image ? (
          <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover ring-2 ring-border" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-sm shrink-0">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground text-sm">{name}</p>
          <p className="text-xs text-foreground-subtle">
            {role} · {company}
          </p>
        </div>
      </div>

      {/* Glow decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/4 blur-2xl pointer-events-none" />
    </motion.div>
  );
}
