"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  badge?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "lg";
  variant?: "default" | "centered";
  bannerImage?: string;
  bannerImageAlt?: string;
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
  bannerImage,
  bannerImageAlt,
}: PageBannerProps) {
  const isCentered = variant === "centered";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background border-b border-border",
        size === "lg"
          ? "pt-36 pb-20 md:pt-48 md:pb-28"
          : "pt-28 pb-14 md:pt-36 md:pb-20",
        className
      )}
    >
      {/* CMS background image */}
      {bannerImage && (
        <>
          <Image
            src={bannerImage}
            alt={bannerImageAlt ?? ""}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-background/70" />
        </>
      )}

      {/* Top radial green spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "80%",
          height: "100%",
          background:
            "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(0,212,106,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Side accent glow */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: isCentered ? "auto" : "-5%",
          right: isCentered ? "auto" : "auto",
          width: "40%",
          height: "80%",
          background:
            "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(0,212,106,0.06) 0%, transparent 65%)",
        }}
      />

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
              className={cn("mb-5", isCentered && "flex justify-center")}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  {badge}
                </span>
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={staggerItem}
            className="text-display-xl font-display text-foreground text-balance tracking-tight"
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
