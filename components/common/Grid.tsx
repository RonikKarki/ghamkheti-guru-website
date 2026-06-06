import { cn } from "@/lib/utils";

type Cols = 1 | 2 | 3 | 4 | 5 | 6;
type Gap = "none" | "sm" | "default" | "lg" | "xl";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: Cols;
  colsMd?: Cols;
  colsLg?: Cols;
  gap?: Gap;
  children: React.ReactNode;
}

const colMap: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const colMdMap: Record<Cols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const colLgMap: Record<Cols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const gapMap: Record<Gap, string> = {
  none:    "gap-0",
  sm:      "gap-4",
  default: "gap-6",
  lg:      "gap-8",
  xl:      "gap-10 md:gap-12",
};

export function Grid({
  cols = 1,
  colsMd,
  colsLg,
  gap = "default",
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        colMap[cols],
        colsMd && colMdMap[colsMd],
        colsLg && colLgMap[colsLg],
        gapMap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
