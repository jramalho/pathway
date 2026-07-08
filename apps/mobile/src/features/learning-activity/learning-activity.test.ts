/**
 * Meaningful automated test — guards the learning activity reducer.
 *
 * This is the single most valuable test for the product's local behavior:
 * it exercises the real reducer that drives save/remove lesson,
 * mark complete/incomplete, and path-saved toggles. The reducer is a
 * pure function — no React, no AsyncStorage, no Strapi — so the test
 * is deterministic and fast.
 *
 * Run with:
 *   node --experimental-strip-types --test apps/mobile/src/features/learning-activity/learning-activity.test.ts
 *
 * Or via the workspace script:
 *   pnpm --filter @pathway/mobile test
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  learningActivityReducer,
  initialLearningActivityState,
  toPersistedPayload,
} from "./learning-activity.reducer.ts";

// ── Helpers ──────────────────────────────────────────────────────

const LESSON_SLUG = "optimizing-long-lists-with-flashlist";
const SECOND_LESSON_SLUG = "reducing-re-renders-in-react-native";
const PATH_SLUG = "react-native-performance";

/** Fresh state for each test — no leakage between cases. */
function freshState() {
  return structuredClone(initialLearningActivityState);
}

// ── Save and remove a lesson ─────────────────────────────────────

test("TOGGLE_LESSON_SAVED: adds a lesson to saved items", () => {
  const state = freshState();
  const next = learningActivityReducer(state, {
    type: "TOGGLE_LESSON_SAVED",
    slug: LESSON_SLUG,
  });

  assert.equal(next.savedLessonSlugs[LESSON_SLUG], true);
  assert.deepEqual(next.savedLessonOrder, [LESSON_SLUG]);
  // Other collections are untouched.
  assert.equal(next.savedPathSlugs[PATH_SLUG], undefined);
  assert.equal(next.completedLessonSlugs[LESSON_SLUG], undefined);
});

test("TOGGLE_LESSON_SAVED: removes a previously saved lesson", () => {
  const state = freshState();
  const saved = learningActivityReducer(state, {
    type: "TOGGLE_LESSON_SAVED",
    slug: LESSON_SLUG,
  });
  const removed = learningActivityReducer(saved, {
    type: "TOGGLE_LESSON_SAVED",
    slug: LESSON_SLUG,
  });

  assert.equal(removed.savedLessonSlugs[LESSON_SLUG], undefined);
  assert.deepEqual(removed.savedLessonOrder, []);
});

test("TOGGLE_LESSON_SAVED: prepends most recent when adding a new lesson", () => {
  const state = freshState();
  const afterFirst = learningActivityReducer(state, {
    type: "TOGGLE_LESSON_SAVED",
    slug: LESSON_SLUG,
  });
  const afterSecond = learningActivityReducer(afterFirst, {
    type: "TOGGLE_LESSON_SAVED",
    slug: SECOND_LESSON_SLUG,
  });
  // Most recent first.
  assert.deepEqual(afterSecond.savedLessonOrder, [SECOND_LESSON_SLUG, LESSON_SLUG]);
  assert.equal(afterSecond.savedLessonSlugs[LESSON_SLUG], true);
  assert.equal(afterSecond.savedLessonSlugs[SECOND_LESSON_SLUG], true);
});

// ── Mark lesson complete and incomplete ──────────────────────────

test("MARK_LESSON_COMPLETED: marks a lesson as completed", () => {
  const state = freshState();
  const next = learningActivityReducer(state, {
    type: "MARK_LESSON_COMPLETED",
    slug: LESSON_SLUG,
  });

  assert.equal(next.completedLessonSlugs[LESSON_SLUG], true);
  assert.deepEqual(next.completedLessonOrder, [LESSON_SLUG]);
});

test("MARK_LESSON_COMPLETED: is idempotent (no duplicate in order)", () => {
  const state = freshState();
  const once = learningActivityReducer(state, {
    type: "MARK_LESSON_COMPLETED",
    slug: LESSON_SLUG,
  });
  const twice = learningActivityReducer(once, {
    type: "MARK_LESSON_COMPLETED",
    slug: LESSON_SLUG,
  });

  assert.deepEqual(twice.completedLessonOrder, [LESSON_SLUG]);
});

test("MARK_LESSON_INCOMPLETE: removes completion and order entry", () => {
  const state = freshState();
  const completed = learningActivityReducer(state, {
    type: "MARK_LESSON_COMPLETED",
    slug: LESSON_SLUG,
  });
  const incomplete = learningActivityReducer(completed, {
    type: "MARK_LESSON_INCOMPLETE",
    slug: LESSON_SLUG,
  });

  assert.equal(incomplete.completedLessonSlugs[LESSON_SLUG], undefined);
  assert.deepEqual(incomplete.completedLessonOrder, []);
});

test("MARK_LESSON_INCOMPLETE: is a no-op when lesson was not completed", () => {
  const state = freshState();
  const next = learningActivityReducer(state, {
    type: "MARK_LESSON_INCOMPLETE",
    slug: LESSON_SLUG,
  });

  assert.equal(next.completedLessonSlugs[LESSON_SLUG], undefined);
  assert.deepEqual(next.completedLessonOrder, []);
});

// ── Save and remove a learning path ──────────────────────────────

test("TOGGLE_PATH_SAVED: adds and removes a path", () => {
  const state = freshState();
  const saved = learningActivityReducer(state, {
    type: "TOGGLE_PATH_SAVED",
    slug: PATH_SLUG,
  });
  assert.equal(saved.savedPathSlugs[PATH_SLUG], true);
  assert.deepEqual(saved.savedPathOrder, [PATH_SLUG]);

  const removed = learningActivityReducer(saved, {
    type: "TOGGLE_PATH_SAVED",
    slug: PATH_SLUG,
  });
  assert.equal(removed.savedPathSlugs[PATH_SLUG], undefined);
  assert.deepEqual(removed.savedPathOrder, []);
});

// ── Full user flow: save → complete → unsave → incomplete ────────

test("Full flow: save lesson, complete it, remove save, mark incomplete", () => {
  const state = freshState();

  // 1. Save the lesson
  const afterSave = learningActivityReducer(state, {
    type: "TOGGLE_LESSON_SAVED",
    slug: LESSON_SLUG,
  });
  assert.equal(afterSave.savedLessonSlugs[LESSON_SLUG], true);
  assert.equal(afterSave.completedLessonSlugs[LESSON_SLUG], undefined);

  // 2. Mark as complete
  const afterComplete = learningActivityReducer(afterSave, {
    type: "MARK_LESSON_COMPLETED",
    slug: LESSON_SLUG,
  });
  assert.equal(afterComplete.completedLessonSlugs[LESSON_SLUG], true);
  // Still saved.
  assert.equal(afterComplete.savedLessonSlugs[LESSON_SLUG], true);

  // 3. Remove from saved (completion is independent)
  const afterUnsave = learningActivityReducer(afterComplete, {
    type: "TOGGLE_LESSON_SAVED",
    slug: LESSON_SLUG,
  });
  assert.equal(afterUnsave.savedLessonSlugs[LESSON_SLUG], undefined);
  // Completion persists independently of saved state.
  assert.equal(afterUnsave.completedLessonSlugs[LESSON_SLUG], true);

  // 4. Mark incomplete
  const afterIncomplete = learningActivityReducer(afterUnsave, {
    type: "MARK_LESSON_INCOMPLETE",
    slug: LESSON_SLUG,
  });
  assert.equal(afterIncomplete.completedLessonSlugs[LESSON_SLUG], undefined);
  assert.equal(afterIncomplete.savedLessonSlugs[LESSON_SLUG], undefined);
});

// ── Persistence payload ──────────────────────────────────────────

test("toPersistedPayload: serializes ordered arrays, not records", () => {
  const state = freshState();
  const withActivity = learningActivityReducer(state, {
    type: "TOGGLE_LESSON_SAVED",
    slug: LESSON_SLUG,
  });
  const completed = learningActivityReducer(withActivity, {
    type: "MARK_LESSON_COMPLETED",
    slug: SECOND_LESSON_SLUG,
  });
  const payload = toPersistedPayload(completed);

  assert.equal(payload.version, 1);
  assert.deepEqual(payload.savedLessonSlugs, [LESSON_SLUG]);
  assert.deepEqual(payload.completedLessonSlugs, [SECOND_LESSON_SLUG]);
  assert.deepEqual(payload.savedPathSlugs, []);
});

// ── Hydration ────────────────────────────────────────────────────

test("HYDRATE: restores state from a persisted payload", () => {
  const state = freshState();
  const payload = {
    version: 1 as const,
    completedLessonSlugs: [LESSON_SLUG],
    savedLessonSlugs: [SECOND_LESSON_SLUG],
    savedPathSlugs: [PATH_SLUG],
  };
  const hydrated = learningActivityReducer(state, {
    type: "HYDRATE",
    payload,
  });

  assert.equal(hydrated.isHydrated, true);
  assert.equal(hydrated.storageStatus, "ok");
  assert.equal(hydrated.completedLessonSlugs[LESSON_SLUG], true);
  assert.equal(hydrated.savedLessonSlugs[SECOND_LESSON_SLUG], true);
  assert.equal(hydrated.savedPathSlugs[PATH_SLUG], true);
  assert.deepEqual(hydrated.savedLessonOrder, [SECOND_LESSON_SLUG]);
});

test("HYDRATE_EMPTY: marks as hydrated with ok status", () => {
  const state = freshState();
  const next = learningActivityReducer(state, { type: "HYDRATE_EMPTY" });
  assert.equal(next.isHydrated, true);
  assert.equal(next.storageStatus, "ok");
});

test("HYDRATE_ERROR: marks as hydrated with error status", () => {
  const state = freshState();
  const next = learningActivityReducer(state, { type: "HYDRATE_ERROR" });
  assert.equal(next.isHydrated, true);
  assert.equal(next.storageStatus, "error");
});
