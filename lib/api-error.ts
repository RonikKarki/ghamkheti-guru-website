/**
 * Error handling utilities — Ghamkheti Guru Company Limited
 *
 * HOW IT WORKS
 * ─────────────
 * All API route handlers are wrapped with `withApiHandler()`. Any thrown error
 * is caught and converted to the appropriate HTTP response automatically, so
 * individual routes only need to throw — not catch.
 *
 *   // In a route file:
 *   export const GET = withApiHandler(async (req) => {
 *     const doc = await Project.findById(id);
 *     if (!doc) throw new NotFoundError("Project");
 *     return apiSuccess(doc);
 *   });
 *
 * ERROR HIERARCHY
 * ───────────────
 *   AppError (base)
 *   ├─ ValidationError  (422) — field-level validation failures
 *   ├─ NotFoundError    (404)
 *   ├─ ConflictError    (409) — duplicate key / unique constraint
 *   ├─ UnauthorizedError(401)
 *   └─ ForbiddenError   (403)
 *
 * MONGOOSE ERRORS
 * ───────────────
 * `parseMongooseError()` converts Mongoose `ValidationError` and `MongoError`
 * (duplicate key, code 11000) into structured FieldError arrays.
 */

import { NextRequest, NextResponse } from "next/server";
import type { Error as MongooseError } from "mongoose";
import {
  apiError,
  apiValidationError,
  apiServerError,
  type FieldError,
} from "@/lib/api-response";

/* ── Base error class ────────────────────────────────────────────── */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    // Restore prototype chain (needed when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/* ── Specialised error classes ───────────────────────────────────── */
export class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    public readonly fields?: FieldError[]
  ) {
    super(message, 422, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "FORBIDDEN");
  }
}

/* ── Mongoose error parser ───────────────────────────────────────── */

/** Converts a Mongoose ValidationError into a FieldError array. */
export function parseMongooseValidationError(
  err: MongooseError.ValidationError
): FieldError[] {
  return Object.entries(err.errors).map(([field, error]) => ({
    field,
    message: error.message,
  }));
}

/** Converts a MongoDB duplicate-key error (code 11000) into a FieldError. */
export function parseDuplicateKeyError(err: unknown): FieldError[] {
  const e = err as { code?: number; keyValue?: Record<string, unknown> };
  if (e.code === 11000 && e.keyValue) {
    return Object.keys(e.keyValue).map((field) => ({
      field,
      message: `${field} already exists`,
    }));
  }
  return [];
}

/* ── Route handler wrapper ───────────────────────────────────────── */
// ctx is typed as `any` so individual routes can define their own
// strongly-typed Ctx without variance conflicts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>;

/**
 * Wraps a Next.js route handler with centralised error handling.
 * All AppError subclasses, Mongoose validation errors, and duplicate-key
 * errors are caught and converted to the correct HTTP response.
 * Unexpected errors fall back to 500 Internal Server Error.
 */
export function withApiHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err: unknown) {
      /* ── Our own typed errors ── */
      if (err instanceof ValidationError) {
        return err.fields
          ? apiValidationError(err.fields, err.message)
          : apiError(err.message, 422);
      }

      if (err instanceof AppError) {
        return apiError(err.message, err.statusCode);
      }

      /* ── Mongoose validation error ── */
      const e = err as { name?: string; code?: number };
      if (e.name === "ValidationError") {
        const fields = parseMongooseValidationError(
          err as MongooseError.ValidationError
        );
        return apiValidationError(fields, "Validation failed");
      }

      /* ── MongoDB duplicate key ── */
      if (e.code === 11000) {
        const fields = parseDuplicateKeyError(err);
        return fields.length
          ? apiValidationError(fields, "Duplicate value")
          : apiError("A record with this value already exists", 409);
      }

      /* ── CastError (invalid ObjectId) ── */
      if (e.name === "CastError") {
        return apiError("Invalid identifier format", 400);
      }

      /* ── Unknown ── */
      return apiServerError(err, req.nextUrl.pathname);
    }
  };
}
