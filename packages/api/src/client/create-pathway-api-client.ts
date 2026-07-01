/**
 * Factory for the Pathway API client.
 *
 * The package never reads process.env or platform-specific env vars.
 * Callers (Next.js, Expo) provide the Strapi base URL explicitly.
 *
 * Usage:
 *   const pathwayApi = createPathwayApiClient({ baseUrl: "http://localhost:1337" });
 *   const paths = await pathwayApi.getPublishedLearningPaths();
 */

import { createGetPublishedLearningPaths } from "../learning-paths/get-published-learning-paths.ts";
import { createGetFeaturedLearningPaths } from "../learning-paths/get-featured-learning-paths.ts";
import { createGetLearningPathBySlug } from "../learning-paths/get-learning-path-by-slug.ts";

export interface PathwayApiClient {
  getPublishedLearningPaths(options?: {
    signal?: AbortSignal;
    fetch?: typeof fetch;
  }): Promise<import("../domain/learning-path.ts").LearningPath[]>;
  getFeaturedLearningPaths(options?: {
    signal?: AbortSignal;
    fetch?: typeof fetch;
    limit?: number;
  }): Promise<import("../domain/learning-path.ts").LearningPath[]>;
  getLearningPathBySlug(
    slug: string,
    options?: { signal?: AbortSignal; fetch?: typeof fetch },
  ): Promise<import("../domain/learning-path.ts").LearningPath | null>;
}

export interface CreatePathwayApiClientOptions {
  /** Strapi base URL, e.g. "http://localhost:1337". Trailing slash is normalized. */
  baseUrl: string;
}

/** Normalize base URL: ensure no trailing slash. */
function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function createPathwayApiClient(
  options: CreatePathwayApiClientOptions,
): PathwayApiClient {
  const baseUrl = normalizeBaseUrl(options.baseUrl);

  return {
    getPublishedLearningPaths: createGetPublishedLearningPaths(baseUrl),
    getFeaturedLearningPaths: createGetFeaturedLearningPaths(baseUrl),
    getLearningPathBySlug: createGetLearningPathBySlug(baseUrl),
  };
}
