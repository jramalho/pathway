/**
 * Mapper: converts validated Strapi lesson documents into LessonDetail domain models.
 */

import type {
  Author,
  Category,
  LessonBodyBlock,
  LessonDetail,
} from "../domain/lesson.ts";
import type { ContentImage, Difficulty } from "../domain/learning-path.ts";
import type { StrapiLessonDocument } from "./lesson.schema.ts";

function mapMedia(raw: { url: string; alternativeText?: string | null; width?: number | null; height?: number | null } | null | undefined): ContentImage | null {
  if (!raw) return null;
  return {
    url: raw.url,
    alternativeText: raw.alternativeText ?? null,
    width: raw.width ?? null,
    height: raw.height ?? null,
  };
}

function mapAuthor(raw: StrapiLessonDocument["author"]): Author | null {
  if (!raw) return null;
  return {
    id: raw.documentId,
    name: raw.name,
    shortBio: raw.shortBio ?? null,
    avatar: mapMedia(raw.avatar),
  };
}

function mapCategory(raw: StrapiLessonDocument["category"]): Category | null {
  if (!raw) return null;
  return {
    id: raw.documentId,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? null,
  };
}

export function mapLessonDetail(raw: StrapiLessonDocument): LessonDetail {
  return {
    id: raw.documentId,
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary,
    body: raw.body as LessonBodyBlock[],
    estimatedDuration: raw.estimatedDurationMinutes,
    difficulty: raw.difficulty as Difficulty,
    videoUrl: raw.videoUrl ?? null,
    videoThumbnail: mapMedia(raw.videoThumbnail),
    author: mapAuthor(raw.author),
    category: mapCategory(raw.category),
    publishedAt: raw.publishedAt ?? null,
  };
}
