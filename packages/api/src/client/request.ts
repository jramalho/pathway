/**
 * Low-level HTTP request helper for Strapi.
 *
 * Uses native fetch (or an injected implementation for testing).
 * Handles HTTP status, network errors, and abort — but does NOT
 * validate or parse the response body. That is the caller's job.
 */

import { PathwayApiHttpError } from "../errors/pathway-api-http-error.ts";
import { PathwayApiNetworkError } from "../errors/pathway-api-network-error.ts";

/** Minimal fetch signature — accepts the global fetch or a mock. */
export type FetchLike = typeof fetch;

export interface RequestOptions {
  signal?: AbortSignal;
  fetch?: FetchLike;
}

/**
 * Fetch JSON from a full URL. Returns parsed JSON as `unknown`.
 *
 * - Non-2xx → PathwayApiHttpError (body not included in message).
 * - Connection failure → PathwayApiNetworkError.
 * - AbortError → re-thrown as-is (not wrapped).
 */
export async function fetchJson(
  url: string,
  resource: string,
  options: RequestOptions = {},
): Promise<unknown> {
  const doFetch = options.fetch ?? fetch;

  let response: Response;
  try {
    response = await doFetch(url, {
      headers: { Accept: "application/json" },
      signal: options.signal,
    });
  } catch (err) {
    // AbortError must propagate as-is so callers can detect cancellation.
    if (err instanceof Error && err.name === "AbortError") {
      throw err;
    }
    throw new PathwayApiNetworkError(
      resource,
      err instanceof Error ? err.message : String(err),
    );
  }

  if (!response.ok) {
    throw new PathwayApiHttpError(
      resource,
      response.status,
      response.statusText || "request failed",
    );
  }

  return response.json();
}
