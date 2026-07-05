/**
 * Shared API boundary for Pathway.
 *
 * Consumed by both `@pathway/web` (Next.js) and `@pathway/mobile` (Expo).
 * Source-only package — no build step; bundlers transpile on consume.
 *
 * Public surface:
 *   - ApiClient: fetch-based HTTP client with timeout, retry, schema validation
 *   - ApiError: normalized error class with kind discriminator
 *   - createPathwayApiClient: factory with typed resource functions
 *   - Domain models: LearningPath, LessonPreview, etc.
 *   - Schemas and mappers (for testing)
 *   - Media URL helper
 */

// Client factory and types.
export {
  createPathwayApiClient,
  type PathwayApiClient,
  type CreatePathwayApiClientOptions,
} from "./client/create-pathway-api-client.ts";

// ApiClient (low-level).
export {
  ApiClient,
  type ApiClientOptions,
} from "./client/api-client.ts";

// ApiError and error utilities.
export {
  ApiError,
  isApiError,
  serializeApiError,
  toUserFacingError,
  USER_FACING_MESSAGES,
} from "./client/api-error.ts";
export type {
  ApiErrorKind,
  SerializedApiError,
  UserFacingErrorKind,
} from "./types/errors.ts";

// Request types.
export type {
  HttpMethod,
  QueryParams,
  ApiRequestOptions,
} from "./types/api.ts";

// Media URL helper.
export { resolveStrapiMediaUrl } from "./client/resolve-strapi-media-url.ts";

// Domain models (camelCase, Strapi-agnostic).
export type {
  ContentImage,
  Difficulty,
  LearningPath,
  LearningPathCategory,
  LearningPathModule,
  LessonPreview,
} from "./domain/learning-path.ts";

// Full lesson detail model (body, author, category, media).
export type {
  Author,
  Category,
  LessonBodyBlock,
  LessonDetail,
} from "./domain/lesson.ts";

// Schemas (for testing / advanced use).
export {
  learningPathResponseSchema,
  learningPathListResponseSchema,
} from "./strapi/learning-path.schema.ts";

// Parsers: take `unknown`, validate with Zod, return clean domain models.
export {
  parseLearningPathResponse,
  parseLearningPathListResponse,
} from "./strapi/learning-path.parser.ts";

// Legacy error classes (backward compatibility — prefer ApiError).
export { PathwayApiValidationError } from "./errors/pathway-api-validation-error.ts";
export { PathwayApiHttpError } from "./errors/pathway-api-http-error.ts";
export { PathwayApiNetworkError } from "./errors/pathway-api-network-error.ts";

/** Package version (temporary technical-validation export). */
export const pathwayApiPackageVersion = "0.2.0";
