import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  wrapperClassName?: string;
}

const inputBase =
  "w-full rounded-xl border bg-input text-foreground text-sm " +
  "placeholder:text-foreground-subtle " +
  "transition-all duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, icon, iconRight, wrapperClassName, className, id, required, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              inputBase,
              "h-11 px-4 py-2.5",
              icon && "pl-10",
              iconRight && "pr-10",
              error ? "border-destructive/60 focus:ring-destructive/50" : "border-border-strong",
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none">
              {iconRight}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-foreground-subtle">{hint}</p>}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

export { TextInput };
