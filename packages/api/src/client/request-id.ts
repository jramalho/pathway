/**
 * Request ID generation.
 *
 * Generates a short, unique ID per request for observability and
 * log correlation. Not a security token — just a trace identifier.
 */

let counter = 0;

export function generateRequestId(): string {
  counter = (counter + 1) % 100000;
  return `pw_${Date.now().toString(36)}_${counter.toString(36)}`;
}
