/**
 * Shared API boundary for Pathway.
 *
 * Consumed by both `@pathway/web` (Next.js) and `@pathway/mobile` (Expo).
 * Source-only package — no build step; bundlers transpile on consume.
 *
 * Public surface: client factory, domain models, parsers, errors, media helper.
 * Strapi payload details (schemas, mappers, query helpers) are NOT exported.
 */

// Client factory and types.
export {
  createPathwayApiClient,
  type PathwayApiClient,
  type CreatePathwayApiClientOptions,
} from "./client/create-pathway-api-client.ts";

// Media URL helper.
export { resolveStrapiMediaUrl } from "./client/resolve-strapi-media-url.ts";

// Domain models (camelCase, Strapi-agnostic).
export type {
  ContentImage,
  Difficulty,
  LearningPath,
  LearningPathModule,
  LessonPreview,
} from "./domain/learning-path.ts";

// Parsers: take `unknown`, validate with Zod, return clean domain models.
export {
  parseLearningPathResponse,
  parseLearningPathListResponse,
} from "./strapi/learning-path.parser.ts";

// Errors.
export { PathwayApiValidationError } from "./errors/pathway-api-validation-error.ts";
export { PathwayApiHttpError } from "./errors/pathway-api-http-error.ts";
export { PathwayApiNetworkError } from "./errors/pathway-api-network-error.ts";

/** Package version (temporary technical-validation export). */
export const pathwayApiPackageVersion = "0.1.0";
