/**
 * Shared API type definitions.
 */

import type { z } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

/** Query parameters — values are string | number | boolean | string[] | null. */
export type QueryParams = Record<string, string | number | boolean | string[] | null | undefined>;

/** A Zod schema (or any object with safeParse). */
export interface SchemaLike<T = unknown> {
  safeParse(data: unknown): { success: true; data: T } | { success: false; error: { issues: Array<{ path: PropertyKey[]; message: string }> } };
}

/** Request options for ApiClient.request(). */
export interface ApiRequestOptions<T = unknown> {
  method?: HttpMethod;
  path: string;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Zod schema to validate the response body. When omitted, raw JSON is returned. */
  schema?: SchemaLike<T>;
  /** Disable retry for this request (default: false). */
  noRetry?: boolean;
  /** Override the fetch implementation (testing). */
  fetch?: typeof fetch;
}

/** Re-export Zod type for convenience. */
export type { z };
