/**
 * Server-only environment helper for the web app.
 *
 * Reads STRAPI_URL and SITE_URL on the server only — never exposed to
 * the browser. Throws a clear error in development if a required
 * variable is missing.
 */

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getStrapiUrl(): string {
  const url = process.env.STRAPI_URL;
  if (!url) {
    throw new Error(
      "STRAPI_URL is not set. Add it to .env.local (see .env.example).",
    );
  }
  return normalizeUrl(url);
}

/**
 * Public site URL used for canonical URLs and Open Graph metadata.
 *
 * Falls back to a localhost URL in development so metadata generation
 * never crashes when SITE_URL is absent. In production, SITE_URL must
 * be set to the real public origin (e.g. https://pathway.example.com).
 */
export function getSiteUrl(): string {
  const url = process.env.SITE_URL;
  if (!url) {
    // ponytail: dev-only fallback. Ceiling: og:url/canonical point at
    // localhost in dev — harmless locally, must be overridden via SITE_URL
    // in production. Upgrade path: require SITE_URL in non-dev envs.
    return "http://localhost:3000";
  }
  return normalizeUrl(url);
}
