"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked:   boolean;
  onChange:  (checked: boolean) => void;
  disabled?: boolean;
  label?:    string;
  className?: string;
}

export function Switch({ checked, onChange, disabled, label, className }: SwitchProps) {
  return (
    <label className={cn("inline-flex items-center gap-2 cursor-pointer", disabled && "opacity-50 cursor-not-allowed", className)}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
          checked ? "bg-primary" : "bg-surface-raised"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}
