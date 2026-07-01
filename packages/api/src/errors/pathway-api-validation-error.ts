/**
 * Thrown when a raw Strapi payload does not match the expected contract.
 *
 * Network, HTTP and timeout errors are NOT represented here — they belong
 * to a later part. This error is only about contract/validation failures.
 */
export class PathwayApiValidationError extends Error {
  /** Which resource was being parsed when validation failed. */
  readonly resource: string;

  constructor(resource: string, message: string) {
    super(`${resource}: ${message}`);
    this.name = "PathwayApiValidationError";
    this.resource = resource;
    // Restore prototype chain after extending Error (TS/ES5 target quirk).
    Object.setPrototypeOf(this, PathwayApiValidationError.prototype);
  }
}
