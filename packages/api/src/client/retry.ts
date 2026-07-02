/**
 * Retry logic for the ApiClient.
 *
 * Conservative rules:
 *   - Only GET and HEAD (idempotent by default).
 *   - Retry on: network error, timeout, 408, 429, 5xx.
 *   - Never retry: 400, 401, 403, 404, validation, configuration, manual abort.
 *   - Exponential backoff with jitter.
 *   - Respect Retry-After header when present.
 *   - Never retry after manual abort.
 */

import { ApiError, isApiError } from "./api-error.ts";
import type { HttpMethod } from "../types/api.ts";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 400;
const MAX_DELAY_MS = 4_000;

/** Is this error retriable? */
export function isRetriableError(error: unknown, method: HttpMethod): boolean {
  if (!isApiError(error)) return false;
  if (method !== "GET" && method !== "HEAD") return false;
  if (error.kind === "aborted") return false;
  if (error.kind === "network" || error.kind === "timeout") return true;
  if (error.kind === "http") {
    const status = error.status ?? 0;
    return status === 408 || status === 429 || status >= 500;
  }
  return false;
}

/** Compute the delay for a retry attempt, respecting Retry-After. */
export function computeRetryDelay(
  attempt: number,
  retryAfterHeader?: string | null,
): number {
  // Respect Retry-After (seconds) if present.
  if (retryAfterHeader) {
    const seconds = Number(retryAfterHeader);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(seconds * 1000, MAX_DELAY_MS);
    }
  }

  // Exponential backoff with jitter: base * 2^attempt + random(0, base).
  const exponential = BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * BASE_DELAY_MS;
  return Math.min(exponential + jitter, MAX_DELAY_MS);
}

/** Sleep for ms, but reject early if signal aborts. */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ApiError({
        kind: "aborted",
        message: "Request aborted",
        retriable: false,
      }));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new ApiError({
        kind: "aborted",
        message: "Request aborted",
        retriable: false,
      }));
    }, { once: true });
  });
}

export const RETRY_CONFIG = { maxRetries: MAX_RETRIES } as const;
