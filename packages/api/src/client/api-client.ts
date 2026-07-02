/**
 * ApiClient — the single HTTP boundary for Pathway.
 *
 * Based on fetch (no Axios). Supports:
 *   - baseUrl configurable
 *   - global headers + per-request headers
 *   - HTTP method, typed query params, JSON body
 *   - AbortSignal (external) + timeout (internal)
 *   - request-id for observability
 *   - optional Zod schema validation at the boundary
 *   - safe JSON parsing
 *   - retry with backoff + jitter (GET/HEAD only)
 *   - sanitized error serialization (no tokens, no stack traces to UI)
 *
 * Screens and components never call this directly — they use resource
 * functions or query hooks that wrap it.
 */

import { ApiError } from "./api-error.ts";
import { generateRequestId } from "./request-id.ts";
import { buildQueryString } from "./query-string.ts";
import { parseJsonSafe } from "./response.ts";
import { isRetriableError, computeRetryDelay, sleep, RETRY_CONFIG } from "./retry.ts";
import type { ApiRequestOptions, HttpMethod } from "../types/api.ts";

export interface ApiClientOptions {
  baseUrl: string;
  /** Headers sent on every request (e.g. Accept, Content-Type). */
  defaultHeaders?: Record<string, string>;
  /** Default timeout in ms (can be overridden per request). */
  defaultTimeoutMs?: number;
  /** Override fetch for testing. */
  fetch?: typeof fetch;
}

const DEFAULT_TIMEOUT_MS = 12_000;

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Merge an external AbortSignal with a timeout signal. */
function mergeSignals(external?: AbortSignal, timeoutMs?: number): {
  signal: AbortSignal | undefined;
  cleanup: () => void;
} {
  if (!timeoutMs && !external) return { signal: undefined, cleanup: () => {} };

  const controller = new AbortController();
  const cleanup = () => controller.abort();

  // Timeout
  let timer: ReturnType<typeof setTimeout> | undefined;
  if (timeoutMs) {
    timer = setTimeout(() => {
      controller.abort(new DOMException("Request timed out", "TimeoutError"));
    }, timeoutMs);
  }

  // External abort propagation
  if (external) {
    if (external.aborted) {
      controller.abort(external.reason);
    } else {
      external.addEventListener("abort", () => {
        controller.abort(external.reason);
      }, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timer) clearTimeout(timer);
    },
  };
}

/** Detect if an abort was caused by timeout vs manual abort. */
function classifyAbortError(err: unknown, timedOut: boolean): ApiError {
  if (timedOut) {
    return new ApiError({
      kind: "timeout",
      message: "Request timed out",
      retriable: true,
      cause: err,
    });
  }
  return new ApiError({
    kind: "aborted",
    message: "Request aborted",
    retriable: false,
    cause: err,
  });
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.defaultHeaders = options.defaultHeaders ?? { Accept: "application/json" };
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetch ?? fetch;
  }

  /**
   * Execute a single HTTP request with timeout, retry, and schema validation.
   *
   * Returns the validated domain model (when schema is provided) or raw
   * parsed JSON (when schema is omitted).
   */
  async request<T = unknown>(opts: ApiRequestOptions<T>): Promise<T> {
    const method: HttpMethod = opts.method ?? "GET";
    const timeoutMs = opts.timeoutMs ?? this.defaultTimeoutMs;
    const requestId = generateRequestId();
    const doFetch = opts.fetch ?? this.fetchImpl;

    const queryString = buildQueryString(opts.query).toString();
    const url = `${this.baseUrl}${opts.path}${queryString ? `?${queryString}` : ""}`;

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      "X-Request-Id": requestId,
      ...opts.headers,
    };

    if (opts.body !== undefined && method !== "GET" && method !== "HEAD") {
      headers["Content-Type"] = "application/json";
    }

    const body = opts.body !== undefined ? JSON.stringify(opts.body) : undefined;

    let lastError: unknown;
    const maxAttempts = opts.noRetry ? 1 : RETRY_CONFIG.maxRetries + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const { signal, cleanup } = mergeSignals(opts.signal, timeoutMs);

      try {
        const response = await doFetch(url, {
          method,
          headers,
          body,
          signal,
        });
        cleanup();

        // Non-2xx → HTTP error
        if (!response.ok) {
          const retryAfter = response.headers.get("Retry-After");
          const error = new ApiError({
            kind: "http",
            message: `HTTP ${response.status} ${response.statusText}`.trim(),
            status: response.status,
            method,
            url,
            requestId,
            retriable: response.status === 408 || response.status === 429 || response.status >= 500,
          });

          if (attempt < maxAttempts - 1 && isRetriableError(error, method)) {
            const delay = computeRetryDelay(attempt, retryAfter);
            await sleep(delay, opts.signal);
            lastError = error;
            continue;
          }

          throw error;
        }

        // 2xx — parse body
        const parsed = await parseJsonSafe(response);
        if (!parsed.ok) {
          throw new ApiError({
            kind: "validation",
            message: parsed.error,
            method,
            url,
            requestId,
            retriable: false,
          });
        }

        // Schema validation (Zod)
        if (opts.schema) {
          const result = opts.schema.safeParse(parsed.data);
          if (!result.success) {
            throw new ApiError({
              kind: "validation",
              message: `Response validation failed: ${result.error.issues.map((i: { path: PropertyKey[]; message: string }) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
              method,
              url,
              requestId,
              retriable: false,
              details: result.error.issues,
            });
          }
          return result.data as T;
        }

        return parsed.data as T;
      } catch (err) {
        cleanup();

        // Already an ApiError (from above) — rethrow if not retriable
        if (err instanceof ApiError) {
          if (err.kind === "aborted") throw err;
          if (err.kind === "validation" || err.kind === "configuration") throw err;

          if (attempt < maxAttempts - 1 && isRetriableError(err, method)) {
            lastError = err;
            const delay = computeRetryDelay(attempt);
            try {
              await sleep(delay, opts.signal);
            } catch (sleepErr) {
              throw sleepErr;
            }
            continue;
          }
          throw err;
        }

        // Raw fetch error — classify it
        if (err instanceof Error && err.name === "AbortError") {
          const timedOut = signal?.aborted === true && signal?.reason instanceof DOMException && signal.reason.name === "TimeoutError";
          throw classifyAbortError(err, timedOut);
        }

        // Network error (DNS, refused, offline)
        const networkError = new ApiError({
          kind: "network",
          message: err instanceof Error ? err.message : String(err),
          method,
          url,
          requestId,
          retriable: true,
          cause: err,
        });

        if (attempt < maxAttempts - 1 && isRetriableError(networkError, method)) {
          lastError = networkError;
          const delay = computeRetryDelay(attempt);
          try {
            await sleep(delay, opts.signal);
          } catch (sleepErr) {
            throw sleepErr;
          }
          continue;
        }

        throw networkError;
      }
    }

    // Should not reach here, but satisfy TypeScript
    throw lastError ?? new ApiError({
      kind: "network",
      message: "Request failed after retries",
      method,
      url,
      requestId,
      retriable: false,
    });
  }
}

// Attach isApiError as a static for convenience
export { ApiError } from "./api-error.ts";
