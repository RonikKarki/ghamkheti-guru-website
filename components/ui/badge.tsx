import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default:  "bg-primary/15 text-primary border border-primary/20 text-xs px-3 py-1",
        gold:     "bg-gold/10 text-gold border border-gold/20 text-xs px-3 py-1",
        glass:    "glass text-foreground text-xs px-3 py-1",
        success:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1",
        warning:  "bg-amber-500/15 text-amber-400 border border-amber-500/20 text-xs px-3 py-1",
        error:    "bg-red-500/15 text-red-400 border border-red-500/20 text-xs px-3 py-1",
        neutral:  "bg-surface-raised text-foreground-muted border border-border text-xs px-3 py-1",
        outline:  "border border-border-strong text-foreground-muted text-xs px-3 py-1",
        /* Overline badge — uppercase tracking */
        overline: "bg-primary/10 text-primary border border-primary/15 text-[0.65rem] px-3 py-1 uppercase tracking-[0.12em] font-semibold",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
