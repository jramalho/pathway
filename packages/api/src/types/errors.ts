/**
 * Error type definitions for the API layer.
 */

export type ApiErrorKind =
  | "network"
  | "timeout"
  | "aborted"
  | "http"
  | "validation"
  | "configuration";

/** User-facing message keys — the UI maps these to localized strings. */
export type UserFacingErrorKind =
  | "network-unavailable"
  | "content-unavailable"
  | "not-found"
  | "forbidden"
  | "rate-limited"
  | "generic-error";

export interface SerializedApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  method?: string;
  url?: string;
  requestId?: string;
  retriable: boolean;
}
