import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, wrapperClassName, className, id, required, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          required={required}
          rows={5}
          className={cn(
            "w-full rounded-xl border bg-input text-foreground text-sm",
            "px-4 py-3",
            "placeholder:text-foreground-subtle",
            "transition-all duration-200 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-destructive/60 focus:ring-destructive/50"
              : "border-border-strong",
            className
          )}
          {...props}
        />

        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-foreground-subtle">{hint}</p>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
