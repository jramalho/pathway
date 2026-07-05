/**
 * Full lesson domain model — includes body, media, author, and category.
 *
 * This extends LessonPreview with fields only available when fetching
 * a single lesson by slug (the list endpoint only returns preview fields).
 */

import type { ContentImage, Difficulty } from "./learning-path.ts";

/** Author of a lesson. */
export interface Author {
  id: string;
  name: string;
  shortBio: string | null;
  avatar: ContentImage | null;
}

/** Category of a lesson. */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

/**
 * The lesson body format.
 *
 * The Strapi `body` field is a richtext field configured with the default
 * Markdown editor. Strapi returns it as a plain Markdown string — not a
 * JSON array of structured blocks. The shared API boundary preserves it
 * as a string so consumers (web, mobile) can render it with their own
 * Markdown renderer. No raw HTML is assumed or injected.
 */
export type LessonBody = string;

/** Lightweight reference to the parent learning path of a lesson. */
export interface LessonLearningPathRef {
  id: string;
  title: string;
  slug: string;
  description: string | null;
}

/** Lightweight reference to the parent module of a lesson. */
export interface LessonModuleRef {
  id: string;
  title: string;
  description: string | null;
  order: number;
}

/** Full lesson detail with body, media, author, category, and path context. */
export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Lesson body as Markdown (Strapi richtext default editor). */
  body: LessonBody;
  estimatedDuration: number;
  difficulty: Difficulty;
  videoUrl: string | null;
  videoThumbnail: ContentImage | null;
  author: Author | null;
  category: Category | null;
  /** Parent learning path, when populated. Null when not requested/assigned. */
  learningPath: LessonLearningPathRef | null;
  /** Parent module, when populated. Null when not requested/assigned. */
  module: LessonModuleRef | null;
  publishedAt: string | null;
}
