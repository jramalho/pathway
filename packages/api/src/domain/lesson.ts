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

/** A single block in a rich-text body (Strapi blocks format). */
export type LessonBodyBlock =
  | { type: "paragraph"; children: Array<{ type: "text"; text: string; bold?: boolean; italic?: boolean; code?: boolean }> }
  | { type: "heading"; level: number; children: Array<{ type: "text"; text: string }> }
  | { type: "list"; ordered: boolean; children: Array<{ type: "list-item"; children: Array<{ type: "text"; text: string }> }> }
  | { type: "quote"; children: Array<{ type: "text"; text: string }> }
  | { type: "code"; language?: string; children: Array<{ type: "text"; text: string }> }
  | { type: "link"; url: string; children: Array<{ type: "text"; text: string }> };

/** Full lesson detail with body, media, author, and category. */
export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: LessonBodyBlock[];
  estimatedDuration: number;
  difficulty: Difficulty;
  videoUrl: string | null;
  videoThumbnail: ContentImage | null;
  author: Author | null;
  category: Category | null;
  publishedAt: string | null;
}
