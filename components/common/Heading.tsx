import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva("font-display text-foreground text-balance", {
  variants: {
    level: {
      h1: "text-display-2xl",
      h2: "text-display-lg",
      h3: "text-display-md",
      h4: "text-xl md:text-2xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
    },
    gradient: {
      true:  "text-gradient",
      false: "",
    },
    muted: {
      true:  "text-foreground-muted",
      false: "",
    },
  },
  defaultVariants: { level: "h2", gradient: false, muted: false },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({ as: Tag = "h2", level, gradient, muted, className, ...props }: HeadingProps) {
  const resolvedLevel = level ?? (Tag as HeadingProps["level"]);
  return (
    <Tag
      className={cn(headingVariants({ level: resolvedLevel, gradient, muted }), className)}
      {...props}
    />
  );
}
