"use client";

import { motion } from "framer-motion";
import { FileText, Download, Lock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";

interface DocumentCardProps {
  title: string;
  description?: string;
  type: string;
  size?: string;
  year?: string | number;
  restricted?: boolean;
  href?: string;
  className?: string;
  index?: number;
  accent?: "green" | "gold" | "teal";
}

const accentMap = {
  green: { icon: "bg-primary/10 text-primary", badge: "text-primary border-primary/20 bg-primary/5" },
  gold:  { icon: "bg-gold/10 text-gold",       badge: "text-gold border-gold/20 bg-gold/5" },
  teal:  { icon: "bg-teal/10 text-teal",       badge: "text-teal border-teal/20 bg-teal/5" },
};

export function DocumentCard({
  title,
  description,
  type,
  size,
  year,
  restricted = false,
  href = "#",
  className,
  index = 0,
  accent = "green",
}: DocumentCardProps) {
  const colors = accentMap[accent];

  return (
    <motion.div
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: E }}
      className={cn(
        "group relative flex gap-4 rounded-2xl p-5",
        "bg-card border border-border",
        "hover:border-primary/20 transition-colors duration-300",
        className
      )}
    >
      {/* Icon */}
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl mt-0.5", colors.icon)}>
        <FileText className="h-5 w-5" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
            {title}
          </h4>
          {year && (
            <span className="shrink-0 text-[10px] font-bold text-foreground-subtle">{year}</span>
          )}
        </div>

        {description && (
          <p className="text-xs text-foreground-muted leading-relaxed mb-3">{description}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border", colors.badge)}>
              {type}
            </span>
            {size && <span className="text-[10px] text-foreground-subtle">{size}</span>}
          </div>

          {restricted ? (
            <div className="flex items-center gap-1 text-[11px] text-foreground-subtle">
              <Lock className="h-3 w-3" />
              <span>Restricted</span>
            </div>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
            >
              <Download className="h-3 w-3" />
              Download
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
