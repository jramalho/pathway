import type { LearningPath, LessonPreview } from "@pathway/api";

/**
 * Topic taxonomy for Explore filters.
 *
 * The domain models (LearningPath, LessonPreview) do not have explicit
 * tags or categories fields. Topic matching is done by searching the
 * real text fields (title, description, summary, slug) for keywords
 * that map to each topic. This is a UI-only normalization layer —
 * it does not invent content or alter the API.
 *
 * If the API later adds a categories/tags field, this mapping can
 * be extended to use it directly.
 */

export type Topic = "All" | "Mobile" | "Accessibility" | "Product" | "AI";

export const TOPICS: Topic[] = ["All", "Mobile", "Accessibility", "Product", "AI"];

/** Keywords that map a real text field value to a topic. */
const TOPIC_KEYWORDS: Record<Exclude<Topic, "All">, string[]> = {
  Mobile: ["mobile", "react-native", "react native", "android", "ios", "expo", "flashlist", "re-render", "performance"],
  Accessibility: ["accessibility", "a11y", "wcag", "screen reader", "voiceover"],
  Product: ["product", "ux", "design", "user", "workflow"],
  AI: ["ai", "artificial-intelligence", "llm", "machine learning", "ml", "gpt"],
};

/** Normalize a string for case-insensitive comparison. */
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/** Check if any keyword for a topic appears in the given text. */
function matchesTopic(topic: Topic, text: string): boolean {
  if (topic === "All") return true;
  const normalized = normalize(text);
  const keywords = TOPIC_KEYWORDS[topic];
  return keywords.some((kw) => normalized.includes(kw));
}

/**
 * Filter learning paths by topic. Matches against title, description,
 * and slug — the real text fields available on LearningPath.
 */
export function filterPathsByTopic(paths: LearningPath[], topic: Topic): LearningPath[] {
  if (topic === "All") return paths;
  return paths.filter((path) => {
    const haystack = `${path.title} ${path.description} ${path.slug}`;
    return matchesTopic(topic, haystack);
  });
}

/**
 * Filter lessons by topic. Lessons have title, summary, slug, and
 * difficulty. The parent path title is included for context.
 */
export function filterLessonsByTopic(
  lessons: { lesson: LessonPreview; pathTitle: string }[],
  topic: Topic,
): { lesson: LessonPreview; pathTitle: string }[] {
  if (topic === "All") return lessons;
  return lessons.filter(({ lesson, pathTitle }) => {
    const haystack = `${lesson.title} ${lesson.summary} ${lesson.slug} ${pathTitle}`;
    return matchesTopic(topic, haystack);
  });
}

/**
 * Search learning paths by query text. Case-insensitive, trimmed.
 * Matches against title, description, and slug.
 */
export function searchPaths(paths: LearningPath[], query: string): LearningPath[] {
  const q = normalize(query);
  if (!q) return paths;
  return paths.filter((path) => {
    const haystack = `${path.title} ${path.description} ${path.slug}`;
    return normalize(haystack).includes(q);
  });
}

/**
 * Search lessons by query text. Case-insensitive, trimmed.
 * Matches against title, summary, slug, and parent path title.
 */
export function searchLessons(
  lessons: { lesson: LessonPreview; pathTitle: string }[],
  query: string,
): { lesson: LessonPreview; pathTitle: string }[] {
  const q = normalize(query);
  if (!q) return lessons;
  return lessons.filter(({ lesson, pathTitle }) => {
    const haystack = `${lesson.title} ${lesson.summary} ${lesson.slug} ${pathTitle}`;
    return normalize(haystack).includes(q);
  });
}

/** Flatten all lessons from all paths, preserving parent path title. */
export function flattenLessons(paths: LearningPath[]): { lesson: LessonPreview; pathTitle: string }[] {
  const results: { lesson: LessonPreview; pathTitle: string }[] = [];
  for (const path of paths) {
    for (const module of path.modules) {
      for (const lesson of module.lessons) {
        results.push({ lesson, pathTitle: path.title });
      }
    }
  }
  return results;
}
