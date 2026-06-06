"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
        <AlertTriangle className="h-6 w-6 text-destructive" strokeWidth={1.5} />
      </div>
      <h2 className="text-base font-semibold text-foreground mb-2">Something went wrong</h2>
      <p className="text-sm text-foreground-muted mb-1 max-w-sm">
        {error.message || "An unexpected error occurred loading this section."}
      </p>
      {error.digest && (
        <p className="text-[10px] text-foreground-subtle font-mono mb-6">ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try Again
      </button>
    </div>
  );
}
