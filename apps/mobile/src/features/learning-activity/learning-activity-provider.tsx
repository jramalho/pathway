import { createContext, useEffect, useReducer, useRef, type ReactNode } from "react";

import { initialLearningActivityState, learningActivityReducer, toPersistedPayload } from "./learning-activity.reducer";
import { readLearningActivity, writeLearningActivity } from "./learning-activity.storage";
import type { LearningActivityAction, LearningActivityState } from "./learning-activity.types";

export interface LearningActivityContextValue {
  state: LearningActivityState;
  dispatch: React.Dispatch<LearningActivityAction>;
}

export const LearningActivityContext = createContext<LearningActivityContextValue | null>(null);

/**
 * Learning activity provider with AsyncStorage persistence.
 *
 * On mount, reads and validates the persisted payload before hydrating.
 * After hydration, every state change is persisted via a simple write queue
 * that preserves the latest state and avoids race conditions between
 * rapid writes. The UI is never blocked waiting for a write to complete.
 */
export function LearningActivityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningActivityReducer, initialLearningActivityState);

  // --- Hydration: read once on mount, before any writes are allowed. ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const payload = await readLearningActivity();
        if (cancelled) return;
        if (payload) {
          dispatch({ type: "HYDRATE", payload });
        } else {
          dispatch({ type: "HYDRATE_EMPTY" });
        }
      } catch {
        if (!cancelled) dispatch({ type: "HYDRATE_ERROR" });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // --- Persistence: after hydration, write on every state change. ---
  // A single-flight queue ensures rapid taps don't race: only the latest
  // state is written; if a write is in-flight, the next one waits and
  // writes the most recent payload.
  const writeInProgress = useRef(false);
  const pendingWrite = useRef(false);
  const latestState = useRef(state);

  // Keep the ref in sync so the async drain always writes the freshest state.
  useEffect(() => {
    latestState.current = state;
  }, [state]);

  useEffect(() => {
    if (!state.isHydrated) return;

    const payload = toPersistedPayload(state);

    // If a write is already in-flight, mark pending and let it finish;
    // the in-flight write's completion will trigger the pending one.
    if (writeInProgress.current) {
      pendingWrite.current = true;
      return;
    }

    writeInProgress.current = true;
    (async () => {
      try {
        await writeLearningActivity(payload);
        // Drain any pending writes (always writing the latest state from ref).
        // ponytail: ceiling — this simple loop handles rapid sequential writes;
        // for extreme concurrency a dedicated queue class would be cleaner.
        while (pendingWrite.current) {
          pendingWrite.current = false;
          const latest = toPersistedPayload(latestState.current);
          await writeLearningActivity(latest);
        }
        dispatch({ type: "STORAGE_WRITE_OK" });
      } catch {
        dispatch({ type: "STORAGE_WRITE_ERROR" });
      } finally {
        writeInProgress.current = false;
      }
    })();
  }, [state]);

  return (
    <LearningActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningActivityContext.Provider>
  );
}
