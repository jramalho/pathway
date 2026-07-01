/**
 * Pathway API client for the mobile app.
 *
 * Creates a singleton client configured with the Strapi URL from env.
 * Uses the same @pathway/api package as the web app — no direct Strapi access.
 */

import { createPathwayApiClient, type PathwayApiClient } from "@pathway/api";
import { getStrapiUrl } from "./env";

let client: PathwayApiClient | null = null;

export function getPathwayApiClient(): PathwayApiClient {
  if (!client) {
    client = createPathwayApiClient({ baseUrl: getStrapiUrl() });
  }
  return client;
}
