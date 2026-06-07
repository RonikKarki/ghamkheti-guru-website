"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/animations";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  titleGradient?: boolean;
  description?: string;
  centered?: boolean;
  eyebrow?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  size?: "sm" | "default" | "lg";
}

const titleSizes = {
  sm:      "text-2xl md:text-3xl lg:text-4xl",
  default: "text-display-lg",
  lg:      "text-display-xl",
};

export function SectionHeader({
  badge,
  title,
  titleGradient = false,
  description,
  centered = true,
  eyebrow,
  className,
  titleClassName,
  descriptionClassName,
  size = "default",
}: SectionHeaderProps) {
  const words = title.split(" ");
  const regularWords = titleGradient ? words.slice(0, -2).join(" ") : title;
  const gradientWords = titleGradient ? words.slice(-2).join(" ") : null;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className={cn(
        "mb-12 md:mb-16",
        centered ? "text-center" : "text-left",
        className
      )}
    >
      {/* Overline badge */}
      {(badge || eyebrow) && (
        <div className={cn("mb-5", centered && "flex justify-center")}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
              {badge || eyebrow}
            </span>
          </div>
        </div>
      )}

      <h2
        className={cn(
          "font-display text-foreground text-balance tracking-tight",
          titleSizes[size],
          titleClassName
        )}
      >
        {titleGradient ? (
          <>
            {regularWords && <span>{regularWords} </span>}
            <span className="text-gradient">{gradientWords}</span>
          </>
        ) : (
          title
        )}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-5 text-foreground-muted leading-relaxed text-pretty",
            size === "sm" ? "text-base" : "text-base md:text-lg",
            centered ? "max-w-2xl mx-auto" : "max-w-2xl",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
