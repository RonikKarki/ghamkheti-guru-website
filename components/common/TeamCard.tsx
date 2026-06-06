"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { hoverLiftGlow, EASE_OUT_BEZIER as E } from "@/lib/animations";

interface TeamCardProps {
  name: string;
  role: string;
  department?: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  className?: string;
  index?: number;
  size?: "default" | "lg";
}

export function TeamCard({
  name,
  role,
  department,
  bio,
  image,
  linkedin,
  className,
  index = 0,
  size = "default",
}: TeamCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      whileHover={hoverLiftGlow}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: E }}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-card border border-border glow-card",
        "hover:border-primary/20 transition-colors duration-300",
        className
      )}
    >
      {/* Avatar area */}
      <div className={cn(
        "relative overflow-hidden flex items-center justify-center",
        size === "lg" ? "h-56" : "h-44",
        "bg-linear-to-br from-brand-deep via-surface to-background"
      )}>
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-brand-gold/6 blur-2xl" />

        {image ? (
          <img
            src={image}
            alt={name}
            className={cn(
              "relative z-10 object-cover rounded-full ring-4 ring-border",
              size === "lg" ? "h-32 w-32" : "h-24 w-24"
            )}
          />
        ) : (
          <div className={cn(
            "relative z-10 rounded-full bg-primary/15 text-primary font-bold font-display flex items-center justify-center ring-4 ring-border/50",
            size === "lg" ? "h-32 w-32 text-4xl" : "h-24 w-24 text-2xl"
          )}>
            {initials}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("flex flex-col flex-1", size === "lg" ? "p-7" : "p-5")}>
        {department && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1.5">
            {department}
          </span>
        )}

        <h3 className={cn(
          "font-semibold text-foreground leading-tight",
          size === "lg" ? "text-xl mb-1" : "text-base mb-0.5"
        )}>
          {name}
        </h3>

        <p className={cn(
          "text-foreground-muted",
          size === "lg" ? "text-sm mb-4" : "text-xs mb-3"
        )}>
          {role}
        </p>

        {bio && (
          <p className="text-xs text-foreground-subtle leading-relaxed flex-1 mb-4">
            {bio}
          </p>
        )}

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        )}
      </div>
    </motion.div>
  );
}
