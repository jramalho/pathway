import "server-only";
import { getPathwayApiClient } from "./pathway-api";
import { getStrapiUrl } from "./env";
import { resolveStrapiMediaUrl, type Difficulty } from "@pathway/api";
import type { LearningPath, LessonPreview, ContentImage } from "@pathway/api";

/**
 * Server-side Explore data composition layer.
 *
 * Fetches published Strapi content via the shared `@pathway/api` client
 * and maps it into a compact, Explore-shaped view model. Visual
 * components receive this serialized model — they never touch Strapi
 * domain models or raw API responses directly.
 *
 * Data selection:
 *   - Learning paths: all published paths via `getPublishedLearningPaths`.
 *     The shared API already populates modules + lessons, so the full
 *     tree is available. We surface listing fields only (title, slug,
 *     description, cover, difficulty, duration, lesson count).
 *   - Lessons: derived from the learning-path tree (each module's
 *     lessons). The shared API package does not expose a standalone
 *     published-lessons listing endpoint, so we do not invent one.
 *     Each lesson carries its parent learning-path slug + title for
 *     context. This is a V1 choice documented for future work.
 *   - Topics/categories: the shared API does not expose a category
 *     listing endpoint, and the learning-path list populate tree does
 *     not include the `category` relation. We therefore do not surface
 *     real category/topic references in V1. Topic filtering is handled
 *     by keyword matching against real text fields (see
 *     `explore-filters.ts`). When the shared API exposes categories,
 *     this layer can be extended without changing the UI contract.
 *
 * Revalidation: the Explore route exports `revalidate = 300` (5 minutes),
 * matching the homepage convention.
 */

export interface ExplorePathItem {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  /** Total estimated duration in minutes. */
  estimatedDuration: number;
  /** Real lesson count derived from the populated modules tree. */
  lessonCount: number;
  /** Resolved cover image URL (absolute), or null. */
  coverImageUrl: string | null;
  coverImageAlt: string | null;
}

export interface ExploreLessonItem {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  /** Estimated duration in minutes. */
  estimatedDuration: number;
  /** Parent learning-path slug (for future linking). */
  pathSlug: string;
  /** Parent learning-path title (for context). */
  pathTitle: string;
}

export interface ExploreData {
  paths: ExplorePathItem[];
  lessons: ExploreLessonItem[];
}

/** A topic option derived from the published content (canonical fallback). */
export interface ExploreTopic {
  slug: string;
  label: string;
}

/**
 * Compose Explore data from published Strapi content.
 *
 * Returns a `status` discriminator so the page can distinguish a
 * successful empty response (no published content) from a failed
 * request. The caller decides how to render each case.
 */
export async function getExploreContent(options?: {
  signal?: AbortSignal;
}): Promise<
  | { status: "ok"; data: ExploreData }
  | { status: "empty"; data: ExploreData }
  | { status: "error"; error: Error }
> {
  const api = getPathwayApiClient();
  const strapiBaseUrl = getStrapiUrl();

  let publishedPaths: LearningPath[];
  try {
    publishedPaths = await api.getPublishedLearningPaths({
      signal: options?.signal,
    });
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }

  if (publishedPaths.length === 0) {
    return {
      status: "empty",
      data: { paths: [], lessons: [] },
    };
  }

  const paths: ExplorePathItem[] = publishedPaths.map((path) => ({
    slug: path.slug,
    title: path.title,
    description: path.description,
    difficulty: path.difficulty,
    estimatedDuration: path.estimatedDuration,
    lessonCount: path.lessonCount,
    coverImageUrl: resolveCoverUrl(path.coverImage, strapiBaseUrl),
    coverImageAlt: path.coverImage?.alternativeText ?? null,
  }));

  const lessons: ExploreLessonItem[] = flattenLessons(publishedPaths);

  return {
    status: "ok",
    data: { paths, lessons },
  };
}

/** Resolve a Strapi media image to an absolute URL for the web client. */
function resolveCoverUrl(
  media: ContentImage | null,
  baseUrl: string,
): string | null {
  if (!media) return null;
  return resolveStrapiMediaUrl(media.url, baseUrl);
}

/**
 * Flatten all lessons across the published learning-path tree, preserving
 * the parent learning-path slug + title for context. Deduplicates by slug
 * in case a lesson appears in multiple modules (defensive — the CMS schema
 * allows a lesson to belong to one module, but this keeps the listing
 * stable regardless).
 */
function flattenLessons(paths: LearningPath[]): ExploreLessonItem[] {
  const seen = new Set<string>();
  const out: ExploreLessonItem[] = [];
  for (const path of paths) {
    for (const learningModule of path.modules) {
      for (const lesson of learningModule.lessons) {
        if (seen.has(lesson.slug)) continue;
        seen.add(lesson.slug);
        out.push(toExploreLessonItem(lesson, path.slug, path.title));
      }
    }
  }
  return out;
}

function toExploreLessonItem(
  lesson: LessonPreview,
  pathSlug: string,
  pathTitle: string,
): ExploreLessonItem {
  return {
    slug: lesson.slug,
    title: lesson.title,
    summary: lesson.summary,
    difficulty: lesson.difficulty,
    estimatedDuration: lesson.estimatedDuration,
    pathSlug,
    pathTitle,
  };
}