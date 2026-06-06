import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-125 w-125 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="relative flex items-center gap-2.5 mb-8 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
          <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-tight">Ghamkheti Guru</p>
          <p className="text-[10px] text-foreground-subtle leading-tight">Company Limited</p>
        </div>
      </Link>

      <div className="relative w-full max-w-md">{children}</div>

      <p className="relative mt-8 text-xs text-foreground-subtle">
        &copy; {new Date().getFullYear()} Ghamkheti Guru Company Limited. All rights reserved.
      </p>
    </div>
  );
}
