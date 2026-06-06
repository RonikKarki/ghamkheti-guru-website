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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdowns on every route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/logos/ghamkheti-logo.png"
              alt="Ghamkheti Guru Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <span className="hidden sm:block font-bold text-base leading-tight">
              <span className="text-primary">{siteConfig.shortName}</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => (
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
            <Button asChild size="sm">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((o) => !o)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/98 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <MobileNavItem key={item.href} item={item} pathname={pathname} />
              ))}
              <div className="pt-4 border-t border-border">
                <Button asChild className="w-full">
                  <Link href="/contact">Get in Touch</Link>
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
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openDropdown === item.href;

  if (hasChildren) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : item.href)}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "text-primary bg-primary/8"
              : "text-foreground/80 hover:text-foreground hover:bg-accent"
          )}
        >
          {item.label}
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-border bg-card shadow-lg py-1 z-50"
            >
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
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
    <Link
      href={item.href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "text-primary bg-primary/8"
          : "text-foreground/80 hover:text-foreground hover:bg-accent"
      )}
    >
      {item.label}
    </Link>
  );
}

/* ---- Mobile nav item ---- */
function MobileNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      {hasChildren ? (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium",
              isActive ? "text-primary bg-primary/8" : "text-foreground/80 hover:bg-accent"
            )}
          >
            {item.label}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pl-4"
              >
                {item.children!.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
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
            "block px-3 py-2.5 rounded-md text-sm font-medium",
            isActive ? "text-primary bg-primary/8" : "text-foreground/80 hover:bg-accent"
          )}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
}
