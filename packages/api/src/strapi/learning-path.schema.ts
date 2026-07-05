/**
 * Zod schemas modeling the REAL Strapi 5 REST response for a LearningPath.
 *
 * Source of truth: apps/cms/src/api/{learning-path,module,lesson,category}/content-types/schema.json
 *
 * Strapi 5 response format (confirmed against docs.strapi.io):
 *  - Flat: attributes are direct on `data` (no `data.attributes` wrapper).
 *  - Each document has both `id` (integer) and `documentId` (string).
 *  - oneToMany relations populate as a bare array `[...]`; manyToOne as a bare object.
 *  - Media populates as a bare object (with url, name, width, height, alternativeText) or null.
 *  - Relations not populated come as null (manyToOne) or are absent (oneToMany).
 *
 * Only fields needed to build the LearningPath domain model are modeled.
 * Optional/nullable handling mirrors the CMS schema:
 *  - coverImage: media, not required -> null when absent.
 *  - module.description: text, not required -> may be missing or null.
 *  - lesson.videoUrl / videoThumbnail: not part of LessonPreview -> ignored.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

const difficultyEnum = z.enum(["beginner", "intermediate", "advanced"]);

/** A Strapi 5 media field, single, populated. Null when absent/not uploaded. */
const mediaSchema = z
  .object({
    url: z.string(),
    alternativeText: z.string().nullable().optional(),
    width: z.number().int().nullable().optional(),
    height: z.number().int().nullable().optional(),
  })
  .nullable();

/** Wrapper for oneToMany relations in Strapi 5: bare array `[...]`. */
function relationList<T extends z.ZodTypeAny>(item: T) {
  return z.array(item);
}

// ---------------------------------------------------------------------------
// Lesson (preview only — body/video are ignored on purpose)
// ---------------------------------------------------------------------------

const lessonSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  estimatedDurationMinutes: z.number().int(),
  difficulty: difficultyEnum,
});

// ---------------------------------------------------------------------------
// Module
// ---------------------------------------------------------------------------

const moduleSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  order: z.number().int(),
  // oneToMany: bare array. Empty/absent -> treated as no lessons.
  lessons: relationList(lessonSchema).optional(),
});

// ---------------------------------------------------------------------------
// Category (manyToOne relation on LearningPath)
// ---------------------------------------------------------------------------

const categorySchema = z.object({
  documentId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
}).nullable();

// ---------------------------------------------------------------------------
// LearningPath
// ---------------------------------------------------------------------------

const learningPathDocumentSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  coverImage: mediaSchema.optional(),
  difficulty: difficultyEnum,
  estimatedDurationMinutes: z.number().int(),
  featured: z.boolean(),
  // manyToOne: bare object or null. Optional because populate may omit it.
  category: categorySchema.optional(),
  // oneToMany: bare array. Optional because populate may omit it.
  modules: relationList(moduleSchema).optional(),
});

// ---------------------------------------------------------------------------
// Response envelopes
// ---------------------------------------------------------------------------

/** Single document response: { data: <document>, meta: {} }. */
export const learningPathResponseSchema = z.object({
  data: learningPathDocumentSchema,
  meta: z.unknown().optional(),
});

/** List response: { data: [...documents], meta: { pagination } }. */
export const learningPathListResponseSchema = z.object({
  data: z.array(learningPathDocumentSchema),
  meta: z.unknown().optional(),
});

// Inferred shapes (internal use only — not exported from the package entrypoint).
export type StrapiLearningPathDocument = z.infer<typeof learningPathDocumentSchema>;
export type StrapiModule = z.infer<typeof moduleSchema>;
export type StrapiLesson = z.infer<typeof lessonSchema>;
export type StrapiLearningPathCategory = z.infer<typeof categorySchema>;
