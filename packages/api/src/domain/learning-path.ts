/**
 * Internal domain models for Pathway.
 *
 * These types are the only thing Expo and Next should know about.
 * They intentionally hide every detail of the Strapi payload shape
 * (documentId, data/attributes, relation wrappers, media format).
 *
 * Field names are camelCase regardless of the external payload convention.
 */

/** Image/media attached to content. URL is kept as Strapi returns it (relative). */
export interface ContentImage {
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
}

/** Difficulty levels shared by LearningPath and Lesson. */
export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Lightweight lesson view used inside a LearningPath tree. */
export interface LessonPreview {
  /** Stable document identifier from Strapi (documentId). */
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimatedDuration: number;
  difficulty: Difficulty;
}

/** A module grouping lessons within a learning path. */
export interface LearningPathModule {
  /** Stable document identifier from Strapi (documentId). */
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: LessonPreview[];
}

/** A structured learning path made of modules and lessons. */
export interface LearningPath {
  /**
   * Stable document identifier from Strapi (documentId).
   *
   * Chosen over the numeric `id` because documentId is stable across
   * environments/dumps while the integer id can differ. It is also the
   * identifier used by Strapi 5 REST routes (/api/learning-paths/:documentId).
   */
  id: string;
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  difficulty: Difficulty;
  /** Total estimated duration in minutes. */
  estimatedDuration: number;
  coverImage: ContentImage | null;
  modules: LearningPathModule[];
  /** Total count of lessons across all modules. */
  lessonCount: number;
}
