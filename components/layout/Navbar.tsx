"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { navItems, siteConfig } from "@/config";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import type { NavItem } from "@/types";

interface NavbarProps {
  projectLinks?:    Array<{ label: string; href: string }>;
  subsidiaryLinks?: Array<{ label: string; href: string }>;
}

export function Navbar({ projectLinks, subsidiaryLinks }: NavbarProps) {
  const [isOpen, setIsOpen]             = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled]         = useState(false);
  const pathname                        = usePathname();
  const dropdownRef                     = useRef<HTMLDivElement>(null);

  const resolvedNavItems = navItems.map((item) => {
    if (item.label === "Projects") {
      return { ...item, children: [{ label: "All Projects", href: "/projects" }, ...(projectLinks ?? [])] };
    }
    if (item.label === "Subsidiaries") {
      return { ...item, children: [{ label: "All Subsidiaries", href: "/subsidiaries" }, ...(subsidiaryLinks ?? [])] };
    }
    return item;
  });

  useEffect(() => { setIsOpen(false); setOpenDropdown(null); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Transparent white-text navbar while sitting on top of the homepage hero photo
  const overHero = pathname === "/" && !scrolled && !isOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        overHero ? "bg-transparent" : "bg-background shadow-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105",
                overHero
                  ? "bg-white/95 shadow-lg"
                  : "bg-linear-to-br from-primary/12 via-gold/10 to-transparent ring-1 ring-primary/15"
              )}
            >
              <div className="relative h-8 w-8">
                <Image
                  src="/images/logos/ghamkheti-emblem.png"
                  alt="Ghamkheti Guru Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="hidden sm:block leading-tight">
              <p
                className={cn(
                  "text-sm font-bold tracking-wide transition-colors duration-300",
                  overHero ? "text-white" : "text-foreground"
                )}
              >
                {siteConfig.shortName}
              </p>
              <p
                className={cn(
                  "text-[9px] font-medium tracking-[0.18em] uppercase transition-colors duration-300",
                  overHero ? "text-white/60" : "text-foreground-subtle"
                )}
              >
                Company Limited
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {resolvedNavItems.map((item) => (
              <NavItemLink
                key={item.href}
                item={item}
                pathname={pathname}
                overHero={overHero}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/contact"
              className={cn(
                "inline-flex h-9 items-center rounded-md px-4 text-xs font-semibold tracking-wide transition-colors duration-200",
                overHero
                  ? "bg-white text-[#0F0D09] hover:bg-white/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen((o) => !o)}
              className={cn(
                "p-1.5 transition-colors",
                overHero ? "text-white/80 hover:text-white" : "text-foreground-muted hover:text-foreground"
              )}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom border — hidden while transparent over the hero */}
      <div className={cn("h-px w-full bg-border transition-opacity duration-300", overHero ? "opacity-0" : "opacity-100")} />

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="px-6 py-5 space-y-0.5">
              {resolvedNavItems.map((item) => (
                <MobileNavItem key={item.href} item={item} pathname={pathname} />
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-primary-foreground"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItemLink({
  item, pathname, overHero, openDropdown, setOpenDropdown,
}: {
  item: NavItem; pathname: string; overHero: boolean;
  openDropdown: string | null; setOpenDropdown: (v: string | null) => void;
}) {
  const isActive    = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const isOpen      = openDropdown === item.href;

  const linkClass = cn(
    "flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium transition-colors duration-200",
    overHero
      ? isActive ? "text-white font-semibold" : "text-white/75 hover:text-white"
      : isActive ? "text-foreground font-semibold" : "text-foreground-muted hover:text-foreground"
  );

  if (hasChildren) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : item.href)}
          className={linkClass}
        >
          {item.label}
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
              className="absolute left-0 top-full mt-1 w-52 py-1.5 z-50 bg-background border border-border shadow-md rounded-md"
            >
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
                >
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
    <Link href={item.href} className={linkClass}>
      {item.label}
    </Link>
  );
}

function MobileNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const isActive        = pathname === item.href;
  const hasChildren     = item.children && item.children.length > 0;

  return (
    <div>
      {hasChildren ? (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex items-center justify-between w-full px-0 py-2.5 text-sm",
              isActive ? "text-foreground font-semibold" : "text-foreground-muted hover:text-foreground"
            )}
          >
            {item.label}
            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pl-4 border-l border-border ml-1"
              >
                {item.children!.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
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
            "block py-2.5 text-sm transition-colors",
            isActive ? "text-foreground font-semibold" : "text-foreground-muted hover:text-foreground"
          )}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
}
