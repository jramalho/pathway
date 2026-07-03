import type { LearningActivityAction, LearningActivityState } from "./learning-activity.types";

export const initialLearningActivityState: LearningActivityState = {
  completedLessonSlugs: {},
  savedLessonSlugs: {},
};

export function learningActivityReducer(
  state: LearningActivityState,
  action: LearningActivityAction,
): LearningActivityState {
  switch (action.type) {
    case "TOGGLE_LESSON_SAVED": {
      const saved = { ...state.savedLessonSlugs };
      if (saved[action.slug]) {
        delete saved[action.slug];
      } else {
        saved[action.slug] = true;
      }
      return { ...state, savedLessonSlugs: saved };
    }
    case "MARK_LESSON_COMPLETED": {
      const completed = { ...state.completedLessonSlugs };
      completed[action.slug] = true;
      return { ...state, completedLessonSlugs: completed };
    }
    case "MARK_LESSON_INCOMPLETE": {
      const completed = { ...state.completedLessonSlugs };
      delete completed[action.slug];
      return { ...state, completedLessonSlugs: completed };
    }
    default:
      return state;
  }
}
