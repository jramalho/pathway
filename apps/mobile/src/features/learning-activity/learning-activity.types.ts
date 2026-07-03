/**
 * Learning activity state types.
 *
 * In-memory only — no persistence in this stage (Part 2.5).
 * Part 2.6 will connect this to AsyncStorage.
 */

export interface LearningActivityState {
  /** Slugs of lessons marked as completed, keyed by slug. */
  completedLessonSlugs: Record<string, true>;
  /** Slugs of lessons saved for later, keyed by slug. */
  savedLessonSlugs: Record<string, true>;
}

export type LearningActivityAction =
  | { type: "TOGGLE_LESSON_SAVED"; slug: string }
  | { type: "MARK_LESSON_COMPLETED"; slug: string }
  | { type: "MARK_LESSON_INCOMPLETE"; slug: string };
