/**
 * Server-only environment helper for the web app.
 *
 * Reads STRAPI_URL and the public site URL on the server only — never
 * exposed to the browser. Throws a clear error in development if a
 * required variable is missing.
 */

/**
 * Normalize a URL origin: trim trailing slashes and collapse accidental
 * double slashes in the path portion so generated canonical/sitemap URLs
 * never carry malformed `//` segments.
 *
 * Only the origin/path is normalized — query strings and fragments are
 * preserved (none are expected here, but the guard is cheap and correct).
 */
function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  // Strip trailing slashes (keep a lone root "/" if the URL is just the origin).
  const noTrailing = trimmed.replace(/\/+$/, "") || "/";
  // Collapse repeated slashes in the path, but never the protocol "://".
  return noTrailing.replace(/([^:])\/{2,}/g, "$1/");
}

/**
 * Validate that a string is a well-formed absolute http(s) URL.
 * Returns the normalized URL, or null when malformed.
 */
function validateAbsoluteUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return normalizeUrl(parsed.origin);
  } catch {
    return null;
  }
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

const DEV_SITE_URL = "http://localhost:3000";

/**
 * Public site URL used for canonical URLs, Open Graph metadata, sitemap,
 * and robots.txt.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL` (preferred — usable on both server and client
 *      if ever needed; documented in `.env.example`).
 *   2. `SITE_URL` (legacy server-only variable, kept for compatibility).
 *   3. `http://localhost:3000` (dev-only fallback).
 *
 * In production (`NODE_ENV === "production"`), a localhost fallback is
 * rejected so we never emit localhost canonicals in a deployed build —
 * the missing variable is surfaced as a thrown error at the call site.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "";

  if (raw) {
    const validated = validateAbsoluteUrl(raw);
    if (validated) return validated;
    // Malformed URL — fall through to dev fallback in dev, fail in prod.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `SITE_URL is set but not a valid absolute http(s) URL: ${raw}`,
      );
    }
    // ponytail: dev-only — warn and fall back so a typo doesn't break local dev.
    // Ceiling: canonicals point at localhost until fixed. Upgrade path: fix env.
    console.warn(`[Pathway] Invalid SITE_URL "${raw}" — falling back to localhost.`);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL (or SITE_URL) must be set to the public origin in production.",
    );
  }

  // ponytail: dev-only fallback. Ceiling: og:url/canonical point at
  // localhost in dev — harmless locally, must be overridden via
  // NEXT_PUBLIC_SITE_URL in production. Upgrade path: require it in non-dev.
  return DEV_SITE_URL;
}
