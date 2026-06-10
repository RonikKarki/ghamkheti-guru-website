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
  const [scrolled, setScrolled]         = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setOpenDropdown(null); }, [pathname]);

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
      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative h-8 w-8">
                <Image
                  src="/images/logos/ghamkheti-logo.png"
                  alt="Ghamkheti Guru Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {siteConfig.shortName}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
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
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-[0.1em] uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <button
                aria-label="Toggle menu"
                onClick={() => setIsOpen((o) => !o)}
                className="p-2 text-foreground-muted hover:text-foreground transition-colors"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-background/98 backdrop-blur-xl border-b border-border"
          >
            <div className="px-6 py-6 space-y-1">
              {resolvedNavItems.map((item) => (
                <MobileNavItem key={item.href} item={item} pathname={pathname} />
              ))}
              <div className="pt-5 border-t border-border mt-4">
                <Link
                  href="/contact"
                  className="block w-full text-center px-4 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
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
  item, pathname, openDropdown, setOpenDropdown,
}: {
  item: NavItem; pathname: string;
  openDropdown: string | null; setOpenDropdown: (v: string | null) => void;
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
            "flex items-center gap-1 px-3 py-2 text-sm transition-colors",
            isActive ? "text-primary" : "text-foreground-muted hover:text-foreground"
          )}
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
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 w-52 border border-border bg-background shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-2 z-50"
            >
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  <span className="h-px w-3 bg-foreground-subtle" />
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
        "px-3 py-2 text-sm transition-colors",
        isActive ? "text-primary" : "text-foreground-muted hover:text-foreground"
      )}
    >
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
              "flex items-center justify-between w-full px-2 py-2.5 text-sm",
              isActive ? "text-primary" : "text-foreground-muted hover:text-foreground"
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
                className="overflow-hidden pl-4 border-l border-primary/30 ml-2 mt-0.5"
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
            "block px-2 py-2.5 text-sm transition-colors",
            isActive ? "text-primary" : "text-foreground-muted hover:text-foreground"
          )}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
}
