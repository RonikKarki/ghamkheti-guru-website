/**
 * MongoDB connection utility — Ghamkheti Guru Company Limited
 *
 * HOW IT WORKS
 * ─────────────
 * Next.js runs in a Node.js environment where the module cache persists across
 * hot-module reloads in development. If we called `mongoose.connect()` on every
 * import we would open a new connection pool on every file save.
 *
 * The fix is a *global singleton cache* (`global.__mongooseCache`). On the first
 * call we create the promise and store it. Every subsequent call awaits the same
 * promise, so only ONE connection pool is ever created per Node.js process — in
 * both development (long-lived HMR process) and production (serverless/container).
 *
 * CONNECTION POOLING
 * ──────────────────
 * `minPoolSize` keeps `MONGODB_MIN_POOL_SIZE` connections warm so the first
 * request after idle periods doesn't pay a connection-establishment latency hit.
 * `maxPoolSize` caps resource usage. Tune via environment variables.
 *
 * SCALABILITY NOTES
 * ─────────────────
 * • On serverless (Vercel/AWS Lambda) each function instance manages its own
 *   pool. Keep maxPoolSize low (5–10) to avoid overwhelming Atlas.
 * • On a dedicated server, raise maxPoolSize to match your concurrency needs.
 * • Use MongoDB Atlas connection string with `?retryWrites=true&w=majority`
 *   for automatic retries on transient errors.
 */

import mongoose from "mongoose";

/* ── Environment validation ─────────────────────────────────────── */
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME     = process.env.MONGODB_DB_NAME ?? "ghamkheti-guru";
const MIN_POOL    = Number(process.env.MONGODB_MIN_POOL_SIZE ?? 2);
const MAX_POOL    = Number(process.env.MONGODB_MAX_POOL_SIZE ?? 10);

if (!MONGODB_URI) {
  throw new Error(
    "❌ MONGODB_URI is not defined. Add it to .env.local:\n" +
    "   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>"
  );
}

/* ── Global cache type ──────────────────────────────────────────── */
interface MongooseCache {
  conn:    typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

// Initialise cache from global (survives HMR, never recreated)
const cache: MongooseCache = (global.__mongooseCache ??= {
  conn:    null,
  promise: null,
});

/* ── Connection options ─────────────────────────────────────────── */
const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  dbName:       DB_NAME,
  minPoolSize:  MIN_POOL,
  maxPoolSize:  MAX_POOL,
  serverSelectionTimeoutMS: 8_000,   // fail fast if Atlas is unreachable
  socketTimeoutMS:          45_000,  // abort slow queries
  family:       4,                   // force IPv4 (avoids DNS issues on some hosts)
  bufferCommands: false,             // surface errors immediately instead of buffering
};

/* ── Connection event hooks ─────────────────────────────────────── */
function attachConnectionEvents(instance: typeof mongoose): void {
  const conn = instance.connection;

  conn.once("open",  () => console.info(`✅ MongoDB connected [${DB_NAME}]`));
  conn.on("error",   (err) => console.error("❌ MongoDB error:", err.message));
  conn.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
  conn.on("reconnected",  () => console.info("♻️  MongoDB reconnected"));
}

/* ── Retry helper ───────────────────────────────────────────────── */
async function connectWithRetry(
  attempts = 3,
  delayMs = 500
): Promise<typeof mongoose> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const instance = await mongoose.connect(MONGODB_URI!, MONGOOSE_OPTIONS);
      attachConnectionEvents(instance);
      return instance;
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        const wait = delayMs * 2 ** i; // 500 ms, 1 s, 2 s
        console.warn(`⚠️  MongoDB connect attempt ${i + 1} failed — retrying in ${wait} ms`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }
  throw lastErr;
}

/* ── Main export ─────────────────────────────────────────────────── */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection immediately (zero-latency for warm requests)
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = connectWithRetry().catch((err) => {
      // Clear promise so the next call can attempt a fresh connection
      cache.promise = null;
      throw err;
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

/** Returns the current connection state as a human-readable string. */
export function getConnectionState(): string {
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized",
  };
  return states[mongoose.connection.readyState] ?? "unknown";
}

/** True when a live connection exists — useful for health-check endpoints. */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default connectToDatabase;
