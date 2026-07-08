/**
 * Server-only Pathway API client for the web app.
 *
 * Creates a singleton client configured with the Strapi URL from env.
 * Must never be imported by client components — it reads server env and
 * makes direct fetch calls to the CMS.
 *
 * The timeout is set to 5s (below the shared package default of 12s) so
 * that build-time data fetching (sitemap, generateStaticParams) fails
 * fast when the CMS is unreachable. The slug helpers catch the error
 * and return empty arrays, and the sitemap falls back to static entries.
 * Without this, a 12s timeout × 3 retries × multiple fetches exceeds
 * Next.js's 60s build page-generation limit and the build fails.
 * 5s × 4 attempts + retry delays ≈ 22s per fetch, well under 60s.
 */

import "server-only";
import { createPathwayApiClient, type PathwayApiClient } from "@pathway/api";
import { getStrapiUrl } from "./env";

let client: PathwayApiClient | null = null;

export function getPathwayApiClient(): PathwayApiClient {
  if (!client) {
    client = createPathwayApiClient({
      baseUrl: getStrapiUrl(),
      defaultTimeoutMs: 5_000,
    });
  }
  return client;
}
