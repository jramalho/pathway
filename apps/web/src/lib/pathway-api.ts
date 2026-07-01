/**
 * Server-only Pathway API client for the web app.
 *
 * Creates a singleton client configured with the Strapi URL from env.
 * Must never be imported by client components — it reads server env and
 * makes direct fetch calls to the CMS.
 */

import "server-only";
import { createPathwayApiClient, type PathwayApiClient } from "@pathway/api";
import { getStrapiUrl } from "./env";

let client: PathwayApiClient | null = null;

export function getPathwayApiClient(): PathwayApiClient {
  if (!client) {
    client = createPathwayApiClient({ baseUrl: getStrapiUrl() });
  }
  return client;
}
