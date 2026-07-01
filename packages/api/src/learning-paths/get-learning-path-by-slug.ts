/**
 * Fetch a single published Learning Path by slug from Strapi.
 *
 * Strapi 5 has no native slug endpoint, so we filter the list endpoint
 * by slug and expect exactly one result. Returns null if none found.
 * Throws if more than one published path shares the same slug (data integrity
 * issue — slug is unique in the CMS schema, so this should never happen).
 */

import type { LearningPath } from "../domain/learning-path.ts";
import { parseLearningPathListResponse } from "../strapi/learning-path.parser.ts";
import { PathwayApiValidationError } from "../errors/pathway-api-validation-error.ts";
import { fetchJson, type RequestOptions } from "../client/request.ts";
import {
  learningPathPopulateParams,
  mergeParams,
  slugFilterParams,
} from "./learning-path-queries.ts";

const RESOURCE = "Invalid Strapi response while parsing LearningPath";

/** Normalize and validate a slug before querying. */
function normalizeSlug(slug: string): string {
  const trimmed = slug.trim();
  if (!trimmed) {
    throw new PathwayApiValidationError(RESOURCE, "slug must not be empty");
  }
  return trimmed;
}

export function createGetLearningPathBySlug(baseUrl: string) {
  return async function getLearningPathBySlug(
    slug: string,
    options?: RequestOptions,
  ): Promise<LearningPath | null> {
    const normalized = normalizeSlug(slug);
    const params = mergeParams(
      learningPathPopulateParams(),
      slugFilterParams(normalized),
    );
    const url = `${baseUrl}/api/learning-paths?${params.toString()}`;
    const json = await fetchJson(url, RESOURCE, options);
    const paths = parseLearningPathListResponse(json);

    if (paths.length === 0) return null;
    if (paths.length > 1) {
      throw new PathwayApiValidationError(
        RESOURCE,
        `expected at most 1 LearningPath for slug "${normalized}", got ${paths.length}`,
      );
    }
    return paths[0];
  };
}
