"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open:         boolean;
  onClose:      () => void;
  title?:       string;
  description?: string;
  children:     React.ReactNode;
  size?:        "sm" | "md" | "lg" | "xl";
  footer?:      React.ReactNode;
}

export function Dialog({
  open, onClose, title, description, children, size = "md", footer,
}: DialogProps) {
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

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className={cn("relative w-full rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]", sizes[size])}>
        {/* Header */}
        {(title || description) && (
          <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
            {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
            {description && <p className="text-sm text-foreground-muted mt-0.5">{description}</p>}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-foreground-subtle hover:text-foreground hover:bg-surface transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-border px-6 py-4 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
