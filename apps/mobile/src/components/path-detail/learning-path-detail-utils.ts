import type { LearningPath, LearningPathModule, LessonPreview } from "@pathway/api";

/**
 * Sort modules by their `order` field (ascending).
 * If order is missing or equal, preserve original order (stable sort).
 */
export function sortModules(modules: LearningPathModule[]): LearningPathModule[] {
  return [...modules].sort((a, b) => a.order - b.order);
}

/**
 * Find the first navigable lesson in a learning path.
 *
 * Traverses modules in sorted order and returns the first lesson
 * from the first module that has lessons. Returns null if no
 * module has any lessons.
 */
export function getFirstNavigableLesson(path: LearningPath): LessonPreview | null {
  const sorted = sortModules(path.modules);
  for (const module of sorted) {
    if (module.lessons.length > 0) {
      return module.lessons[0];
    }
  }
  return null;
}

/**
 * Find the index of the first module that contains lessons.
 * Used to determine which accordion starts expanded.
 */
export function getFirstModuleWithLessonsIndex(modules: LearningPathModule[]): number {
  const sorted = sortModules(modules);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].lessons.length > 0) {
      return i;
    }
  }
  return -1;
}

/**
 * Format a module number as a zero-padded string for display.
 * Uses the module's `order` field when available, otherwise
 * falls back to the visual position (index + 1).
 */
export function formatModuleNumber(module: LearningPathModule, index: number): string {
  const num = module.order || index + 1;
  return num < 10 ? `0${num}` : String(num);
}

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Get a human-readable difficulty label, or null if unknown. */
export function getDifficultyLabel(difficulty: string): string | null {
  return difficultyLabels[difficulty] ?? null;
}
