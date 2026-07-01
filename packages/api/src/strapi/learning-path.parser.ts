/**
 * Parser entrypoints: take a raw `unknown` payload, validate it with Zod,
 * and return clean domain models. Throws PathwayApiValidationError on
 * contract mismatch.
 */

import { PathwayApiValidationError } from "../errors/pathway-api-validation-error.ts";
import type { LearningPath } from "../domain/learning-path.ts";
import {
  learningPathListResponseSchema,
  learningPathResponseSchema,
} from "./learning-path.schema.ts";
import { mapLearningPath } from "./learning-path.mapper.ts";

const RESOURCE = "Invalid Strapi response while parsing LearningPath";

/** Parse a single-document Strapi response into a LearningPath. */
export function parseLearningPathResponse(payload: unknown): LearningPath {
  const result = learningPathResponseSchema.safeParse(payload);
  if (!result.success) {
    throw new PathwayApiValidationError(
      RESOURCE,
      result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    );
  }
  return mapLearningPath(result.data.data);
}

/** Parse a list Strapi response into an array of LearningPath. */
export function parseLearningPathListResponse(payload: unknown): LearningPath[] {
  const result = learningPathListResponseSchema.safeParse(payload);
  if (!result.success) {
    throw new PathwayApiValidationError(
      RESOURCE,
      result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    );
  }
  return result.data.data.map(mapLearningPath);
}
