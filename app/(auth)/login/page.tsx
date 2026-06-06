"use client";

import type { Metadata } from "next";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

/* metadata can't be exported from a client component — set it in layout */

const ERROR_MAP: Record<string, string> = {
  CredentialsSignin:    "Invalid email or password.",
  OAuthAccountNotLinked: "This email is already linked to a different provider.",
  Default:              "An unexpected error occurred. Please try again.",
};

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/admin/dashboard";
  const urlError     = searchParams.get("error");

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState<string | null>(
    urlError ? (ERROR_MAP[urlError] ?? ERROR_MAP.Default) : null
  );
  const [isPending,   startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email:    email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(ERROR_MAP[result.error] ?? ERROR_MAP.Default);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/30">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Sign In</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">
          Ghamkheti Guru Company Limited — Staff Portal
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <p className="text-sm text-red-400 leading-snug">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email address
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            autoFocus
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-50 transition-shadow"
            placeholder="admin@ghamkhetiguru.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              disabled={isPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 pr-11 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-50 transition-shadow"
              placeholder="••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPass
                ? <EyeOff className="h-4 w-4" />
                : <Eye    className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !email || !password}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign In
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-foreground-subtle">
        This portal is restricted to authorised staff only.
        <br />
        Contact your administrator if you need access.
      </p>
    </div>
  );
}
