import { cn } from "@/lib/utils";

/* ── Status config maps ─────────────────────────────────────── */
const STATUS_STYLES: Record<string, string> = {
  // Projects
  operational:        "bg-primary/15 text-primary border-primary/25",
  under_construction: "bg-gold/15 text-gold border-gold/25",
  commissioning:      "bg-teal/15 text-teal border-teal/25",
  under_development:  "bg-blue-500/15 text-blue-400 border-blue-500/25",
  licensed:           "bg-purple-500/15 text-purple-400 border-purple-500/25",
  on_hold:            "bg-foreground-subtle/15 text-foreground-subtle border-foreground-subtle/25",
  // News
  published:          "bg-primary/15 text-primary border-primary/25",
  draft:              "bg-gold/15 text-gold border-gold/25",
  archived:           "bg-foreground-subtle/15 text-foreground-subtle border-foreground-subtle/25",
  // Contacts
  new:                "bg-gold/15 text-gold border-gold/25",
  read:               "bg-teal/15 text-teal border-teal/25",
  in_progress:        "bg-blue-500/15 text-blue-400 border-blue-500/25",
  replied:            "bg-primary/15 text-primary border-primary/25",
  closed:             "bg-foreground-subtle/15 text-foreground-subtle border-foreground-subtle/25",
  // Users
  active:             "bg-primary/15 text-primary border-primary/25",
  inactive:           "bg-destructive/15 text-destructive border-destructive/25",
  // Priority
  urgent:             "bg-red-500/15 text-red-400 border-red-500/25",
  high:               "bg-orange-500/15 text-orange-400 border-orange-500/25",
  normal:             "bg-blue-500/15 text-blue-400 border-blue-500/25",
  low:                "bg-foreground-subtle/15 text-foreground-subtle border-foreground-subtle/25",
};

const STATUS_LABELS: Record<string, string> = {
  operational:        "Operational",
  under_construction: "Construction",
  commissioning:      "Commissioning",
  under_development:  "Development",
  licensed:           "Licensed",
  on_hold:            "On Hold",
  published:          "Published",
  draft:              "Draft",
  archived:           "Archived",
  new:                "New",
  read:               "Read",
  in_progress:        "In Progress",
  replied:            "Replied",
  closed:             "Closed",
  active:             "Active",
  inactive:           "Inactive",
  urgent:             "Urgent",
  high:               "High",
  normal:             "Normal",
  low:                "Low",
};

interface StatusBadgeProps {
  status:    string;
  label?:    string;
  className?: string;
  size?:     "sm" | "default";
}

export function StatusBadge({ status, label, className, size = "default" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-surface text-foreground-muted border-border";
  const text  = label ?? STATUS_LABELS[status] ?? status;

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium",
      size === "sm" ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs",
      style,
      className
    )}>
      {text}
    </span>
  );
}
