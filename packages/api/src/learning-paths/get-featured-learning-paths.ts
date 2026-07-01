/**
 * Fetch published featured Learning Paths from Strapi.
 *
 * Uses server-side filter on `featured` (boolean field exists in the CMS schema).
 * Strapi 5 returns only published content by default on public endpoints.
 */

import type { LearningPath } from "../domain/learning-path.ts";
import { parseLearningPathListResponse } from "../strapi/learning-path.parser.ts";
import { fetchJson, type RequestOptions } from "../client/request.ts";
import {
  featuredFilterParams,
  learningPathPopulateParams,
  limitParams,
  mergeParams,
} from "./learning-path-queries.ts";

const RESOURCE = "LearningPath";

export function createGetFeaturedLearningPaths(baseUrl: string) {
  return async function getFeaturedLearningPaths(
    options?: RequestOptions & { limit?: number },
  ): Promise<LearningPath[]> {
    const { limit, ...requestOptions } = options ?? {};
    const paramsList = [
      learningPathPopulateParams(),
      featuredFilterParams(),
    ];
    if (limit !== undefined) {
      paramsList.push(limitParams(limit));
    }
    const params = mergeParams(...paramsList);
    const url = `${baseUrl}/api/learning-paths?${params.toString()}`;
    const json = await fetchJson(url, RESOURCE, requestOptions);
    return parseLearningPathListResponse(json);
  };
}
