"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  href?: string;
  image?: string;
  className?: string;
  index?: number;
  featured?: boolean;
}

const catColors: Record<string, { bg: string; text: string }> = {
  "Hydropower":    { bg: "bg-teal/10",    text: "text-teal" },
  "Solar Energy":  { bg: "bg-gold/10",    text: "text-gold" },
  "Agriculture":   { bg: "bg-primary/10", text: "text-primary" },
  "Corporate":     { bg: "bg-earth/10",   text: "text-earth" },
  "Sustainability":{ bg: "bg-primary/10", text: "text-primary" },
  "Finance":       { bg: "bg-gold/10",    text: "text-gold" },
};

export function NewsCard({
  title,
  excerpt,
  category,
  date,
  href = "#",
  image,
  className,
  index = 0,
  featured = false,
}: NewsCardProps) {
  const cat = catColors[category] ?? { bg: "bg-surface-raised", text: "text-foreground-muted" };

  return (
    <motion.article
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: E }}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-card border border-border",
        "hover:border-primary/25 transition-colors duration-300",
        featured ? "md:flex-row" : "",
        className
      )}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative overflow-hidden shrink-0 bg-linear-to-br from-brand-deep via-surface to-background",
        featured ? "md:w-2/5 h-52 md:h-auto" : "h-44"
      )}>
        {image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
        {!image && (
          <>
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/6 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-brand-gold/5 blur-2xl" />
          </>
        )}

        {/* Category pill */}
        <div className="absolute top-4 left-4">
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider", cat.bg, cat.text)}>
            <Tag className="h-2.5 w-2.5" />
            {category}
          </span>
        </div>

        {/* Decorative lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
            <path d="M0 60 Q50 20 100 60 T200 60" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <path d="M0 80 Q50 40 100 80 T200 80" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            <path d="M0 40 Q50 0 100 40 T200 40" stroke="currentColor" strokeWidth="1" className="text-primary" />
          </svg>
        </div>

        {/* Arrow indicator */}
        <div className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-card/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3 text-[11px] text-foreground-subtle">
          <Calendar className="h-3 w-3" />
          <span>{date}</span>
        </div>

        <Link href={href} className="block flex-1">
          <h3 className={cn(
            "font-semibold text-foreground leading-snug group-hover:text-primary transition-colors mb-2",
            featured ? "text-xl md:text-2xl mb-3" : "text-base"
          )}>
            {title}
          </h3>
          <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </Link>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2 transition-all"
          >
            Read Full Story
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
