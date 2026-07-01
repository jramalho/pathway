/**
 * Mapper: converts validated Strapi documents into internal domain models.
 *
 * This is the ONLY module in the package that knows Strapi payload details
 * (documentId, relation wrappers, media shape). Domain models stay clean.
 */

import type {
  ContentImage,
  Difficulty,
  LearningPath,
  LearningPathModule,
  LessonPreview,
} from "../domain/learning-path.ts";
import type {
  StrapiLearningPathDocument,
  StrapiModule,
  StrapiLesson,
} from "./learning-path.schema.ts";

// ---------------------------------------------------------------------------
// Leaf mappers
// ---------------------------------------------------------------------------

function mapMedia(raw: StrapiLearningPathDocument["coverImage"]): ContentImage | null {
  if (!raw) return null;
  return {
    url: raw.url,
    alternativeText: raw.alternativeText ?? null,
    width: raw.width ?? null,
    height: raw.height ?? null,
  };
}

function mapLesson(raw: StrapiLesson): LessonPreview {
  return {
    id: raw.documentId,
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary,
    estimatedDuration: raw.estimatedDurationMinutes,
    difficulty: raw.difficulty as Difficulty,
  };
}

function mapModule(raw: StrapiModule): LearningPathModule {
  const lessons = raw.lessons ?? [];
  return {
    id: raw.documentId,
    title: raw.title,
    description: raw.description ?? null,
    order: raw.order,
    lessons: lessons.map(mapLesson),
  };
}

// ---------------------------------------------------------------------------
// Document mapper
// ---------------------------------------------------------------------------

export function mapLearningPath(raw: StrapiLearningPathDocument): LearningPath {
  const modules = (raw.modules ?? []).map(mapModule);
  // lessonCount is derived from the populated modules tree. Reliable only when
  // modules + their lessons are populated; if populate omitted them, count is 0.
  const lessonCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return {
    id: raw.documentId,
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    featured: raw.featured,
    difficulty: raw.difficulty as Difficulty,
    estimatedDuration: raw.estimatedDurationMinutes,
    coverImage: mapMedia(raw.coverImage),
    modules,
    lessonCount,
  };
}
