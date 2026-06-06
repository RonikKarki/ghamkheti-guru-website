import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block text-sm font-medium text-foreground mb-1.5 cursor-pointer", className)}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-red-400">*</span>}
  </label>
));
Label.displayName = "Label";

export { Label };
