"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { cn } from "@/lib/utils";
import { Table2 } from "lucide-react";

export interface Column<T> {
  header:     string;
  key:        string;
  render?:    (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns:      Column<T>[];
  data:         T[];
  keyExtractor: (row: T) => string;
  isLoading?:   boolean;
  emptyTitle?:  string;
  emptyDescription?: string;
  onRowClick?:  (row: T) => void;
  className?:   string;
}

export function DataTable<T>({
  columns, data, keyExtractor, isLoading,
  emptyTitle = "No records found",
  emptyDescription,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {columns.map((col) => (
                  <th key={col.key} className={cn("px-4 py-3 text-left text-xs font-semibold text-foreground-subtle", col.headerClassName)}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-32" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <EmptyState icon={Table2} title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 text-left text-xs font-semibold text-foreground-subtle whitespace-nowrap", col.headerClassName)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "transition-colors hover:bg-surface",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-foreground whitespace-nowrap", col.className)}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
