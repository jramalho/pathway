/**
 * Public environment helper for the Expo mobile app.
 *
 * Reads EXPO_PUBLIC_STRAPI_URL at build time (Expo inlines EXPO_PUBLIC_* vars).
 * Must use dot notation (process.env.EXPO_PUBLIC_*) for Expo to inline it.
 */

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getStrapiUrl(): string {
  const url = process.env.EXPO_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error(
      "EXPO_PUBLIC_STRAPI_URL is not set. Add it to .env (see .env.example).",
    );
  }
  return normalizeUrl(url);
}
