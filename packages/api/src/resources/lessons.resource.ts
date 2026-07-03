/**
 * Lessons resource — typed API calls via ApiClient.
 *
 * Fetches a single lesson by slug with full body, author, category,
 * and media fields. Uses the Strapi lessons endpoint with populate.
 */

import { ApiClient } from "../client/api-client.ts";
import { lessonListResponseSchema } from "../strapi/lesson.schema.ts";
import { mapLessonDetail } from "../strapi/lesson.mapper.ts";
import type { LessonDetail } from "../domain/lesson.ts";
import type { QueryParams } from "../types/api.ts";

/** Populate tree for a full Lesson: videoThumbnail, author, category. */
const lessonPopulate: QueryParams = {
  "populate[0]": "videoThumbnail",
  "populate[1]": "author",
  "populate[2]": "author.avatar",
  "populate[3]": "category",
};

export function createLessonsResource(client: ApiClient) {
  return {
    /** Fetch a single published lesson by slug. Returns null if not found. */
    async getBySlug(slug: string, options?: { signal?: AbortSignal }): Promise<LessonDetail | null> {
      const trimmed = slug.trim();
      if (!trimmed) {
        throw new Error("slug must not be empty");
      }
      const query: QueryParams = {
        ...lessonPopulate,
        "filters[slug][$eq]": trimmed,
      };
      const data = await client.request({
        method: "GET",
        path: "/api/lessons",
        query,
        schema: lessonListResponseSchema,
        signal: options?.signal,
      });
      const lessons = data.data.map(mapLessonDetail);
      if (lessons.length === 0) return null;
      return lessons[0];
    },
  };
}

export type LessonsResource = ReturnType<typeof createLessonsResource>;
