/**
 * In-memory rate limiter.
 *
 * NOTE: This works correctly for single-process (traditional Node.js) deployments.
 * On serverless platforms (Vercel, AWS Lambda) each cold start gets a fresh Map,
 * so the window resets between invocations. For strict serverless enforcement,
 * replace the store with Upstash Redis or Vercel KV.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Prune expired entries every 10 minutes to avoid unbounded memory growth
const PRUNE_INTERVAL_MS = 600_000;
let pruneTimer: ReturnType<typeof setInterval> | null = null;

function ensurePruner() {
  if (pruneTimer) return;
  pruneTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, PRUNE_INTERVAL_MS);
  // Don't hold the process open in test environments
  if (pruneTimer?.unref) pruneTimer.unref();
}

export interface RateLimitResult {
  success: boolean;   // true = request is allowed
  remaining: number;  // requests remaining in this window
  resetAt: number;    // Unix ms timestamp when window resets
}

/**
 * @param key      Unique identifier, typically `ip:route`
 * @param max      Max requests per window
 * @param windowMs Duration of the window in milliseconds
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  ensurePruner();

  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    const entry: Entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { success: true, remaining: max - 1, resetAt: entry.resetAt };
  }

  existing.count += 1;

  return {
    success: existing.count <= max,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
  };
}

/** Convenience: 10 requests per 15 minutes for public form submissions */
export function contactRateLimit(ip: string): RateLimitResult {
  return rateLimit(`contact:${ip}`, 10, 15 * 60 * 1000);
}

/** Convenience: 5 attempts per 15 minutes for authentication */
export function authRateLimit(ip: string): RateLimitResult {
  return rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000);
}
