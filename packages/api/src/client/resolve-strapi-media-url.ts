/**
 * Resolve a Strapi media URL against a base URL.
 *
 * Strapi returns media URLs as relative paths (e.g. "/uploads/cover.jpg").
 * This helper resolves them against the Strapi base URL so clients can
 * render images without knowing the CMS origin.
 *
 * - Absolute URLs (http/https) are preserved as-is.
 * - Relative URLs are joined with baseUrl.
 * - null stays null.
 *
 * Not applied automatically in the mapper — the domain model stays
 * environment-agnostic. Callers resolve at render time.
 */
export function resolveStrapiMediaUrl(
  mediaUrl: string | null,
  baseUrl: string,
): string | null {
  if (mediaUrl === null) return null;
  if (!mediaUrl) return null;

  // Already absolute — preserve.
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;

  // Relative — join with normalized baseUrl (no trailing slash).
  const base = baseUrl.replace(/\/+$/, "");
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`;
  return `${base}${path}`;
}
