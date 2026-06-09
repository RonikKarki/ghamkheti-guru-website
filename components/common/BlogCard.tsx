"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  href?: string;
  image?: string | null;
  className?: string;
  index?: number;
  featured?: boolean;
}

const categoryColors: Record<string, string> = {
  "Renewable Energy": "text-gold bg-gold/10",
  "Agriculture":      "text-primary bg-primary/10",
  "Technology":       "text-teal bg-teal/10",
  "Business":         "text-earth bg-earth/10",
  "Infrastructure":   "text-foreground-muted bg-surface-raised",
};

export function BlogCard({
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  href = "#",
  className,
  index = 0,
  featured = false,
}: BlogCardProps) {
  const catClass = categoryColors[category] ?? "text-primary bg-primary/10";

  return (
    <motion.div
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: E }}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-card border border-border",
        "hover:border-primary/25 transition-colors duration-300",
        featured && "md:flex-row",
        className
      )}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative overflow-hidden shrink-0",
        featured ? "md:w-2/5 h-56 md:h-auto" : "h-48"
      )}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-linear-to-br from-brand-deep via-surface to-background" />
            <div className="absolute top-0 right-0 h-36 w-36 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-brand-gold/6 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 100 100" className="h-24 w-24 text-primary fill-current">
                <path d="M10 20h80M10 40h60M10 60h70M10 80h50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              </svg>
            </div>
          </>
        )}
        {image && <div className="absolute inset-0 bg-black/30" />}
        <span className={cn(
          "absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
          catClass
        )}>
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3 text-[11px] text-foreground-subtle">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime}
          </span>
        </div>

        <Link href={href} className="block flex-1">
          <h3 className={cn(
            "font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors",
            featured ? "text-xl md:text-2xl mb-3" : "text-base"
          )}>
            {title}
          </h3>
          <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </Link>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold">
              {author.charAt(0)}
            </div>
            <span className="text-xs text-foreground-muted">{author}</span>
          </div>
          <Link
            href={href}
            className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Read more
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
