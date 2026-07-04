import type { LearningPath, LessonPreview } from "@pathway/api";

import { flattenNavigableLessons, calculatePathProgress } from "@/components/lesson-detail/lesson-detail-utils";
import { getSavedLessons, getSavedPaths } from "@/lib/saved-content";

/**
 * Profile learning utils — derive real metrics from published CMS content
 * combined with local persisted activity state.
 *
 * No metric is invented. Slugs that no longer match published content
 * are excluded from counts but NOT removed from persisted state.
 */

/** All navigable/published lessons within a path (flattened, sorted). */
export function getPublishedNavigableLessons(path: LearningPath): LessonPreview[] {
  return flattenNavigableLessons(path);
}

/** Per-path progress: completed count, total, percentage. Reuses existing helper. */
export function calculateLearningPathProgress(
  path: LearningPath,
  completedLessonSlugs: Record<string, true>,
): { completed: number; total: number; percentage: number } {
  return calculatePathProgress(path, completedLessonSlugs);
}

/**
 * Active paths: published paths with at least one navigable lesson,
 * at least one completed, and at least one still incomplete.
 */
export function getActiveLearningPaths(
  paths: LearningPath[],
  completedLessonSlugs: Record<string, true>,
): LearningPath[] {
  return paths.filter((path) => {
    const { completed, total } = calculatePathProgress(path, completedLessonSlugs);
    return total > 0 && completed > 0 && completed < total;
  });
}

/**
 * Completed paths: published paths with at least one navigable lesson
 * where all navigable lessons are completed.
 */
export function getCompletedLearningPaths(
  paths: LearningPath[],
  completedLessonSlugs: Record<string, true>,
): LearningPath[] {
  return paths.filter((path) => {
    const { completed, total } = calculatePathProgress(path, completedLessonSlugs);
    return total > 0 && completed === total;
  });
}

export interface CompletedLessonWithContext {
  lesson: LessonPreview;
  pathTitle: string;
  pathSlug: string;
}

/**
 * Resolve completed lesson slugs against the published path tree.
 * Returns only lessons that are currently published, preserving the
 * completion order from persisted state. Unavailable slugs are counted
 * separately so the UI can show a notice without deleting them.
 */
export function getAvailableCompletedLessons(
  completedLessonOrder: string[],
  paths: LearningPath[],
): { available: CompletedLessonWithContext[]; unavailableCount: number } {
  const { available, unavailableCount } = getSavedLessons(completedLessonOrder, paths);
  // getSavedLessons returns SavedLessonWithContext which has the same shape.
  return { available, unavailableCount };
}

/**
 * Count saved items that are currently available (published).
 * Lessons saved + paths saved, excluding slugs that no longer match
 * published content.
 */
export function getAvailableSavedItemCount(
  savedLessonOrder: string[],
  savedPathOrder: string[],
  paths: LearningPath[],
): { count: number; unavailableCount: number } {
  const lessons = getSavedLessons(savedLessonOrder, paths);
  const pathList = getSavedPaths(savedPathOrder, paths);
  return {
    count: lessons.available.length + pathList.available.length,
    unavailableCount: lessons.unavailableCount + pathList.unavailableCount,
  };
}

export interface LearningOverview {
  completedLessons: number;
  savedItems: number;
  activePaths: number;
  completedPaths: number;
  /** Slugs that don't match published content anymore. */
  unavailableActivityCount: number;
}

/**
 * Build the full overview metrics from real API data + local state.
 * Every number is derived from published content and persisted slugs.
 */
export function buildLearningOverview(
  paths: LearningPath[],
  completedLessonSlugs: Record<string, true>,
  completedLessonOrder: string[],
  savedLessonOrder: string[],
  savedPathOrder: string[],
): LearningOverview {
  // Completed lessons: only count slugs that match published lessons.
  let completedLessons = 0;
  const publishedLessonSlugs = new Set<string>();
  for (const path of paths) {
    for (const lesson of getPublishedNavigableLessons(path)) {
      publishedLessonSlugs.add(lesson.slug);
    }
  }
  for (const slug of completedLessonOrder) {
    if (publishedLessonSlugs.has(slug)) completedLessons++;
  }

  // Saved items: only count available.
  const { count: savedItems, unavailableCount: savedUnavailable } = getAvailableSavedItemCount(
    savedLessonOrder,
    savedPathOrder,
    paths,
  );

  // Active and completed paths.
  const activePaths = getActiveLearningPaths(paths, completedLessonSlugs).length;
  const completedPaths = getCompletedLearningPaths(paths, completedLessonSlugs).length;

  // Unavailable activity: completed lessons not found + saved items not found.
  const completedUnavailable = completedLessonOrder.length - completedLessons;
  const unavailableActivityCount = completedUnavailable + savedUnavailable;

  return {
    completedLessons,
    savedItems,
    activePaths,
    completedPaths,
    unavailableActivityCount,
  };
}
