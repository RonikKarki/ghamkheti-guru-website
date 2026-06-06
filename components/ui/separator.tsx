import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "strong" | "gradient";
}

function Separator({
  className,
  orientation = "horizontal",
  variant = "default",
  ...props
}: SeparatorProps) {
  const gradientStyle =
    variant === "gradient"
      ? {
          background:
            "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.3) 50%, transparent 100%)",
        }
      : undefined;

  return (
    <div
      role="separator"
      style={gradientStyle}
      className={cn(
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        variant === "default" && "bg-border",
        variant === "strong" && "bg-border-strong",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
