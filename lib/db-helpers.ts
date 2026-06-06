/**
 * Database helper functions — Ghamkheti Guru Company Limited
 *
 * Generic, reusable CRUD wrappers that:
 *  • Always call connectToDatabase() before every operation (idempotent)
 *  • Accept lean options to return plain objects (faster, no Mongoose overhead)
 *  • Accept populate strings for relationship resolution
 *  • Return plain objects or null — no raw Mongoose Document leaking into API
 *
 * SCALABILITY
 * ───────────
 * `findPaginated` offloads pagination to MongoDB with `skip/limit` (works up
 * to ~millions of docs). For very large collections, switch to cursor-based
 * pagination using `_id` or `createdAt` as the cursor — add a `findAfter()`
 * helper when needed.
 *
 * Usage:
 *   const project = await findById(Project, req.params.id, "-__v", "gallery");
 *   const page    = await findPaginated(News, { status: "published" }, 2, 10);
 *   const doc     = await createOne(Contact, body);
 */

import mongoose, { Model, UpdateQuery, QueryOptions } from "mongoose";
type FilterQuery<T> = mongoose.QueryFilter<T>;
import { connectToDatabase } from "@/lib/mongodb";
import { NotFoundError } from "@/lib/api-error";

/* ── Internal connection guard ───────────────────────────────────── */
async function ensureConnected(): Promise<void> {
  await connectToDatabase();
}

/* ── Types ───────────────────────────────────────────────────────── */
export interface FindOptions {
  select?:   string;
  populate?: string | string[];
  sort?:     Record<string, 1 | -1>;
  lean?:     boolean;  // default: true (plain objects, faster)
}

export interface PaginateOptions extends FindOptions {
  page?:  number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data:       T[];
  pagination: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
    hasNext:    boolean;
    hasPrev:    boolean;
  };
}

/* ── findById ────────────────────────────────────────────────────── */
export async function findById<T>(
  Model:   Model<T>,
  id:      string,
  options: FindOptions = {}
): Promise<T | null> {
  await ensureConnected();

  if (!mongoose.isValidObjectId(id)) return null;

  const { select, populate, lean = true } = options;
  let query = Model.findById(id);
  if (select)   query = query.select(select) as typeof query;
  if (populate) query = query.populate(populate) as typeof query;

  return lean ? query.lean<T>().exec() : query.exec() as Promise<T | null>;
}

/** Like findById but throws NotFoundError instead of returning null. */
export async function findByIdOrThrow<T>(
  Model:        Model<T>,
  id:           string,
  resourceName: string,
  options:      FindOptions = {}
): Promise<T> {
  const doc = await findById(Model, id, options);
  if (!doc) throw new NotFoundError(resourceName);
  return doc;
}

/* ── findOne ─────────────────────────────────────────────────────── */
export async function findOne<T>(
  Model:   Model<T>,
  filter:  FilterQuery<T>,
  options: FindOptions = {}
): Promise<T | null> {
  await ensureConnected();

  const { select, populate, lean = true } = options;
  let query = Model.findOne(filter);
  if (select)   query = query.select(select) as typeof query;
  if (populate) query = query.populate(populate) as typeof query;

  return lean ? query.lean<T>().exec() : query.exec() as Promise<T | null>;
}

/* ── findMany ────────────────────────────────────────────────────── */
export async function findMany<T>(
  Model:   Model<T>,
  filter:  FilterQuery<T> = {},
  options: FindOptions = {}
): Promise<T[]> {
  await ensureConnected();

  const { select, populate, sort = { createdAt: -1 }, lean = true } = options;
  let query = Model.find(filter).sort(sort);
  if (select)   query = query.select(select) as typeof query;
  if (populate) query = query.populate(populate) as typeof query;

  return lean ? query.lean<T[]>().exec() : query.exec() as Promise<T[]>;
}

/* ── findPaginated ───────────────────────────────────────────────── */
/**
 * Returns a page of documents along with full pagination metadata.
 * Uses MongoDB skip/limit — suitable for up to ~1M documents.
 */
export async function findPaginated<T>(
  Model:   Model<T>,
  filter:  FilterQuery<T> = {},
  options: PaginateOptions = {}
): Promise<PaginatedResult<T>> {
  await ensureConnected();

  const {
    page  = 1,
    limit = 10,
    sort  = { createdAt: -1 },
    select,
    populate,
    lean = true,
  } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    (() => {
      let q = Model.find(filter).sort(sort).skip(skip).limit(limit);
      if (select)   q = q.select(select) as typeof q;
      if (populate) q = q.populate(populate) as typeof q;
      return lean ? q.lean<T[]>().exec() : q.exec() as Promise<T[]>;
    })(),
    Model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/* ── createOne ───────────────────────────────────────────────────── */
export async function createOne<T>(
  Model: Model<T>,
  data:  Partial<T>
): Promise<T> {
  await ensureConnected();
  const doc = await Model.create(data);
  return doc.toObject() as T;
}

/* ── updateById ──────────────────────────────────────────────────── */
export async function updateById<T>(
  Model:   Model<T>,
  id:      string,
  update:  UpdateQuery<T>,
  options: QueryOptions & { resourceName?: string } = {}
): Promise<T> {
  await ensureConnected();

  const { resourceName = "Document", ...queryOptions } = options;

  const doc = await Model.findByIdAndUpdate(id, update, {
    new:        true,
    runValidators: true,
    ...queryOptions,
  }).lean<T>();

  if (!doc) throw new NotFoundError(resourceName);
  return doc;
}

/* ── deleteById ──────────────────────────────────────────────────── */
export async function deleteById<T>(
  Model:        Model<T>,
  id:           string,
  resourceName = "Document"
): Promise<void> {
  await ensureConnected();
  const result = await Model.findByIdAndDelete(id);
  if (!result) throw new NotFoundError(resourceName);
}

/* ── exists ──────────────────────────────────────────────────────── */
export async function exists<T>(
  Model:  Model<T>,
  filter: FilterQuery<T>
): Promise<boolean> {
  await ensureConnected();
  return (await Model.exists(filter)) !== null;
}

/* ── countDocuments ──────────────────────────────────────────────── */
export async function countDocuments<T>(
  Model:  Model<T>,
  filter: FilterQuery<T> = {}
): Promise<number> {
  await ensureConnected();
  return Model.countDocuments(filter);
}

/* ── incrementField ─────────────────────────────────────────────── */
/** Atomically increments a numeric field (e.g. views, downloadCount). */
export async function incrementField<T>(
  Model: Model<T>,
  id:    string,
  field: keyof T,
  by = 1
): Promise<void> {
  await ensureConnected();
  await Model.findByIdAndUpdate(id, { $inc: { [field as string]: by } } as UpdateQuery<T>);
}

/* ── parseQueryPagination ────────────────────────────────────────── */
/** Extracts page/limit from URL search params with safe defaults. */
export function parseQueryPagination(
  searchParams: URLSearchParams,
  defaultLimit = 10,
  maxLimit     = 100
): { page: number; limit: number } {
  const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit = Math.min(
    maxLimit,
    Math.max(1, Number(searchParams.get("limit") ?? defaultLimit))
  );
  return { page, limit };
}

/** Parses a MongoDB sort string like "-createdAt" → { createdAt: -1 }. */
export function parseSort(
  raw?:     string | null,
  allowed?: string[]
): Record<string, 1 | -1> {
  if (!raw) return { createdAt: -1 };
  const dir  = raw.startsWith("-") ? -1 : 1;
  const field = raw.replace(/^-/, "");
  if (allowed && !allowed.includes(field)) return { createdAt: -1 };
  return { [field]: dir };
}
