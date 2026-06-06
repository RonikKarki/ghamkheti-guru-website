"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open:      boolean;
  onClose:   () => void;
  title?:    string;
  subtitle?: string;
  children:  React.ReactNode;
  footer?:   React.ReactNode;
  size?:     "md" | "lg" | "xl";
}

export function Sheet({ open, onClose, title, subtitle, children, footer, size = "lg" }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const widths = { md: "max-w-md", lg: "max-w-xl", xl: "max-w-2xl" };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out",
          widths[size],
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {(title || subtitle) && (
          <div className="shrink-0 flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div>
              {title    && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
              {subtitle && <p className="text-xs text-foreground-subtle mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-subtle hover:text-foreground hover:bg-surface transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border px-6 py-4 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
