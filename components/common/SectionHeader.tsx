"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  titleGradient?: boolean;     /* applies gradient text to last word */
  description?: string;
  centered?: boolean;
  eyebrow?: string;            /* tiny uppercase label above badge */
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
  /* Split title: if titleGradient, apply gradient to last "word group" */
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
      {eyebrow && (
        <p className="text-overline text-foreground-subtle mb-3">{eyebrow}</p>
      )}

      {badge && (
        <div className={cn("mb-4", centered ? "flex justify-center" : "")}>
          <Badge variant="overline" dot>
            {badge}
          </Badge>
        </div>
      )}

      <h2
        className={cn(
          "font-display text-foreground text-balance",
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
