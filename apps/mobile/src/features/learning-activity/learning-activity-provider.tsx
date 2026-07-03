import { createContext, useReducer, type ReactNode } from "react";

import { initialLearningActivityState, learningActivityReducer } from "./learning-activity.reducer";
import type { LearningActivityAction, LearningActivityState } from "./learning-activity.types";

export interface LearningActivityContextValue {
  state: LearningActivityState;
  dispatch: React.Dispatch<LearningActivityAction>;
}

export const LearningActivityContext = createContext<LearningActivityContextValue | null>(null);

/**
 * In-memory learning activity provider.
 *
 * Wraps the app to share completion and saved state across screens
 * during a single session. No persistence — state resets on app restart.
 */
export function LearningActivityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningActivityReducer, initialLearningActivityState);

  return (
    <LearningActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningActivityContext.Provider>
  );
}
