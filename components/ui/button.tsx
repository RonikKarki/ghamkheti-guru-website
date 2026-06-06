import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg",
    "text-sm font-medium tracking-wide",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer select-none",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      variant: {
        /* Solid primary green */
        default:
          "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-brand-mid hover:shadow-lg hover:shadow-primary/30",
        /* Gradient green  */
        gradient:
          "bg-linear-to-r from-brand to-brand-mid text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:brightness-110",
        /* Gold premium */
        gold:
          "bg-linear-to-r from-gold to-gold-light text-[#1a0a00] font-semibold shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/35 hover:brightness-105",
        /* Glass */
        glass:
          "glass text-foreground hover:bg-surface-raised border-glass-border",
        /* Outline */
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-surface hover:border-primary/40",
        /* Outline green */
        "outline-brand":
          "border border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/70",
        /* Ghost */
        ghost:
          "bg-transparent text-foreground hover:bg-surface hover:text-foreground",
        /* Destructive */
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/85",
        /* Link */
        link:
          "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:   "h-7 px-3 text-xs rounded-md",
        sm:   "h-8 px-3.5 text-xs",
        default: "h-10 px-5",
        lg:   "h-11 px-7 text-base",
        xl:   "h-13 px-9 text-base font-semibold",
        "2xl":"h-16 px-12 text-lg font-semibold rounded-xl",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
        "icon-lg": "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
