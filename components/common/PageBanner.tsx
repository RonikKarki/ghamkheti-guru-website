"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/ui/badge";
import { fadeUp, staggerContainer, staggerItem, viewportEager } from "@/lib/animations";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  badge?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;         /* optional action buttons */
  className?: string;
  size?: "default" | "lg";
  variant?: "default" | "centered";
}

export function PageBanner({
  badge,
  title,
  description,
  breadcrumbs,
  children,
  className,
  size = "default",
  variant = "default",
}: PageBannerProps) {
  const isCentered = variant === "centered";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-hero-gradient noise-overlay",
        "border-b border-border",
        size === "lg" ? "pt-36 pb-20 md:pt-48 md:pb-28" : "pt-28 pb-14 md:pt-36 md:pb-20",
        className
      )}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />

      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={cn(isCentered ? "text-center max-w-3xl mx-auto" : "max-w-3xl")}
        >
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              variants={staggerItem}
              className={cn(
                "flex items-center gap-1.5 text-xs text-foreground-subtle mb-5",
                isCentered && "justify-center"
              )}
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3 w-3 opacity-40" />}
                  {crumb.href && i < breadcrumbs.length - 1 ? (
                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={i === breadcrumbs.length - 1 ? "text-foreground-muted" : ""}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </motion.nav>
          )}

          {/* Badge */}
          {badge && (
            <motion.div
              variants={staggerItem}
              className={cn("mb-4", isCentered && "flex justify-center")}
            >
              <Badge variant="overline" dot>{badge}</Badge>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={staggerItem}
            className="text-display-xl font-display text-foreground text-balance"
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              variants={staggerItem}
              className="mt-5 text-lg text-foreground-muted leading-relaxed text-pretty"
            >
              {description}
            </motion.p>
          )}

          {/* Actions */}
          {children && (
            <motion.div
              variants={staggerItem}
              className={cn("mt-8 flex flex-wrap gap-3", isCentered && "justify-center")}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
