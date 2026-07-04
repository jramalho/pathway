/**
 * Learning activity state types.
 *
 * In-memory state is persisted to AsyncStorage (Part 2.6).
 * The persistence boundary uses simple ordered arrays; the in-memory
 * state uses Record<string, true> for O(1) lookups plus ordered arrays
 * to preserve save recency.
 */

export type StorageStatus = "idle" | "ok" | "error";

export interface LearningActivityState {
  /** Slugs of lessons marked as completed, keyed by slug. */
  completedLessonSlugs: Record<string, true>;
  /** Slugs of lessons saved for later, keyed by slug. */
  savedLessonSlugs: Record<string, true>;
  /** Slugs of learning paths saved for later, keyed by slug. */
  savedPathSlugs: Record<string, true>;
  /** Ordered saved lesson slugs (most recent first). */
  savedLessonOrder: string[];
  /** Ordered saved path slugs (most recent first). */
  savedPathOrder: string[];
  /** Ordered completed lesson slugs (most recent first). */
  completedLessonOrder: string[];
  /** Whether persisted state has been restored from AsyncStorage. */
  isHydrated: boolean;
  /** Whether local storage read/write encountered an error. */
  storageStatus: StorageStatus;
}

/** Payload persisted to AsyncStorage — simple, serializable, versioned. */
export interface PersistedLearningActivity {
  version: 1;
  completedLessonSlugs: string[];
  savedLessonSlugs: string[];
  savedPathSlugs: string[];
}

export type LearningActivityAction =
  | { type: "TOGGLE_LESSON_SAVED"; slug: string }
  | { type: "MARK_LESSON_COMPLETED"; slug: string }
  | { type: "MARK_LESSON_INCOMPLETE"; slug: string }
  | { type: "TOGGLE_PATH_SAVED"; slug: string }
  | { type: "HYDRATE"; payload: PersistedLearningActivity }
  | { type: "HYDRATE_EMPTY" }
  | { type: "HYDRATE_ERROR" }
  | { type: "STORAGE_WRITE_ERROR" }
  | { type: "STORAGE_WRITE_OK" };
