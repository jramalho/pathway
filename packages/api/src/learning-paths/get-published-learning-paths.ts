/**
 * Fetch all published Learning Paths from Strapi.
 *
 * Strapi 5 public endpoints return only published content by default
 * (draftAndPublish: true), so no explicit status filter is needed.
 */

import type { LearningPath } from "../domain/learning-path.ts";
import { parseLearningPathListResponse } from "../strapi/learning-path.parser.ts";
import { fetchJson, type RequestOptions } from "../client/request.ts";
import {
  learningPathPopulateParams,
  mergeParams,
} from "./learning-path-queries.ts";

const RESOURCE = "LearningPath";

export function createGetPublishedLearningPaths(baseUrl: string) {
  return async function getPublishedLearningPaths(
    options?: RequestOptions,
  ): Promise<LearningPath[]> {
    const params = learningPathPopulateParams();
    const url = `${baseUrl}/api/learning-paths?${params.toString()}`;
    const json = await fetchJson(url, RESOURCE, options);
    return parseLearningPathListResponse(json);
  };
}
