/**
 * Factory for the Pathway API client.
 *
 * Creates an ApiClient configured with the Strapi base URL and
 * exposes typed resource functions (learning paths, etc.).
 *
 * The package never reads process.env or platform-specific env vars.
 * Callers (Next.js, Expo) provide the Strapi base URL explicitly.
 */

import { ApiClient } from "./api-client.ts";
import { createLearningPathsResource, type LearningPathsResource } from "../resources/learning-paths.resource.ts";
import { createLessonsResource, type LessonsResource } from "../resources/lessons.resource.ts";

export interface PathwayApiClient {
  /** Low-level HTTP client (for advanced use / testing). */
  readonly http: ApiClient;
  /** Learning paths resource. */
  readonly learningPaths: LearningPathsResource;
  /** Lessons resource. */
  readonly lessons: LessonsResource;
  /** Backward-compatible methods (delegate to learningPaths resource). */
  getPublishedLearningPaths(options?: { signal?: AbortSignal; fetch?: typeof fetch }): Promise<import("../domain/learning-path.ts").LearningPath[]>;
  getFeaturedLearningPaths(options?: { signal?: AbortSignal; fetch?: typeof fetch; limit?: number }): Promise<import("../domain/learning-path.ts").LearningPath[]>;
  getLearningPathBySlug(slug: string, options?: { signal?: AbortSignal; fetch?: typeof fetch }): Promise<import("../domain/learning-path.ts").LearningPath | null>;
  /** Fetch a single published lesson by slug with full body, author, category. */
  getLessonBySlug(slug: string, options?: { signal?: AbortSignal; fetch?: typeof fetch }): Promise<import("../domain/lesson.ts").LessonDetail | null>;
}

export interface CreatePathwayApiClientOptions {
  /** Strapi base URL, e.g. "http://localhost:1337". Trailing slash is normalized. */
  baseUrl: string;
  /** Override fetch for testing. */
  fetch?: typeof fetch;
  /** Default timeout in ms. */
  defaultTimeoutMs?: number;
}

export function createPathwayApiClient(
  options: CreatePathwayApiClientOptions,
): PathwayApiClient {
  const http = new ApiClient({
    baseUrl: options.baseUrl,
    fetch: options.fetch,
    defaultTimeoutMs: options.defaultTimeoutMs,
  });

  const learningPaths = createLearningPathsResource(http);
  const lessons = createLessonsResource(http);

  return {
    http,
    learningPaths,
    lessons,
    getPublishedLearningPaths: (opts) => learningPaths.getPublished({ signal: opts?.signal }),
    getFeaturedLearningPaths: (opts) => learningPaths.getFeatured({ signal: opts?.signal, limit: opts?.limit }),
    getLearningPathBySlug: (slug, opts) => learningPaths.getBySlug(slug, { signal: opts?.signal }),
    getLessonBySlug: (slug, opts) => lessons.getBySlug(slug, { signal: opts?.signal }),
  };
}
