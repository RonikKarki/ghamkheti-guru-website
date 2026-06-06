import { cn } from "@/lib/utils";

type SectionVariant =
  | "default"       // plain background
  | "alt"           // background-alt
  | "surface"       // card surface
  | "dark"          // deep dark
  | "glass"         // glassmorphism
  | "gradient"      // mesh gradient
  | "primary"       // primary green
  | "hero";         // hero with full gradient mesh + noise

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: SectionVariant;
  size?: "sm" | "default" | "lg" | "xl";
  as?: React.ElementType;
}

const variantStyles: Record<SectionVariant, string> = {
  default:  "bg-background",
  alt:      "bg-background-alt",
  surface:  "bg-surface",
  dark:     "bg-[#030806]",
  glass:    "glass",
  gradient: "bg-mesh bg-background",
  primary:  "bg-linear-to-br from-brand-deep via-brand-mid to-brand-deep text-primary-foreground",
  hero:     "bg-hero-gradient relative overflow-hidden noise-overlay",
};

const sizeStyles = {
  sm:      "py-12 md:py-16",
  default: "py-16 md:py-24",
  lg:      "py-20 md:py-32",
  xl:      "py-28 md:py-40",
};

export function Section({
  children,
  variant = "default",
  size = "default",
  as: Tag = "section",
  className,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
