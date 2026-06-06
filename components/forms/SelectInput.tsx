import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, hint, options, placeholder, wrapperClassName, className, id, required, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              "w-full h-11 rounded-xl border bg-input text-foreground text-sm",
              "px-4 pr-10 py-2.5 appearance-none cursor-pointer",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-destructive/60 focus:ring-destructive/50"
                : "border-border-strong",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle pointer-events-none" />
        </div>

        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-foreground-subtle">{hint}</p>}
      </div>
    );
  }
);
SelectInput.displayName = "SelectInput";

export { SelectInput };
