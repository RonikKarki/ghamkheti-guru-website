"use client";

import React, {
  createContext, useContext, useState, useCallback, useId,
} from "react";

/* ── Types ─────────────────────────────────────────────────────── */
export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id:           string;
  variant:      ToastVariant;
  title:        string;
  description?: string;
}

interface ToastContextValue {
  toasts:  ToastItem[];
  add:     (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

/* ── Context ─────────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, add, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

/* ── Hook ────────────────────────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");

  return {
    success: (title: string, description?: string) =>
      ctx.add({ variant: "success", title, description }),
    error: (title: string, description?: string) =>
      ctx.add({ variant: "error", title, description }),
    warning: (title: string, description?: string) =>
      ctx.add({ variant: "warning", title, description }),
    info: (title: string, description?: string) =>
      ctx.add({ variant: "info", title, description }),
    dismiss: ctx.dismiss,
    toasts: ctx.toasts,
  };
}
