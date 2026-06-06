import type { Metadata } from "next";
import Link from "next/link";
import { ShieldOff, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Insufficient Permissions" };

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-6">
          <ShieldOff className="h-8 w-8 text-red-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-foreground-muted leading-relaxed mb-8">
          You do not have permission to access this page.
          Contact your Super Admin to request elevated access.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
