/**
 * Thrown when the Strapi server returns a non-2xx HTTP response.
 *
 * Does NOT include the response body in the message (may be large/sensitive).
 * Validation failures (2xx + bad payload) are handled by PathwayApiValidationError.
 */
export class PathwayApiHttpError extends Error {
  readonly status: number;
  readonly resource: string;

  constructor(resource: string, status: number, message: string) {
    super(`${resource}: HTTP ${status} — ${message}`);
    this.name = "PathwayApiHttpError";
    this.status = status;
    this.resource = resource;
    Object.setPrototypeOf(this, PathwayApiHttpError.prototype);
  }
}
