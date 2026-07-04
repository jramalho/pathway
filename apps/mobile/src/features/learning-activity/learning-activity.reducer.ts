import type { LearningActivityAction, LearningActivityState, PersistedLearningActivity } from "./learning-activity.types";

export const initialLearningActivityState: LearningActivityState = {
  completedLessonSlugs: {},
  savedLessonSlugs: {},
  savedPathSlugs: {},
  savedLessonOrder: [],
  savedPathOrder: [],
  completedLessonOrder: [],
  isHydrated: false,
  storageStatus: "idle",
};

/** Insert slug at the head, removing any prior duplicate. */
function prependUnique(list: string[], slug: string): string[] {
  return [slug, ...list.filter((s) => s !== slug)];
}

/** Remove slug from the list. */
function removeFromList(list: string[], slug: string): string[] {
  return list.filter((s) => s !== slug);
}

/** Convert an ordered array to a Record<string, true> for O(1) lookups. */
function toRecord(slugs: string[]): Record<string, true> {
  const rec: Record<string, true> = {};
  for (const s of slugs) rec[s] = true;
  return rec;
}

export function learningActivityReducer(
  state: LearningActivityState,
  action: LearningActivityAction,
): LearningActivityState {
  switch (action.type) {
    case "TOGGLE_LESSON_SAVED": {
      if (state.savedLessonSlugs[action.slug]) {
        const savedLessonSlugs = { ...state.savedLessonSlugs };
        delete savedLessonSlugs[action.slug];
        return {
          ...state,
          savedLessonSlugs,
          savedLessonOrder: removeFromList(state.savedLessonOrder, action.slug),
        };
      }
      return {
        ...state,
        savedLessonSlugs: { ...state.savedLessonSlugs, [action.slug]: true },
        savedLessonOrder: prependUnique(state.savedLessonOrder, action.slug),
      };
    }
    case "MARK_LESSON_COMPLETED": {
      if (state.completedLessonSlugs[action.slug]) return state;
      return {
        ...state,
        completedLessonSlugs: { ...state.completedLessonSlugs, [action.slug]: true },
        completedLessonOrder: prependUnique(state.completedLessonOrder, action.slug),
      };
    }
    case "MARK_LESSON_INCOMPLETE": {
      if (!state.completedLessonSlugs[action.slug]) return state;
      const completedLessonSlugs = { ...state.completedLessonSlugs };
      delete completedLessonSlugs[action.slug];
      return {
        ...state,
        completedLessonSlugs,
        completedLessonOrder: removeFromList(state.completedLessonOrder, action.slug),
      };
    }
    case "TOGGLE_PATH_SAVED": {
      if (state.savedPathSlugs[action.slug]) {
        const savedPathSlugs = { ...state.savedPathSlugs };
        delete savedPathSlugs[action.slug];
        return {
          ...state,
          savedPathSlugs,
          savedPathOrder: removeFromList(state.savedPathOrder, action.slug),
        };
      }
      return {
        ...state,
        savedPathSlugs: { ...state.savedPathSlugs, [action.slug]: true },
        savedPathOrder: prependUnique(state.savedPathOrder, action.slug),
      };
    }
    case "HYDRATE": {
      const { payload } = action;
      return {
        ...state,
        completedLessonSlugs: toRecord(payload.completedLessonSlugs),
        savedLessonSlugs: toRecord(payload.savedLessonSlugs),
        savedPathSlugs: toRecord(payload.savedPathSlugs),
        completedLessonOrder: payload.completedLessonSlugs,
        savedLessonOrder: payload.savedLessonSlugs,
        savedPathOrder: payload.savedPathSlugs,
        isHydrated: true,
        storageStatus: "ok",
      };
    }
    case "HYDRATE_EMPTY": {
      return { ...state, isHydrated: true, storageStatus: "ok" };
    }
    case "HYDRATE_ERROR": {
      return { ...state, isHydrated: true, storageStatus: "error" };
    }
    case "STORAGE_WRITE_ERROR": {
      return { ...state, storageStatus: "error" };
    }
    case "STORAGE_WRITE_OK": {
      return { ...state, storageStatus: "ok" };
    }
    default:
      return state;
  }
}

/** Build the persistable payload from the current state. */
export function toPersistedPayload(state: LearningActivityState): PersistedLearningActivity {
  return {
    version: 1,
    completedLessonSlugs: state.completedLessonOrder,
    savedLessonSlugs: state.savedLessonOrder,
    savedPathSlugs: state.savedPathOrder,
  };
}
