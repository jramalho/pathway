/**
 * Server-only environment helper for the web app.
 *
 * Reads STRAPI_URL on the server only — never exposed to the browser.
 * Throws a clear error in development if the variable is missing.
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
