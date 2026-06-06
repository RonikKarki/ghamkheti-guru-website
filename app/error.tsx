"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container>
        <div className="max-w-lg mx-auto text-center py-20">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 mx-auto mb-8">
            <AlertTriangle className="h-9 w-9 text-destructive" strokeWidth={1.5} />
          </div>

          {/* Content */}
          <h1 className="text-display-md font-display text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-foreground-muted leading-relaxed mb-3">
            An unexpected error occurred. Our team has been notified and is
            working to resolve the issue.
          </p>
          {error.digest && (
            <p className="text-xs text-foreground-subtle mb-8 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset} variant="gradient" size="lg">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
