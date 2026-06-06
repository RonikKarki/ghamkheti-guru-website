import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  variant?: "default" | "gradient" | "dot";
  label?: string;
}

export function Divider({ className, variant = "gradient", label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-border-strong to-transparent" />
        <span className="text-overline text-foreground-subtle">{label}</span>
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-border-strong to-transparent" />
      </div>
    );
  }

  if (variant === "dot") {
    return (
      <div className={cn("flex items-center justify-center gap-2 my-2", className)}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-border-strong"
            style={{ opacity: 1 - i * 0.3 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-px w-full",
        variant === "gradient"
          ? "bg-linear-to-r from-transparent via-border-strong to-transparent"
          : "bg-border",
        className
      )}
    />
  );
}
