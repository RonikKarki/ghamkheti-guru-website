import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default:  "bg-card border border-border glow-card",
        glass:    "glass rounded-xl",
        elevated: "bg-surface-raised border border-border-strong shadow-xl shadow-black/30",
        outline:  "border border-border-strong bg-transparent",
        gold:     "glass-gold rounded-xl",
        ghost:    "bg-transparent",
      },
      hover: {
        none:   "",
        lift:   "hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,197,94,0.15)]",
        glow:   "hover:border-primary/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.18)]",
        scale:  "hover:scale-[1.02]",
      },
    },
    defaultVariants: { variant: "default", hover: "none" },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, hover }), className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-6 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold text-foreground leading-snug text-lg", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-foreground-muted leading-relaxed", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
