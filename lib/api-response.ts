/**
 * API Response utilities — Ghamkheti Guru Company Limited
 *
 * Provides typed, consistent NextResponse wrappers for all API routes.
 * Every response follows the envelope:
 *
 *   { success: boolean, data?: T, message?: string,
 *     error?: string, errors?: FieldError[], pagination?: Pagination }
 *
 * Usage:
 *   return apiSuccess(user, "User created", 201);
 *   return apiError("Not found", 404);
 *   return apiPaginated(docs, { page: 1, limit: 10, total: 42 });
 */

import { NextResponse } from "next/server";

/* ── Shared types ────────────────────────────────────────────────── */
export interface FieldError {
  field: string;
  message: string;
}

export interface Pagination {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface ApiEnvelope<T = unknown> {
  success:    boolean;
  data?:      T;
  message?:   string;
  error?:     string;
  errors?:    FieldError[];
  pagination?: Pagination;
}

/* ── Builders ────────────────────────────────────────────────────── */

/** 200 OK with data. */
export function apiSuccess<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiEnvelope<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

/** 201 Created. */
export function apiCreated<T>(
  data: T,
  message = "Created successfully"
): NextResponse<ApiEnvelope<T>> {
  return NextResponse.json({ success: true, data, message }, { status: 201 });
}

/** 2xx with no data body (e.g. 204). */
export function apiNoContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/** Paginated list response. */
export function apiPaginated<T>(
  data:       T[],
  pagination: Omit<Pagination, "hasNext" | "hasPrev">,
  message?:   string
): NextResponse<ApiEnvelope<T[]>> {
  const { page, limit, total, totalPages } = pagination;
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}

/** Generic error response. */
export function apiError(
  error:  string,
  status = 500
): NextResponse<ApiEnvelope> {
  return NextResponse.json({ success: false, error }, { status });
}

/** 400 Bad Request. */
export function apiBadRequest(error = "Bad request"): NextResponse<ApiEnvelope> {
  return apiError(error, 400);
}

/** 401 Unauthorized. */
export function apiUnauthorized(
  error = "Authentication required"
): NextResponse<ApiEnvelope> {
  return apiError(error, 401);
}

/** 403 Forbidden. */
export function apiForbidden(
  error = "You do not have permission to perform this action"
): NextResponse<ApiEnvelope> {
  return apiError(error, 403);
}

/** 404 Not Found. */
export function apiNotFound(
  resource = "Resource"
): NextResponse<ApiEnvelope> {
  return apiError(`${resource} not found`, 404);
}

/** 409 Conflict (e.g. duplicate email). */
export function apiConflict(
  error = "Resource already exists"
): NextResponse<ApiEnvelope> {
  return apiError(error, 409);
}

/** 422 Validation errors (field-level). */
export function apiValidationError(
  errors: FieldError[],
  error = "Validation failed"
): NextResponse<ApiEnvelope> {
  return NextResponse.json({ success: false, error, errors }, { status: 422 });
}

/** 500 Internal Server Error — logs to console in development. */
export function apiServerError(
  err?: unknown,
  context?: string
): NextResponse<ApiEnvelope> {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[API ERROR]${context ? ` [${context}]` : ""}`, err);
  }
  return apiError("An unexpected error occurred. Please try again.", 500);
}
