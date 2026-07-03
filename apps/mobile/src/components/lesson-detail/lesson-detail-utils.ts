import type { LearningPath, LessonPreview } from "@pathway/api";
import { sortModules } from "@/components/path-detail/learning-path-detail-utils";

/**
 * Flatten all navigable lessons from a learning path's module tree,
 * preserving module order and lesson order within each module.
 */
export function flattenNavigableLessons(path: LearningPath): LessonPreview[] {
  const sorted = sortModules(path.modules);
  const lessons: LessonPreview[] = [];
  for (const module of sorted) {
    for (const lesson of module.lessons) {
      lessons.push(lesson);
    }
  }
  return lessons;
}

export interface LessonPosition {
  previous: LessonPreview | null;
  current: LessonPreview | null;
  next: LessonPreview | null;
  currentIndex: number;
  total: number;
}

/**
 * Resolve the position of a lesson (by slug) within a learning path's
 * flattened curriculum. Returns previous, current, next, and index info.
 */
export function resolveLessonPosition(path: LearningPath, lessonSlug: string): LessonPosition {
  const lessons = flattenNavigableLessons(path);
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug);

  if (currentIndex === -1) {
    return { previous: null, current: null, next: null, currentIndex: -1, total: lessons.length };
  }

  return {
    previous: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    current: lessons[currentIndex],
    next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
    currentIndex,
    total: lessons.length,
  };
}

/**
 * Calculate path progress percentage based on completed lesson slugs.
 * Returns 0 if total is 0. Does not round misleadingly.
 */
export function calculatePathProgress(
  path: LearningPath,
  completedLessonSlugs: Record<string, true>,
): { completed: number; total: number; percentage: number } {
  const lessons = flattenNavigableLessons(path);
  const total = lessons.length;
  if (total === 0) return { completed: 0, total: 0, percentage: 0 };

  const completed = lessons.filter((l) => completedLessonSlugs[l.slug]).length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

/**
 * Find the first incomplete lesson in a path, or the first lesson
 * if none are completed yet. Used for "START HERE" / "CONTINUE HERE".
 */
export function getFirstIncompleteLesson(
  path: LearningPath,
  completedLessonSlugs: Record<string, true>,
): LessonPreview | null {
  const lessons = flattenNavigableLessons(path);
  if (lessons.length === 0) return null;

  const firstIncomplete = lessons.find((l) => !completedLessonSlugs[l.slug]);
  return firstIncomplete ?? lessons[0];
}
