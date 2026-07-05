/**
 * Zod schemas modeling the REAL Strapi 5 REST response for a single Lesson.
 *
 * Strapi 5 response format:
 *  - Flat: attributes are direct on `data` (no `data.attributes` wrapper).
 *  - `body` is a richtext field configured with the default Markdown editor —
 *    Strapi returns it as a plain Markdown string (not a JSON array of blocks).
 *  - `author`, `category`, `learningPath`, and `module` are manyToOne relations —
 *    bare object or null.
 *  - `videoThumbnail` is a media field — bare object or null.
 *  - `publishedAt` is a top-level field on the document.
 */

import { z } from "zod";

const difficultyEnum = z.enum(["beginner", "intermediate", "advanced"]);

const mediaSchema = z
  .object({
    url: z.string(),
    alternativeText: z.string().nullable().optional(),
    width: z.number().int().nullable().optional(),
    height: z.number().int().nullable().optional(),
  })
  .nullable();

// --- Author ---

const authorSchema = z.object({
  documentId: z.string(),
  name: z.string(),
  shortBio: z.string().nullable().optional(),
  avatar: mediaSchema.optional(),
}).nullable();

// --- Category ---

const categorySchema = z.object({
  documentId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
}).nullable();

// --- Learning path (manyToOne relation — populated on request) ---

const learningPathRefSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
}).nullable();

// --- Module (manyToOne relation — populated on request) ---

const moduleRefSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  order: z.number().int(),
}).nullable();

// --- Lesson document ---

const lessonDocumentSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  // body is Markdown (Strapi richtext default editor) — a plain string.
  body: z.string(),
  estimatedDurationMinutes: z.number().int(),
  difficulty: difficultyEnum,
  videoUrl: z.string().nullable().optional(),
  videoThumbnail: mediaSchema.optional(),
  author: authorSchema.optional(),
  category: categorySchema.optional(),
  learningPath: learningPathRefSchema.optional(),
  module: moduleRefSchema.optional(),
  publishedAt: z.string().nullable().optional(),
});

// --- Response envelopes ---

/** Single document response: { data: <document>, meta: {} }. */
export const lessonResponseSchema = z.object({
  data: lessonDocumentSchema,
  meta: z.unknown().optional(),
});

/** List response (used for slug filtering): { data: [...documents], meta: {} }. */
export const lessonListResponseSchema = z.object({
  data: z.array(lessonDocumentSchema),
  meta: z.unknown().optional(),
});

export type StrapiLessonDocument = z.infer<typeof lessonDocumentSchema>;
