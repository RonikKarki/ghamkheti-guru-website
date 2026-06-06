import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?:        React.ElementType;
  title:        string;
  description?: string;
  action?:      React.ReactNode;
  className?:   string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border mb-4">
          <Icon className="h-6 w-6 text-foreground-subtle" strokeWidth={1.5} />
        </div>
      )}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-foreground-muted mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
