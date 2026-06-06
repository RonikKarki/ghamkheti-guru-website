"use client";

import { useToast } from "@/lib/toast";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToastVariant } from "@/lib/toast";

const ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const STYLES: Record<ToastVariant, string> = {
  success: "border-primary/30 bg-card",
  error:   "border-red-500/30 bg-card",
  warning: "border-gold/30 bg-card",
  info:    "border-teal/30 bg-card",
};

const ICON_STYLES: Record<ToastVariant, string> = {
  success: "text-primary",
  error:   "text-red-400",
  warning: "text-gold",
  info:    "text-teal",
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.variant];
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl animate-in slide-in-from-bottom-2 fade-in",
              STYLES[toast.variant]
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", ICON_STYLES[toast.variant])} strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-foreground-muted mt-0.5 leading-snug">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-foreground-subtle hover:text-foreground transition-colors -mt-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
