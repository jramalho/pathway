/**
 * Learning Paths resource — typed API calls via ApiClient.
 *
 * These functions are the only way screens/hooks should fetch
 * learning path data. They build the URL, query params, and pass
 * the Zod schema to the ApiClient for boundary validation.
 */

import { ApiClient } from "../client/api-client.ts";
import {
  learningPathListResponseSchema,
} from "../strapi/learning-path.schema.ts";
import { mapLearningPath } from "../strapi/learning-path.mapper.ts";
import type { LearningPath } from "../domain/learning-path.ts";
import type { QueryParams } from "../types/api.ts";

/** Populate tree for a full LearningPath: cover + modules + lessons. */
const learningPathPopulate: QueryParams = {
  "populate[0]": "coverImage",
  "populate[1]": "modules",
  "populate[modules][populate][0]": "lessons",
};

export function createLearningPathsResource(client: ApiClient) {
  return {
    /** Fetch all published learning paths. */
    async getPublished(options?: { signal?: AbortSignal }): Promise<LearningPath[]> {
      const data = await client.request({
        method: "GET",
        path: "/api/learning-paths",
        query: learningPathPopulate,
        schema: learningPathListResponseSchema,
        signal: options?.signal,
      });
      return data.data.map(mapLearningPath);
    },

    /** Fetch featured learning paths (optionally limited). */
    async getFeatured(options?: { signal?: AbortSignal; limit?: number }): Promise<LearningPath[]> {
      const query: QueryParams = {
        ...learningPathPopulate,
        "filters[featured][$eq]": "true",
      };
      if (options?.limit !== undefined) {
        query["pagination[pageSize]"] = options.limit;
      }
      const data = await client.request({
        method: "GET",
        path: "/api/learning-paths",
        query,
        schema: learningPathListResponseSchema,
        signal: options?.signal,
      });
      return data.data.map(mapLearningPath);
    },

    /** Fetch a single learning path by slug. Returns null if not found. */
    async getBySlug(slug: string, options?: { signal?: AbortSignal }): Promise<LearningPath | null> {
      const trimmed = slug.trim();
      if (!trimmed) {
        throw new Error("slug must not be empty");
      }
      const query: QueryParams = {
        ...learningPathPopulate,
        "filters[slug][$eq]": trimmed,
      };
      const data = await client.request({
        method: "GET",
        path: "/api/learning-paths",
        query,
        schema: learningPathListResponseSchema,
        signal: options?.signal,
      });
      const paths = data.data.map(mapLearningPath);
      if (paths.length === 0) return null;
      return paths[0];
    },
  };
}

export type LearningPathsResource = ReturnType<typeof createLearningPathsResource>;
