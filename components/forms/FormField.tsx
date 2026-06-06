import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
      {!error && hint && <p className="text-xs text-foreground-subtle mt-0.5">{hint}</p>}
    </div>
  );
}
