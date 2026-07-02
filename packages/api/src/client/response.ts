/**
 * Safe response body parsing.
 *
 * Handles: missing body, invalid JSON, empty body, and text fallback.
 */

/** Parse JSON safely — returns { ok, data } instead of throwing. */
export async function parseJsonSafe(response: Response): Promise<
  { ok: true; data: unknown } | { ok: false; error: string }
> {
  const text = await response.text();
  if (!text) return { ok: true, data: null };
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, error: "Invalid JSON in response body" };
  }
}
