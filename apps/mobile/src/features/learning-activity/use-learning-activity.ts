import { useContext, useCallback } from "react";

import { LearningActivityContext } from "./learning-activity-provider";

/**
 * Hook to access and manipulate in-memory learning activity state.
 *
 * Provides: toggleLessonSaved, markLessonCompleted, markLessonIncomplete,
 * isLessonSaved, isLessonCompleted.
 */
export function useLearningActivity() {
  const ctx = useContext(LearningActivityContext);
  if (!ctx) {
    throw new Error("useLearningActivity must be used within LearningActivityProvider");
  }

  const { state, dispatch } = ctx;

  const toggleLessonSaved = useCallback(
    (slug: string) => dispatch({ type: "TOGGLE_LESSON_SAVED", slug }),
    [dispatch],
  );

  const markLessonCompleted = useCallback(
    (slug: string) => dispatch({ type: "MARK_LESSON_COMPLETED", slug }),
    [dispatch],
  );

  const markLessonIncomplete = useCallback(
    (slug: string) => dispatch({ type: "MARK_LESSON_INCOMPLETE", slug }),
    [dispatch],
  );

  const isLessonSaved = useCallback(
    (slug: string) => !!state.savedLessonSlugs[slug],
    [state.savedLessonSlugs],
  );

  const isLessonCompleted = useCallback(
    (slug: string) => !!state.completedLessonSlugs[slug],
    [state.completedLessonSlugs],
  );

  return {
    toggleLessonSaved,
    markLessonCompleted,
    markLessonIncomplete,
    isLessonSaved,
    isLessonCompleted,
    completedLessonSlugs: state.completedLessonSlugs,
    savedLessonSlugs: state.savedLessonSlugs,
  };
}
