/**
 * ApiError — the single error class for all API failures.
 *
 * Every network, timeout, abort, HTTP, validation, and configuration
 * error is normalized into an ApiError with a `kind` discriminator.
 * The UI never needs to inspect status codes or Strapi error shapes.
 */

import type { ApiErrorKind, SerializedApiError, UserFacingErrorKind } from "../types/errors.ts";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly method?: string;
  readonly url?: string;
  readonly requestId?: string;
  readonly retriable: boolean;
  readonly details?: unknown;
  readonly cause?: unknown;

  constructor(params: {
    kind: ApiErrorKind;
    message: string;
    status?: number;
    code?: string;
    method?: string;
    url?: string;
    requestId?: string;
    retriable: boolean;
    details?: unknown;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.kind = params.kind;
    this.status = params.status;
    this.code = params.code;
    this.method = params.method;
    this.url = params.url;
    this.requestId = params.requestId;
    this.retriable = params.retriable;
    this.details = params.details;
    this.cause = params.cause;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Type guard: is this error an ApiError? */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Serialize an ApiError to a plain object (safe for logging / UI). */
export function serializeApiError(error: unknown): SerializedApiError {
  if (isApiError(error)) {
    return {
      kind: error.kind,
      message: error.message,
      status: error.status,
      code: error.code,
      method: error.method,
      url: error.url,
      requestId: error.requestId,
      retriable: error.retriable,
    };
  }
  return {
    kind: "network",
    message: error instanceof Error ? error.message : String(error),
    retriable: false,
  };
}

/**
 * Map any error to a user-facing kind.
 *
 * The UI uses this to show the right message without knowing HTTP
 * status codes or Strapi error formats.
 */
export function toUserFacingError(error: unknown): UserFacingErrorKind {
  if (!isApiError(error)) return "generic-error";

  switch (error.kind) {
    case "network":
      return "network-unavailable";
    case "timeout":
      return "content-unavailable";
    case "aborted":
      return "generic-error";
    case "http": {
      const status = error.status ?? 0;
      if (status === 404) return "not-found";
      if (status === 401 || status === 403) return "forbidden";
      if (status === 429) return "rate-limited";
      if (status >= 500) return "content-unavailable";
      return "generic-error";
    }
    case "validation":
      return "content-unavailable";
    case "configuration":
      return "generic-error";
    default:
      return "generic-error";
  }
}

/** Human-readable default messages for each user-facing kind. */
export const USER_FACING_MESSAGES: Record<UserFacingErrorKind, string> = {
  "network-unavailable": "Network unavailable. Check your connection and try again.",
  "content-unavailable": "Content temporarily unavailable. Please try again.",
  "not-found": "Content not found.",
  "forbidden": "Access not permitted.",
  "rate-limited": "Rate limit reached. Please wait a moment and try again.",
  "generic-error": "Couldn't load this content. Try again.",
};
