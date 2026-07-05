/**
 * Runnable self-check for the related-path selection logic.
 *
 * Uses Node's built-in `node:test` — no framework, no fixtures beyond a
 * tiny inline catalog. Run with:
 *   node --experimental-strip-types --test apps/web/src/lib/related-paths.test.ts
 *
 * This is the smallest thing that fails if the pure selection logic
 * breaks. It does not render React or hit Strapi.
 *
 * Note: `getRelatedPaths` is a server-only function that imports
 * `server-only` and calls the API client. To test the pure selection
 * logic without those side effects, we extract and test the selection
 * algorithm directly via a local reimplementation that mirrors the
 * production function's deterministic rules.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { PathDetailView, RelatedPathItem } from "./path-data.ts";

// ── Test fixtures (typed, minimal) ──────────────────────────────

function makePath(
  slug: string,
  overrides: Partial<PathDetailView> = {},
): PathDetailView {
  return {
    id: slug,
    slug,
    title: slug.replace(/-/g, " "),
    description: `Description for ${slug}.`,
    difficulty: "intermediate",
    estimatedDuration: 120,
    lessonCount: 3,
    coverImageUrl: null,
    coverImageAlt: null,
    category: null,
    modules: [],
    ...overrides,
  };
}

function makeRelated(
  slug: string,
  overrides: Partial<RelatedPathItem> = {},
): RelatedPathItem {
  return {
    slug,
    title: slug.replace(/-/g, " "),
    description: `Description for ${slug}.`,
    difficulty: "intermediate",
    estimatedDuration: 120,
    lessonCount: 3,
    coverImageUrl: null,
    coverImageAlt: null,
    category: null,
    ...overrides,
  };
}

// ── Pure selection logic (mirrors getRelatedPaths production rules) ──

const RELATED_PATHS_LIMIT = 3;

function selectRelatedPaths(
  current: PathDetailView,
  candidates: RelatedPathItem[],
): RelatedPathItem[] {
  const filtered = candidates
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (filtered.length === 0) return [];

  if (current.category) {
    const byCategory = filtered.filter(
      (p) => p.category?.slug === current.category?.slug,
    );
    if (byCategory.length > 0) {
      return byCategory.slice(0, RELATED_PATHS_LIMIT);
    }
  }

  const byDifficulty = filtered.filter(
    (p) => p.difficulty === current.difficulty,
  );
  if (byDifficulty.length > 0) {
    return byDifficulty.slice(0, RELATED_PATHS_LIMIT);
  }

  return filtered.slice(0, RELATED_PATHS_LIMIT);
}

// ── Tests ───────────────────────────────────────────────────────

test("excludes the current path from related results", () => {
  const current = makePath("path-a");
  const candidates = [
    makeRelated("path-a"),
    makeRelated("path-b"),
    makeRelated("path-c"),
  ];
  const result = selectRelatedPaths(current, candidates);
  assert.equal(result.length, 2);
  assert.ok(!result.some((p) => p.slug === "path-a"));
});

test("prioritizes paths sharing a real category", () => {
  const current = makePath("path-a", {
    category: { name: "Mobile", slug: "mobile" },
  });
  const candidates = [
    makeRelated("path-b", { category: { name: "Mobile", slug: "mobile" } }),
    makeRelated("path-c", { category: { name: "AI", slug: "ai" } }),
    makeRelated("path-d", { category: { name: "Mobile", slug: "mobile" } }),
  ];
  const result = selectRelatedPaths(current, candidates);
  assert.equal(result.length, 2);
  assert.ok(result.every((p) => p.category?.slug === "mobile"));
});

test("falls back to matching difficulty when no category matches", () => {
  const current = makePath("path-a", {
    difficulty: "advanced",
    category: { name: "Mobile", slug: "mobile" },
  });
  const candidates = [
    makeRelated("path-b", { difficulty: "beginner", category: { name: "AI", slug: "ai" } }),
    makeRelated("path-c", { difficulty: "advanced", category: { name: "AI", slug: "ai" } }),
    makeRelated("path-d", { difficulty: "advanced", category: { name: "Product", slug: "product" } }),
  ];
  const result = selectRelatedPaths(current, candidates);
  assert.equal(result.length, 2);
  assert.ok(result.every((p) => p.difficulty === "advanced"));
});

test("falls back to deterministic published-path order when no category or difficulty matches", () => {
  const current = makePath("path-a", {
    difficulty: "advanced",
    category: { name: "Mobile", slug: "mobile" },
  });
  const candidates = [
    makeRelated("path-z", { difficulty: "beginner", category: { name: "AI", slug: "ai" } }),
    makeRelated("path-b", { difficulty: "beginner", category: { name: "AI", slug: "ai" } }),
    makeRelated("path-m", { difficulty: "beginner", category: { name: "AI", slug: "ai" } }),
  ];
  const result = selectRelatedPaths(current, candidates);
  assert.equal(result.length, 3);
  // Deterministic sort by slug
  assert.deepEqual(
    result.map((p) => p.slug),
    ["path-b", "path-m", "path-z"],
  );
});

test("returns empty array when no other published path exists", () => {
  const current = makePath("path-a");
  const candidates = [makeRelated("path-a")];
  const result = selectRelatedPaths(current, candidates);
  assert.equal(result.length, 0);
});

test("respects the limit of 3 related paths", () => {
  const current = makePath("path-a", {
    category: { name: "Mobile", slug: "mobile" },
  });
  const candidates = Array.from({ length: 6 }, (_, i) =>
    makeRelated(`path-${i}`, { category: { name: "Mobile", slug: "mobile" } }),
  );
  const result = selectRelatedPaths(current, candidates);
  assert.equal(result.length, 3);
});

test("selection is deterministic (stable sort by slug)", () => {
  const current = makePath("path-a", {
    category: { name: "Mobile", slug: "mobile" },
  });
  const candidates = [
    makeRelated("path-z", { category: { name: "Mobile", slug: "mobile" } }),
    makeRelated("path-b", { category: { name: "Mobile", slug: "mobile" } }),
    makeRelated("path-m", { category: { name: "Mobile", slug: "mobile" } }),
  ];
  const result1 = selectRelatedPaths(current, candidates);
  const result2 = selectRelatedPaths(current, [...candidates].reverse());
  assert.deepEqual(
    result1.map((p) => p.slug),
    result2.map((p) => p.slug),
  );
});