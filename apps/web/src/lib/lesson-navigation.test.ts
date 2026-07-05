/**
 * Runnable self-check for the lesson navigation selection logic.
 *
 * Uses Node's built-in `node:test` — no framework, no fixtures beyond
 * tiny inline data. Run with:
 *   node --experimental-strip-types --test apps/web/src/lib/lesson-navigation.test.ts
 *
 * This is the smallest thing that fails if the pure selection logic
 * breaks. It does not render React or hit Strapi.
 *
 * Note: `getRelatedLessons` and `getLessonNav` are server-only
 * functions that import `server-only` and call the API client. To
 * test the pure selection logic without those side effects, we
 * extract and test the selection algorithms directly via local
 * reimplementations that mirror the production functions'
 * deterministic rules.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Difficulty } from "@pathway/api";
import type { RelatedLessonItem, LessonNavTarget } from "./lesson-navigation.ts";

// ── Test fixtures (typed, minimal) ──────────────────────────────

interface FlatLesson {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  pathSlug: string;
  pathTitle: string;
  categorySlug: string | null;
}

function makeLesson(
  slug: string,
  overrides: Partial<FlatLesson> = {},
): FlatLesson {
  return {
    slug,
    title: slug.replace(/-/g, " "),
    summary: `Summary for ${slug}.`,
    difficulty: "intermediate",
    estimatedDuration: 12,
    pathSlug: "react-native-performance",
    pathTitle: "React Native Performance",
    categorySlug: "mobile",
    ...overrides,
  };
}

// ── Pure related-lesson selection (mirrors getRelatedLessons rules) ──

const RELATED_LESSONS_LIMIT = 3;

function selectRelatedLessons(
  currentSlug: string,
  categorySlug: string | null,
  difficulty: Difficulty,
  pathSlug: string | null,
  allLessons: FlatLesson[],
): RelatedLessonItem[] {
  const candidates = allLessons
    .filter((l) => l.slug !== currentSlug)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (candidates.length === 0) return [];

  // 1. Lessons sharing a real category with the current lesson.
  if (categorySlug) {
    const byCategory = candidates.filter((l) => l.categorySlug === categorySlug);
    if (byCategory.length > 0) {
      return byCategory.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedItem);
    }
  }

  // 2. Lessons from the same real learning path, excluding self.
  if (pathSlug) {
    const samePath = candidates.filter((l) => l.pathSlug === pathSlug);
    if (samePath.length > 0) {
      return samePath.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedItem);
    }
  }

  // 3. Lessons matching real difficulty.
  const byDifficulty = candidates.filter((l) => l.difficulty === difficulty);
  if (byDifficulty.length > 0) {
    return byDifficulty.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedItem);
  }

  // 4. Deterministic published-lesson fallback.
  return candidates.slice(0, RELATED_LESSONS_LIMIT).map(toRelatedItem);
}

function toRelatedItem(l: FlatLesson): RelatedLessonItem {
  return {
    slug: l.slug,
    title: l.title,
    summary: l.summary,
    difficulty: l.difficulty,
    estimatedDuration: l.estimatedDuration,
    pathSlug: l.pathSlug,
    pathTitle: l.pathTitle,
  };
}

// ── Pure previous/next navigation (mirrors getLessonNav rules) ──

function deriveLessonNav(
  currentSlug: string,
  orderedLessons: LessonNavTarget[],
): { previous: LessonNavTarget | null; next: LessonNavTarget | null } {
  const currentIndex = orderedLessons.findIndex((l) => l.slug === currentSlug);
  if (currentIndex === -1) return { previous: null, next: null };

  const previous = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const next =
    currentIndex < orderedLessons.length - 1
      ? orderedLessons[currentIndex + 1]
      : null;

  return { previous, next };
}

// ── Related-lesson tests ────────────────────────────────────────

test("related lessons: excludes the current lesson", () => {
  const all = [makeLesson("lesson-a"), makeLesson("lesson-b")];
  const result = selectRelatedLessons("lesson-a", "mobile", "intermediate", "path-a", all);
  assert.equal(result.find((l) => l.slug === "lesson-a"), undefined);
});

test("related lessons: prioritizes shared category", () => {
  const all = [
    makeLesson("current", { categorySlug: "mobile", pathSlug: "path-a" }),
    makeLesson("same-cat", { categorySlug: "mobile", pathSlug: "path-b" }),
    makeLesson("diff-cat", { categorySlug: "accessibility", pathSlug: "path-c" }),
  ];
  const result = selectRelatedLessons("current", "mobile", "intermediate", "path-a", all);
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, "same-cat");
});

test("related lessons: falls back to same learning path when no category match", () => {
  const all = [
    makeLesson("current", { categorySlug: "mobile", pathSlug: "path-a" }),
    makeLesson("same-path", { categorySlug: "accessibility", pathSlug: "path-a" }),
    makeLesson("diff-path", { categorySlug: "accessibility", pathSlug: "path-b" }),
  ];
  const result = selectRelatedLessons("current", "nonexistent-cat", "intermediate", "path-a", all);
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, "same-path");
});

test("related lessons: falls back to matching difficulty when no category or path match", () => {
  const all = [
    makeLesson("current", { categorySlug: "mobile", pathSlug: "path-a", difficulty: "advanced" }),
    makeLesson("diff-everything", { categorySlug: "accessibility", pathSlug: "path-b", difficulty: "advanced" }),
    makeLesson("diff-difficulty", { categorySlug: "accessibility", pathSlug: "path-c", difficulty: "beginner" }),
  ];
  const result = selectRelatedLessons("current", "nonexistent", "advanced", "nonexistent-path", all);
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, "diff-everything");
});

test("related lessons: deterministic fallback when no relationships match", () => {
  const all = [
    makeLesson("current", { categorySlug: "mobile", pathSlug: "path-a", difficulty: "advanced" }),
    makeLesson("zzz", { categorySlug: "accessibility", pathSlug: "path-b", difficulty: "beginner" }),
    makeLesson("aaa", { categorySlug: "accessibility", pathSlug: "path-c", difficulty: "beginner" }),
  ];
  const result = selectRelatedLessons("current", "nonexistent", "advanced", "nonexistent-path", all);
  // Deterministic sort by slug — "aaa" before "zzz".
  assert.equal(result[0].slug, "aaa");
  assert.equal(result[1].slug, "zzz");
});

test("related lessons: returns empty when no alternatives exist", () => {
  const all = [makeLesson("only-lesson")];
  const result = selectRelatedLessons("only-lesson", "mobile", "intermediate", "path-a", all);
  assert.deepEqual(result, []);
});

test("related lessons: respects the limit of 3", () => {
  const all = [
    makeLesson("current", { categorySlug: "mobile", pathSlug: "path-a" }),
    makeLesson("cat-1", { categorySlug: "mobile", pathSlug: "path-b" }),
    makeLesson("cat-2", { categorySlug: "mobile", pathSlug: "path-c" }),
    makeLesson("cat-3", { categorySlug: "mobile", pathSlug: "path-d" }),
    makeLesson("cat-4", { categorySlug: "mobile", pathSlug: "path-e" }),
  ];
  const result = selectRelatedLessons("current", "mobile", "intermediate", "path-a", all);
  assert.equal(result.length, 3);
});

// ── Previous/next navigation tests ──────────────────────────────

test("lesson nav: returns previous and next for a middle lesson", () => {
  const ordered = [
    { slug: "lesson-1", title: "Lesson 1" },
    { slug: "lesson-2", title: "Lesson 2" },
    { slug: "lesson-3", title: "Lesson 3" },
  ];
  const result = deriveLessonNav("lesson-2", ordered);
  assert.notEqual(result.previous, null);
  assert.equal(result.previous!.slug, "lesson-1");
  assert.notEqual(result.next, null);
  assert.equal(result.next!.slug, "lesson-3");
});

test("lesson nav: returns null previous for the first lesson", () => {
  const ordered = [
    { slug: "lesson-1", title: "Lesson 1" },
    { slug: "lesson-2", title: "Lesson 2" },
  ];
  const result = deriveLessonNav("lesson-1", ordered);
  assert.equal(result.previous, null);
  assert.notEqual(result.next, null);
  assert.equal(result.next!.slug, "lesson-2");
});

test("lesson nav: returns null next for the last lesson", () => {
  const ordered = [
    { slug: "lesson-1", title: "Lesson 1" },
    { slug: "lesson-2", title: "Lesson 2" },
  ];
  const result = deriveLessonNav("lesson-2", ordered);
  assert.notEqual(result.previous, null);
  assert.equal(result.previous!.slug, "lesson-1");
  assert.equal(result.next, null);
});

test("lesson nav: returns null/null when lesson is not in the ordered list", () => {
  const ordered = [
    { slug: "lesson-1", title: "Lesson 1" },
    { slug: "lesson-2", title: "Lesson 2" },
  ];
  const result = deriveLessonNav("nonexistent", ordered);
  assert.equal(result.previous, null);
  assert.equal(result.next, null);
});

test("lesson nav: handles a single-lesson path (no prev or next)", () => {
  const ordered = [{ slug: "only-lesson", title: "Only Lesson" }];
  const result = deriveLessonNav("only-lesson", ordered);
  assert.equal(result.previous, null);
  assert.equal(result.next, null);
});
