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

/* Map nav labels to their section numbers for the reference aesthetic */
const NAV_NUMBERS: Record<string, string> = {
  "About":        "01",
  "Projects":     "02",
  "Subsidiaries": "03",
  "Media":        "04",
  "Investor Relations": "05",
};

interface NavbarProps {
  projectLinks?:    Array<{ label: string; href: string }>;
  subsidiaryLinks?: Array<{ label: string; href: string }>;
}

export function Navbar({ projectLinks, subsidiaryLinks }: NavbarProps) {
  const [isOpen, setIsOpen]             = useState(false);
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
    /* Always dark regardless of theme */
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative h-7 w-7">
              <Image
                src="/images/logos/ghamkheti-logo.png"
                alt="Ghamkheti Guru Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:block text-xs font-semibold tracking-[0.08em] uppercase text-white/80 group-hover:text-white transition-colors">
              {siteConfig.shortName}
            </span>
          </Link>

          {/* Desktop nav — numbered links */}
          <nav className="hidden lg:flex items-center gap-0" ref={dropdownRef}>
            {resolvedNavItems.map((item, idx) => (
              <NavItemLink
                key={item.href}
                item={item}
                index={idx}
                pathname={pathname}
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
              className="text-xs font-medium tracking-[0.12em] uppercase text-white/50 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5"
            >
              Contact
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen((o) => !o)}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
            style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="px-6 py-5 space-y-0.5">
              {resolvedNavItems.map((item, idx) => (
                <MobileNavItem key={item.href} item={item} index={idx} pathname={pathname} />
              ))}
              <div className="pt-4 border-t mt-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Link
                  href="/contact"
                  className="block text-xs font-medium tracking-[0.12em] uppercase text-white/50 hover:text-white transition-colors py-2"
                >
                  Contact
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
  item, index, pathname, openDropdown, setOpenDropdown,
}: {
  item: NavItem; index: number; pathname: string;
  openDropdown: string | null; setOpenDropdown: (v: string | null) => void;
}) {
  const isActive    = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const isOpen      = openDropdown === item.href;
  const num         = NAV_NUMBERS[item.label] ?? String(index + 1).padStart(2, "0");

  const linkClass = cn(
    "flex items-center gap-1.5 px-4 py-1 text-xs tracking-[0.06em] transition-colors duration-200",
    isActive ? "text-white" : "text-white/45 hover:text-white/80"
  );

  if (hasChildren) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : item.href)}
          className={cn(linkClass, "gap-2")}
        >
          <span className="text-[10px] text-white/25 font-mono">{num}</span>
          {item.label}
          <ChevronDown className={cn("h-2.5 w-2.5 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
              className="absolute left-0 top-full mt-1 w-52 py-1.5 z-50"
              style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs text-white/45 hover:text-white/80 transition-colors"
                >
                  <span className="h-px w-3 bg-white/20" />
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
      <span className="text-[10px] text-white/25 font-mono">{num}</span>
      {item.label}
    </Link>
  );
}

function MobileNavItem({ item, index, pathname }: { item: NavItem; index: number; pathname: string }) {
  const [open, setOpen] = useState(false);
  const isActive        = pathname === item.href;
  const hasChildren     = item.children && item.children.length > 0;
  const num             = NAV_NUMBERS[item.label] ?? String(index + 1).padStart(2, "0");

  return (
    <div>
      {hasChildren ? (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex items-center justify-between w-full px-0 py-2.5 text-xs tracking-[0.06em]",
              isActive ? "text-white" : "text-white/45 hover:text-white/70"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="text-[10px] text-white/25 font-mono">{num}</span>
              {item.label}
            </span>
            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pl-6 border-l ml-2"
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              >
                {item.children!.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-2 text-xs text-white/40 hover:text-white/70 transition-colors"
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
            "flex items-center gap-2 py-2.5 text-xs tracking-[0.06em] transition-colors",
            isActive ? "text-white" : "text-white/45 hover:text-white/70"
          )}
        >
          <span className="text-[10px] text-white/25 font-mono">{num}</span>
          {item.label}
        </Link>
      )}
    </div>
  );
}
