/**
 * Zod schemas modeling the REAL Strapi 5 REST response for a single Lesson.
 *
 * Strapi 5 response format:
 *  - Flat: attributes are direct on `data` (no `data.attributes` wrapper).
 *  - `body` is a richtext field — Strapi returns it as a JSON array of blocks.
 *  - `author` and `category` are manyToOne relations — bare object or null.
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

// --- Rich text blocks (Strapi blocks format) ---

const textBlock = z.object({
  type: z.literal("text"),
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  code: z.boolean().optional(),
});

const paragraphBlock = z.object({
  type: z.literal("paragraph"),
  children: z.array(textBlock),
});

const headingBlock = z.object({
  type: z.literal("heading"),
  level: z.number().int(),
  children: z.array(textBlock),
});

const listItemChild = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const listItemBlock = z.object({
  type: z.literal("list-item"),
  children: z.array(listItemChild),
});

const listBlock = z.object({
  type: z.literal("list"),
  ordered: z.boolean(),
  children: z.array(listItemBlock),
});

const quoteBlock = z.object({
  type: z.literal("quote"),
  children: z.array(textBlock),
});

const codeBlock = z.object({
  type: z.literal("code"),
  language: z.string().nullable().optional(),
  children: z.array(textBlock),
});

const linkBlock = z.object({
  type: z.literal("link"),
  url: z.string(),
  children: z.array(textBlock),
});

export const bodyBlockSchema = z.union([
  paragraphBlock,
  headingBlock,
  listBlock,
  quoteBlock,
  codeBlock,
  linkBlock,
]);

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

// --- Lesson document ---

const lessonDocumentSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  body: z.array(bodyBlockSchema),
  estimatedDurationMinutes: z.number().int(),
  difficulty: difficultyEnum,
  videoUrl: z.string().nullable().optional(),
  videoThumbnail: mediaSchema.optional(),
  author: authorSchema.optional(),
  category: categorySchema.optional(),
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
