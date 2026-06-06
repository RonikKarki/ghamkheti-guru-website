"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs:     Tab[];
  active:   string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
            active === tab.value
              ? "border-primary text-primary"
              : "border-transparent text-foreground-muted hover:text-foreground"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
              active === tab.value ? "bg-primary/20 text-primary" : "bg-surface text-foreground-muted"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
