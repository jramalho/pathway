import type { Difficulty } from "@pathway/api";
import type {
  ExploreData,
  ExploreLessonItem,
  ExplorePathItem,
  ExploreTopic,
} from "./explore-data";

/**
 * Typed, URL-compatible filter model for the Explore page.
 *
 * URL query parameter names:
 *   - `q`          text search
 *   - `topic`      topic/category slug (keyword-matched in V1)
 *   - `difficulty` one of "beginner" | "intermediate" | "advanced"
 *
 * Rules:
 *   - Empty values are omitted from the URL.
 *   - Query values are normalized safely (trimmed, single-space collapsed).
 *   - Unknown/invalid topic and difficulty values are silently ignored
 *     without crashing — the page still renders with a canonical empty
 *     filter state.
 *   - No `any`, no unsafe casts, no blind trust of `searchParams`.
 *   - The canonical filter state shape is explainable and extensible:
 *     add a new field here + a parser + a serializer to extend.
 */

export const EXPLORE_DIFFICULTIES: readonly Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

/** Set form of EXPLORE_DIFFICULTIES for O(1) validation without casts. */
const VALID_DIFFICULTIES: ReadonlySet<string> = new Set(
  EXPLORE_DIFFICULTIES as readonly string[],
);

/**
 * Canonical Pathway topic labels used as a fallback when the shared API
 * does not expose real CMS categories. These are NOT fetched from Strapi —
 * they are static, curated keyword mappings that match against real text
 * fields (title, description, summary, parent path title). When the API
 * later exposes categories, `deriveAvailableTopics` can use real data and
 * this fallback becomes unnecessary.
 */
interface CanonicalTopic {
  slug: string;
  label: string;
  keywords: string[];
}

const CANONICAL_TOPICS: readonly CanonicalTopic[] = [
  {
    slug: "mobile",
    label: "Mobile",
    keywords: [
      "mobile",
      "react-native",
      "react native",
      "android",
      "ios",
      "expo",
      "flashlist",
      "re-render",
      "performance",
    ],
  },
  {
    slug: "accessibility",
    label: "Accessibility",
    keywords: ["accessibility", "a11y", "wcag", "screen reader", "voiceover"],
  },
  {
    slug: "product",
    label: "Product",
    keywords: ["product", "ux", "design", "user", "workflow"],
  },
  {
    slug: "ai",
    label: "AI",
    keywords: ["ai", "artificial-intelligence", "llm", "machine learning", "ml", "gpt"],
  },
] as const;

/** Shape of the raw Next.js `searchParams` object (values may be arrays). */
export type ExploreSearchParams = {
  [key: string]: string | string[] | undefined;
};

/** Canonical, validated filter state derived from URL params. */
export interface ExploreFilters {
  /** Trimmed search query, or empty string when absent. */
  q: string;
  /** Topic slug, or empty string when absent. Empty means "all topics". */
  topic: string;
  /** Difficulty, or empty string when absent. Empty means "all levels". */
  difficulty: string;
}

export const EMPTY_FILTERS: ExploreFilters = { q: "", topic: "", difficulty: "" };

/**
 * Read a single string value from a Next.js searchParams entry.
 * Arrays take the first element; undefined/empty → "".
 */
function readSingle(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

/** Normalize a raw query string: trim and collapse internal whitespace. */
function normalizeQuery(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/** Validate a difficulty value against the known enum. Returns the canonical
 * lowercase value, or "" if invalid — no cast needed. */
function parseDifficulty(value: string): string {
  const trimmed = value.trim().toLowerCase();
  return VALID_DIFFICULTIES.has(trimmed) ? trimmed : "";
}

/**
 * Parse raw Next.js searchParams into a canonical, validated filter state.
 * Invalid topic/difficulty values are dropped (empty string), never thrown.
 */
export function parseExploreFilters(raw: ExploreSearchParams): ExploreFilters {
  return {
    q: normalizeQuery(readSingle(raw.q)),
    topic: normalizeQuery(readSingle(raw.topic)),
    difficulty: parseDifficulty(readSingle(raw.difficulty)),
  };
}

/**
 * Serialize a canonical filter state into URL query params, omitting
 * empty values so the URL stays clean and shareable.
 */
export function serializeExploreFilters(
  filters: ExploreFilters,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.q) params.q = filters.q;
  if (filters.topic) params.topic = filters.topic;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  return params;
}

/** True when any filter is active (non-empty). */
export function hasActiveFilters(filters: ExploreFilters): boolean {
  return filters.q !== "" || filters.topic !== "" || filters.difficulty !== "";
}

// ---------------------------------------------------------------------------
// Pure filtering + search logic
// ---------------------------------------------------------------------------
//
// V1 search strategy: case-insensitive substring match across the real text
// fields available on the view model (title, description/summary, parent
// path title for lessons, topic keyword for paths). This is NOT full-text
// search — it is a transparent, basic keyword match suitable for a
// portfolio V1 with a small published catalog. The server still fetches
// the published data from Strapi; filtering is pure and separated from
// the visual component so it is testable without rendering.

/** Lowercase + trim for case-insensitive comparison. */
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/** Build the searchable haystack for a learning path. */
function pathHaystack(path: ExplorePathItem): string {
  return normalize(`${path.title} ${path.description} ${path.slug}`);
}

/** Build the searchable haystack for a lesson (includes parent path title). */
function lessonHaystack(lesson: ExploreLessonItem): string {
  return normalize(
    `${lesson.title} ${lesson.summary} ${lesson.slug} ${lesson.pathTitle}`,
  );
}

/** Topic keyword haystack for a path (title + description + slug). */
function pathTopicHaystack(path: ExplorePathItem): string {
  return normalize(`${path.title} ${path.description} ${path.slug}`);
}

/** Topic keyword haystack for a lesson (title + summary + parent path title). */
function lessonTopicHaystack(lesson: ExploreLessonItem): string {
  return normalize(
    `${lesson.title} ${lesson.summary} ${lesson.pathTitle}`,
  );
}

/**
 * True if the topic matches the haystack.
 *
 * Canonical topic slugs (mobile, accessibility, product, ai) are expanded
 * to their keyword lists — any keyword match counts. Non-canonical topic
 * strings (e.g. a future real CMS category slug) fall through to plain
 * substring matching.
 */
function matchesTopic(topic: string, haystack: string): boolean {
  if (!topic) return true;
  const canonical = CANONICAL_TOPICS.find((t) => t.slug === topic);
  if (canonical) {
    return canonical.keywords.some((kw) => haystack.includes(normalize(kw)));
  }
  return haystack.includes(normalize(topic));
}

/** True if the difficulty matches (empty difficulty = all). */
function matchesDifficulty(difficulty: string, value: Difficulty): boolean {
  if (!difficulty) return true;
  return value === difficulty;
}

/** True if the query appears in the haystack (empty query = all). */
function matchesQuery(q: string, haystack: string): boolean {
  if (!q) return true;
  return haystack.includes(normalize(q));
}

/** Filter learning paths by the full filter state. */
export function filterPaths(
  paths: ExplorePathItem[],
  filters: ExploreFilters,
): ExplorePathItem[] {
  return paths.filter((path) => {
    return (
      matchesDifficulty(filters.difficulty, path.difficulty) &&
      matchesTopic(filters.topic, pathTopicHaystack(path)) &&
      matchesQuery(filters.q, pathHaystack(path))
    );
  });
}

/** Filter lessons by the full filter state. */
export function filterLessons(
  lessons: ExploreLessonItem[],
  filters: ExploreFilters,
): ExploreLessonItem[] {
  return lessons.filter((lesson) => {
    return (
      matchesDifficulty(filters.difficulty, lesson.difficulty) &&
      matchesTopic(filters.topic, lessonTopicHaystack(lesson)) &&
      matchesQuery(filters.q, lessonHaystack(lesson))
    );
  });
}

/** Apply both filters and return the combined result set + count. */
export function applyExploreFilters(
  data: ExploreData,
  filters: ExploreFilters,
): {
  paths: ExplorePathItem[];
  lessons: ExploreLessonItem[];
  totalCount: number;
} {
  const paths = filterPaths(data.paths, filters);
  const lessons = filterLessons(data.lessons, filters);
  return { paths, lessons, totalCount: paths.length + lessons.length };
}

/**
 * Derive the available topic options from the published content.
 *
 * Returns only canonical topics that have at least one matching path or
 * lesson. This ensures the topic chips are meaningful for the current
 * catalog — no empty filter options. When the shared API exposes real
 * CMS categories, this function can be extended to use them directly.
 */
export function deriveAvailableTopics(data: ExploreData): ExploreTopic[] {
  return CANONICAL_TOPICS.filter((topic) => {
    const hasPaths = data.paths.some((p) =>
      matchesTopic(topic.slug, pathTopicHaystack(p)),
    );
    const hasLessons = data.lessons.some((l) =>
      matchesTopic(topic.slug, lessonTopicHaystack(l)),
    );
    return hasPaths || hasLessons;
  }).map((topic) => ({ slug: topic.slug, label: topic.label }));
}

/**
 * Derive the available difficulty options from the published content.
 * Returns only difficulties that exist in at least one path or lesson,
 * in canonical order.
 */
export function deriveAvailableDifficulties(data: ExploreData): Difficulty[] {
  const present = new Set<Difficulty>();
  for (const p of data.paths) present.add(p.difficulty);
  for (const l of data.lessons) present.add(l.difficulty);
  return EXPLORE_DIFFICULTIES.filter((d) => present.has(d));
}