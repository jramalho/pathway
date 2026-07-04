/**
 * Runnable self-check for the Explore filter/search logic.
 *
 * Uses Node's built-in `node:test` — no framework, no fixtures beyond a
 * tiny inline catalog. Run with:
 *   node --experimental-strip-types --test apps/web/src/lib/explore-filters.test.ts
 *
 * This is the smallest thing that fails if the pure filtering logic
 * breaks. It does not render React or hit Strapi.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { ExploreData } from "./explore-data.ts";
import {
  parseExploreFilters,
  serializeExploreFilters,
  hasActiveFilters,
  applyExploreFilters,
  deriveAvailableTopics,
  deriveAvailableDifficulties,
  EMPTY_FILTERS,
  type ExploreSearchParams,
  type ExploreFilters,
} from "./explore-filters.ts";

const catalog: ExploreData = {
  paths: [
    {
      slug: "react-native-performance",
      title: "React Native Performance",
      description: "Identify and fix performance bottlenecks in React Native apps.",
      difficulty: "intermediate",
      estimatedDuration: 180,
      lessonCount: 9,
      coverImageUrl: null,
      coverImageAlt: null,
    },
    {
      slug: "accessibility-fundamentals",
      title: "Accessibility Fundamentals",
      description: "Build accessible mobile interfaces with WCAG in mind.",
      difficulty: "beginner",
      estimatedDuration: 90,
      lessonCount: 4,
      coverImageUrl: null,
      coverImageAlt: null,
    },
  ],
  lessons: [
    {
      slug: "flashlist-rendering",
      title: "FlashList rendering pitfalls",
      summary: "Avoid common FlashList re-render traps.",
      difficulty: "advanced",
      estimatedDuration: 12,
      pathSlug: "react-native-performance",
      pathTitle: "React Native Performance",
    },
    {
      slug: "screen-reader-basics",
      title: "Screen reader basics",
      summary: "VoiceOver and TalkBack fundamentals for accessibility.",
      difficulty: "beginner",
      estimatedDuration: 8,
      pathSlug: "accessibility-fundamentals",
      pathTitle: "Accessibility Fundamentals",
    },
  ],
};

test("parseExploreFilters: empty params → empty filters", () => {
  assert.deepEqual(parseExploreFilters({}), EMPTY_FILTERS);
});

test("parseExploreFilters: valid values are normalized", () => {
  const raw: ExploreSearchParams = {
    q: "  FlashList   rendering ",
    topic: "mobile",
    difficulty: "advanced",
  };
  assert.deepEqual(parseExploreFilters(raw), {
    q: "FlashList rendering",
    topic: "mobile",
    difficulty: "advanced",
  });
});

test("parseExploreFilters: invalid difficulty is dropped, not thrown", () => {
  const filters = parseExploreFilters({ difficulty: "expert" });
  assert.equal(filters.difficulty, "");
});

test("parseExploreFilters: array values take first element", () => {
  const filters = parseExploreFilters({ q: ["first", "second"] });
  assert.equal(filters.q, "first");
});

test("serializeExploreFilters: empty values omitted", () => {
  assert.deepEqual(serializeExploreFilters(EMPTY_FILTERS), {});
});

test("serializeExploreFilters: only non-empty values present", () => {
  assert.deepEqual(
    serializeExploreFilters({ q: "perf", topic: "", difficulty: "advanced" }),
    { q: "perf", difficulty: "advanced" },
  );
});

test("hasActiveFilters: true when any filter set", () => {
  assert.equal(hasActiveFilters(EMPTY_FILTERS), false);
  assert.equal(hasActiveFilters({ q: "", topic: "x", difficulty: "" }), true);
});

test("applyExploreFilters: no filters returns everything", () => {
  const res = applyExploreFilters(catalog, EMPTY_FILTERS);
  assert.equal(res.paths.length, 2);
  assert.equal(res.lessons.length, 2);
  assert.equal(res.totalCount, 4);
});

test("applyExploreFilters: text search matches path title", () => {
  const res = applyExploreFilters(catalog, { q: "performance", topic: "", difficulty: "" });
  assert.equal(res.paths.length, 1);
  assert.equal(res.paths[0].slug, "react-native-performance");
});

test("applyExploreFilters: text search matches lesson summary", () => {
  const res = applyExploreFilters(catalog, { q: "voiceover", topic: "", difficulty: "" });
  assert.equal(res.lessons.length, 1);
  assert.equal(res.lessons[0].slug, "screen-reader-basics");
});

test("applyExploreFilters: difficulty filters both paths and lessons", () => {
  const res = applyExploreFilters(catalog, { q: "", topic: "", difficulty: "beginner" });
  assert.equal(res.paths.length, 1);
  assert.equal(res.paths[0].slug, "accessibility-fundamentals");
  assert.equal(res.lessons.length, 1);
  assert.equal(res.lessons[0].slug, "screen-reader-basics");
});

test("applyExploreFilters: topic keyword matches path description", () => {
  const res = applyExploreFilters(catalog, { q: "", topic: "wcag", difficulty: "" });
  assert.equal(res.paths.length, 1);
  assert.equal(res.paths[0].slug, "accessibility-fundamentals");
});

test("applyExploreFilters: combined filters narrow results", () => {
  const res = applyExploreFilters(catalog, { q: "flashlist", topic: "", difficulty: "advanced" });
  assert.equal(res.lessons.length, 1);
  assert.equal(res.paths.length, 0);
  assert.equal(res.totalCount, 1);
});

test("applyExploreFilters: no matches returns empty sets", () => {
  const res = applyExploreFilters(catalog, { q: "nonexistent-term", topic: "", difficulty: "" });
  assert.equal(res.totalCount, 0);
});

// ---------------------------------------------------------------------------
// Topic derivation + keyword matching
// ---------------------------------------------------------------------------

test("deriveAvailableTopics: returns only topics with matching content", () => {
  const topics = deriveAvailableTopics(catalog);
  // "React Native Performance" matches Mobile keywords; "Accessibility Fundamentals" matches Accessibility
  const slugs = topics.map((t) => t.slug);
  assert.ok(slugs.includes("mobile"), "mobile topic should be available");
  assert.ok(slugs.includes("accessibility"), "accessibility topic should be available");
  assert.ok(!slugs.includes("product"), "product topic should not be available");
  assert.ok(!slugs.includes("ai"), "ai topic should not be available");
});

test("deriveAvailableTopics: returns empty for catalog with no keyword matches", () => {
  const noMatch: ExploreData = {
    paths: [
      {
        slug: "generic-path",
        title: "Generic Title",
        description: "A description with no canonical keywords.",
        difficulty: "beginner",
        estimatedDuration: 30,
        lessonCount: 1,
        coverImageUrl: null,
        coverImageAlt: null,
      },
    ],
    lessons: [],
  };
  assert.deepEqual(deriveAvailableTopics(noMatch), []);
});

test("applyExploreFilters: canonical topic 'mobile' matches React Native content", () => {
  const res = applyExploreFilters(catalog, { q: "", topic: "mobile", difficulty: "" });
  // Both paths contain mobile keywords: "React Native" and "mobile interfaces"
  assert.equal(res.paths.length, 2);
  assert.ok(res.paths.some((p) => p.slug === "react-native-performance"));
});

test("applyExploreFilters: canonical topic 'accessibility' matches accessibility content", () => {
  const res = applyExploreFilters(catalog, { q: "", topic: "accessibility", difficulty: "" });
  assert.equal(res.paths.length, 1);
  assert.equal(res.paths[0].slug, "accessibility-fundamentals");
  assert.equal(res.lessons.length, 1);
  assert.equal(res.lessons[0].slug, "screen-reader-basics");
});

test("applyExploreFilters: non-canonical topic falls back to substring match", () => {
  const res = applyExploreFilters(catalog, { q: "", topic: "fundamentals", difficulty: "" });
  assert.equal(res.paths.length, 1);
  assert.equal(res.paths[0].slug, "accessibility-fundamentals");
});

test("deriveAvailableDifficulties: returns only difficulties present in content", () => {
  const diffs = deriveAvailableDifficulties(catalog);
  // catalog has beginner, intermediate, advanced
  assert.deepEqual(diffs, ["beginner", "intermediate", "advanced"]);
});

test("deriveAvailableDifficulties: returns subset when not all levels present", () => {
  const partial: ExploreData = {
    paths: [
      {
        slug: "p1",
        title: "Path 1",
        description: "Desc",
        difficulty: "beginner",
        estimatedDuration: 10,
        lessonCount: 1,
        coverImageUrl: null,
        coverImageAlt: null,
      },
    ],
    lessons: [],
  };
  assert.deepEqual(deriveAvailableDifficulties(partial), ["beginner"]);
});

// ---------------------------------------------------------------------------
// Clear / reset behavior — clearing filters produces the clean canonical model
// ---------------------------------------------------------------------------

test("clearing all filters via EMPTY_FILTERS produces clean URL and full results", () => {
  // Simulate: user had q + topic + difficulty active, then clicks "Clear filters"
  const active: ExploreFilters = { q: "perf", topic: "mobile", difficulty: "advanced" };
  assert.equal(hasActiveFilters(active), true);

  // Reset to canonical empty state
  const cleared = EMPTY_FILTERS;
  assert.equal(hasActiveFilters(cleared), false);

  // Serializer omits all empty values → clean /explore URL
  assert.deepEqual(serializeExploreFilters(cleared), {});

  // Filtering with cleared state returns the full catalog
  const res = applyExploreFilters(catalog, cleared);
  assert.equal(res.paths.length, 2);
  assert.equal(res.lessons.length, 2);
  assert.equal(res.totalCount, 4);
});

test("clearing only q preserves topic and difficulty", () => {
  // Simulate: user clears the search input but keeps topic + difficulty
  const before: ExploreFilters = { q: "flashlist", topic: "mobile", difficulty: "advanced" };
  const after: ExploreFilters = { ...before, q: "" };
  assert.equal(after.q, "");
  assert.equal(after.topic, "mobile");
  assert.equal(after.difficulty, "advanced");
  assert.equal(hasActiveFilters(after), true);
  assert.deepEqual(serializeExploreFilters(after), { topic: "mobile", difficulty: "advanced" });
});

test("selecting All topic removes only the topic parameter", () => {
  const before: ExploreFilters = { q: "perf", topic: "mobile", difficulty: "advanced" };
  const after: ExploreFilters = { ...before, topic: "" };
  assert.equal(after.q, "perf");
  assert.equal(after.topic, "");
  assert.equal(after.difficulty, "advanced");
  assert.deepEqual(serializeExploreFilters(after), { q: "perf", difficulty: "advanced" });
});

test("selecting All levels removes only the difficulty parameter", () => {
  const before: ExploreFilters = { q: "perf", topic: "mobile", difficulty: "advanced" };
  const after: ExploreFilters = { ...before, difficulty: "" };
  assert.equal(after.q, "perf");
  assert.equal(after.topic, "mobile");
  assert.equal(after.difficulty, "");
  assert.deepEqual(serializeExploreFilters(after), { q: "perf", topic: "mobile" });
});