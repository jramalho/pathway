/**
 * Thrown when fetch fails to connect (DNS, refused, offline, etc.).
 *
 * AbortError is NOT converted to this — it is re-thrown as-is so callers
 * can distinguish cancellation from real network failures.
 */
export class PathwayApiNetworkError extends Error {
  readonly resource: string;

  constructor(resource: string, message: string) {
    super(`${resource}: network error — ${message}`);
    this.name = "PathwayApiNetworkError";
    this.resource = resource;
    Object.setPrototypeOf(this, PathwayApiNetworkError.prototype);
  }
}
