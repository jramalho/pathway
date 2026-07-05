import "server-only";
import { getPathwayApiClient } from "./pathway-api";
import type { LearningPath, Difficulty } from "@pathway/api";

/**
 * Server-side lesson navigation data layer.
 *
 * Pure, typed, server-side selection logic for:
 *   - related lessons (based on real content relationships)
 *   - previous/next lesson navigation within the parent learning path
 *
 * This module never renders JSX and never touches raw Strapi responses.
 * It consumes the typed `LearningPath` domain model from `@pathway/api`
 * and returns compact, route-specific view models.
 */

/** Compact view model for a related-lesson card. */
export interface RelatedLessonItem {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  /** Parent learning-path slug (for context). */
  pathSlug: string;
  /** Parent learning-path title (for context). */
  pathTitle: string;
}

/** Previous or next lesson navigation target. */
export interface LessonNavTarget {
  slug: string;
  title: string;
}

/** Result of deriving previous/next navigation from a learning path. */
export interface LessonNavResult {
  previous: LessonNavTarget | null;
  next: LessonNavTarget | null;
  /** Parent learning-path context for the navigation section. */
  pathTitle: string;
  pathSlug: string;
}

/** Maximum number of related lessons to surface. */
const RELATED_LESSONS_LIMIT = 3;

/**
 * Flatten all lessons across published learning paths into a flat,
 * ordered list. Each entry carries its parent learning-path slug and
 * title for context. Deduplicates by slug.
 *
 * The module `order` field and the lesson position within the module
 * determine the sequence — this is the real content order from Strapi,
 * not alphabetical or date-based.
 */
function flattenOrderedLessons(
  paths: LearningPath[],
): Array<{
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  pathSlug: string;
  pathTitle: string;
}> {
  const seen = new Set<string>();
  const out: Array<{
    slug: string;
    title: string;
    summary: string;
    difficulty: Difficulty;
    estimatedDuration: number;
    pathSlug: string;
    pathTitle: string;
  }> = [];
  for (const path of paths) {
    // Sort modules by their real Strapi `order` field.
    const sortedModules = [...path.modules].sort((a, b) => a.order - b.order);
    for (const learningModule of sortedModules) {
      for (const lesson of learningModule.lessons) {
        if (!lesson.slug || seen.has(lesson.slug)) continue;
        seen.add(lesson.slug);
        out.push({
          slug: lesson.slug,
          title: lesson.title,
          summary: lesson.summary,
          difficulty: lesson.difficulty,
          estimatedDuration: lesson.estimatedDuration,
          pathSlug: path.slug,
          pathTitle: path.title,
        });
      }
    }
  }
  return out;
}

/**
 * Select related lessons for a given lesson.
 *
 * Selection rules, in order of preference:
 *   1. published lessons sharing a real category with the current lesson
 *   2. published lessons from the same real learning path, excluding self
 *   3. published lessons matching real difficulty
 *   4. deterministic published-lesson fallback, excluding self
 *
 * The current lesson is never included. Selection is deterministic
 * (stable sort by slug). Returns an empty array when no alternatives
 * exist — the caller renders nothing rather than a forced empty section.
 *
 * This is a typed server-side data boundary — not JSX, not a
 * recommendation engine. It uses only real published Strapi data and
 * does not fetch lesson bodies to choose related items.
 *
 * @param currentSlug  The current lesson's slug.
 * @param categorySlug The current lesson's real category slug, or null.
 * @param difficulty   The current lesson's real difficulty.
 * @param pathSlug    The current lesson's parent learning-path slug, or null.
 */
export async function getRelatedLessons(
  currentSlug: string,
  categorySlug: string | null,
  difficulty: Difficulty,
  pathSlug: string | null,
  options?: { signal?: AbortSignal },
): Promise<RelatedLessonItem[]> {
  const api = getPathwayApiClient();

  let publishedPaths: LearningPath[];
  try {
    publishedPaths = await api.getPublishedLearningPaths({
      signal: options?.signal,
    });
  } catch {
    // ponytail: if the CMS is unreachable, no related lessons. Ceiling: a
    // page with no CMS produces no related section. Upgrade path: none
    // needed — the section is supplementary, not critical.
    return [];
  }

  const allLessons = flattenOrderedLessons(publishedPaths);

  // Exclude the current lesson.
  const candidates = allLessons.filter((l) => l.slug !== currentSlug);
  if (candidates.length === 0) return [];

  // Deterministic sort by slug so results are stable across requests.
  const sorted = [...candidates].sort((a, b) => a.slug.localeCompare(b.slug));

  // 1. Lessons sharing a real category with the current lesson.
  // The lesson detail view model carries the category, but the flattened
  // lesson list (from the path tree) does not include per-lesson
  // categories. We therefore match by parent path: lessons from paths
  // that share the current lesson's category are related. This is a
  // pragmatic approximation — the path tree does not populate per-lesson
  // categories, but paths do have categories.
  if (categorySlug) {
    const pathsWithCategory = publishedPaths.filter(
      (p) => p.category?.slug === categorySlug,
    );
    const pathSlugsWithCategory = new Set(pathsWithCategory.map((p) => p.slug));
    const byCategory = sorted.filter((l) => pathSlugsWithCategory.has(l.pathSlug));
    if (byCategory.length > 0) {
      return byCategory.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedLessonItem);
    }
  }

  // 2. Lessons from the same real learning path, excluding self.
  if (pathSlug) {
    const samePath = sorted.filter((l) => l.pathSlug === pathSlug);
    if (samePath.length > 0) {
      return samePath.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedLessonItem);
    }
  }

  // 3. Lessons matching real difficulty.
  const byDifficulty = sorted.filter((l) => l.difficulty === difficulty);
  if (byDifficulty.length > 0) {
    return byDifficulty.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedLessonItem);
  }

  // 4. Deterministic published-lesson fallback.
  return sorted.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedLessonItem);
}

function toRelatedLessonItem(l: {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  pathSlug: string;
  pathTitle: string;
}): RelatedLessonItem {
  return {
    slug: l.slug,
    title: l.title,
    summary: l.summary,
    difficulty: l.difficulty,
    estimatedDuration: l.estimatedDuration,
    pathSlug: l.pathSlug,
    pathTitle: l.pathTitle,
  };
}

/**
 * Derive previous/next lesson navigation from the parent learning path.
 *
 * Ordering is derived from the real Strapi module `order` field and the
 * lesson position within each module — not alphabetical title or
 * publication date. Returns null for both previous and next when the
 * lesson is not found in the path, or when the path has no valid
 * ordering. Returns null for `previous` when the current lesson is the
 * first, and null for `next` when it is the last.
 *
 * @param currentSlug     The current lesson's slug.
 * @param pathSlug        The parent learning-path slug, or null.
 */
export async function getLessonNav(
  currentSlug: string,
  pathSlug: string | null,
  options?: { signal?: AbortSignal },
): Promise<LessonNavResult | null> {
  if (!pathSlug) return null;

  const api = getPathwayApiClient();

  let path: LearningPath | null;
  try {
    path = await api.getLearningPathBySlug(pathSlug, {
      signal: options?.signal,
    });
  } catch {
    // ponytail: if the CMS is unreachable, no navigation. Ceiling: a
    // page with no CMS produces no nav section. Upgrade path: none
    // needed — the section is supplementary, not critical.
    return null;
  }

  if (!path) return null;

  // Build the ordered lesson list from the path's modules.
  const sortedModules = [...path.modules].sort((a, b) => a.order - b.order);
  const orderedLessons: LessonNavTarget[] = [];
  for (const learningModule of sortedModules) {
    for (const lesson of learningModule.lessons) {
      if (!lesson.slug) continue;
      orderedLessons.push({ slug: lesson.slug, title: lesson.title });
    }
  }

  const currentIndex = orderedLessons.findIndex((l) => l.slug === currentSlug);
  if (currentIndex === -1) return null;

  const previous = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const next =
    currentIndex < orderedLessons.length - 1
      ? orderedLessons[currentIndex + 1]
      : null;

  return {
    previous,
    next,
    pathTitle: path.title,
    pathSlug: path.slug,
  };
}
