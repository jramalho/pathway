import type { LearningPath, LessonPreview } from "@pathway/api";

/**
 * Helpers to resolve persisted slugs into real content from the API.
 *
 * The CMS is the source of truth — we only store slugs locally and
 * resolve them against published content fetched via @pathway/api.
 * Slugs that no longer match published content are filtered out of
 * the display but NOT removed from persisted state.
 */

export interface SavedLessonWithContext {
  lesson: LessonPreview;
  pathTitle: string;
  pathSlug: string;
}

/**
 * Resolve saved lesson slugs against the published path tree.
 * Returns lessons that are currently published, preserving the
 * saved recency order. Unavailable slugs are returned separately
 * so the UI can show a discrete notice without deleting them.
 */
export function getSavedLessons(
  savedLessonOrder: string[],
  paths: LearningPath[],
): { available: SavedLessonWithContext[]; unavailableCount: number } {
  const available: SavedLessonWithContext[] = [];

  for (const slug of savedLessonOrder) {
    // Search the path tree for this lesson.
    let resolved: SavedLessonWithContext | null = null;
    for (const path of paths) {
      for (const module of path.modules) {
        for (const lesson of module.lessons) {
          if (lesson.slug === slug) {
            resolved = { lesson, pathTitle: path.title, pathSlug: path.slug };
            break;
          }
        }
        if (resolved) break;
      }
      if (resolved) break;
    }
    if (resolved) {
      available.push(resolved);
    }
  }

  const unavailableCount = savedLessonOrder.length - available.length;
  return { available, unavailableCount };
}

/**
 * Resolve saved path slugs against published paths.
 * Returns paths that are currently published, preserving the
 * saved recency order. Unavailable slugs are returned separately.
 */
export function getSavedPaths(
  savedPathOrder: string[],
  paths: LearningPath[],
): { available: LearningPath[]; unavailableCount: number } {
  const available: LearningPath[] = [];
  const pathMap = new Map<string, LearningPath>();
  for (const p of paths) pathMap.set(p.slug, p);

  for (const slug of savedPathOrder) {
    const path = pathMap.get(slug);
    if (path) available.push(path);
  }

  const unavailableCount = savedPathOrder.length - available.length;
  return { available, unavailableCount };
}

export type RecentlySavedItem =
  | { type: "lesson"; lesson: LessonPreview; pathTitle: string; pathSlug: string }
  | { type: "path"; path: LearningPath };

/**
 * Build a combined recently-saved list for Home, limited to maxItems.
 * Lessons are shown first (most recent), then paths, per the spec's
 * simple ordering approach when no global timestamp exists.
 */
export function getRecentlySaved(
  savedLessonOrder: string[],
  savedPathOrder: string[],
  paths: LearningPath[],
  maxItems: number,
): RecentlySavedItem[] {
  const { available: lessons } = getSavedLessons(savedLessonOrder, paths);
  const { available: pathList } = getSavedPaths(savedPathOrder, paths);

  const items: RecentlySavedItem[] = [];

  // Lessons first, then paths — simple, documented ordering.
  for (const l of lessons) {
    items.push({ type: "lesson", ...l });
  }
  for (const p of pathList) {
    items.push({ type: "path", path: p });
  }

  return items.slice(0, maxItems);
}
