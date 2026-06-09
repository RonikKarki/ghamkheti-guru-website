"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { navItems, siteConfig } from "@/config";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import type { NavItem } from "@/types";

interface NavbarProps {
  projectLinks?:    Array<{ label: string; href: string }>;
  subsidiaryLinks?: Array<{ label: string; href: string }>;
}

export function Navbar({ projectLinks, subsidiaryLinks }: NavbarProps) {
  const [isOpen, setIsOpen]           = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname                       = usePathname();
  const dropdownRef                    = useRef<HTMLDivElement>(null);

  // Build nav items — Projects & Subsidiaries dropdowns come entirely from DB
  const resolvedNavItems = navItems.map((item) => {
    if (item.label === "Projects") {
      return {
        ...item,
        children: [
          { label: "All Projects", href: "/projects" },
          ...(projectLinks ?? []),
        ],
      };
    }
    if (item.label === "Subsidiaries") {
      return {
        ...item,
        children: [
          { label: "All Subsidiaries", href: "/subsidiaries" },
          ...(subsidiaryLinks ?? []),
        ],
      };
    }
    return item;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top gradient accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      {/* Main bar */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-surface/96 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            : "bg-surface/90 backdrop-blur-lg"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[60px] items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative">
                <Image
                  src="/images/logos/ghamkheti-logo.png"
                  alt="Ghamkheti Guru Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                  priority
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_rgba(0,212,106,0.8)]" />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[13px] font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {siteConfig.shortName}
                </span>
                <span className="text-[9px] text-foreground-subtle tracking-[0.1em] uppercase">
                  Energy · Agri · Tourism
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
              {resolvedNavItems.map((item) => (
                <NavItemLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <Button asChild size="sm" variant="gradient" className="shadow-[0_0_16px_rgba(0,212,106,0.25)]">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <button
                aria-label="Toggle menu"
                onClick={() => setIsOpen((o) => !o)}
                className="p-2 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-raised transition-colors"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-border" />

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-surface/98 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-5 space-y-0.5">
              {resolvedNavItems.map((item) => (
                <MobileNavItem key={item.href} item={item} pathname={pathname} />
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <Button asChild className="w-full" variant="gradient">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---- Desktop nav item ---- */
function NavItemLink({
  item,
  pathname,
  openDropdown,
  setOpenDropdown,
}: {
  item: NavItem;
  pathname: string;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
}) {
  const isActive    = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const isOpen      = openDropdown === item.href;

  if (hasChildren) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : item.href)}
          className={cn(
            "flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors",
            isActive
              ? "text-primary"
              : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
          )}
        >
          {item.label}
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-border bg-surface-overlay backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-1.5 z-50"
            >
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-raised transition-colors"
                >
                  <span className="h-1 w-1 rounded-full bg-foreground-subtle" />
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "relative px-3 py-2 text-sm rounded-md transition-colors",
        isActive
          ? "text-primary bg-primary/8"
          : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
      )}
    >
      {item.label}
    </Link>
  );
}

/* ---- Mobile nav item ---- */
function MobileNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen]   = useState(false);
  const isActive          = pathname === item.href;
  const hasChildren       = item.children && item.children.length > 0;

  return (
    <div>
      {hasChildren ? (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-md",
              isActive ? "text-primary" : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
            )}
          >
            {item.label}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pl-4 border-l border-primary/20 ml-3 mt-0.5"
              >
                {item.children!.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-3 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href}
          className={cn(
            "block px-3 py-2.5 text-sm rounded-md transition-colors",
            isActive
              ? "text-primary bg-primary/8"
              : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
          )}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
}
