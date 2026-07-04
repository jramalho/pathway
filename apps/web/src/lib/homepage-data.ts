import "server-only";
import { getPathwayApiClient } from "./pathway-api";
import type { LearningPath, LessonPreview } from "@pathway/api";

/**
 * Server-side homepage data composition layer.
 *
 * Fetches published Strapi content via the shared `@pathway/api` client
 * and maps it into a small, homepage-shaped view model. Visual components
 * receive this model — they never touch Strapi domain models directly.
 *
 * Selection rules:
 *   - Featured learning paths: uses the Strapi `featured` flag when present,
 *     falling back to the first published paths so the hero always has
 *     real content to surface.
 *   - Recommended lessons: deterministic selection from the published
 *     learning-path tree (first lesson of each module of each featured
 *     path). Not labelled "popular" — the CMS does not provide popularity.
 *   - Topic summaries: derived from the distinct set of path titles across
 *     featured paths. The shared API package does not expose a category
 *     listing endpoint, so we do not invent one.
 *   - Content counts: surfaced only when the underlying data genuinely
 *     exists (featured paths count, total lessons across featured paths).
 *
 * Revalidation: the homepage route exports `revalidate = 300` (5 minutes).
 * Published CMS content changes are infrequent and a 5-minute window keeps
 * the homepage fresh without hammering Strapi on every request. On-demand
 * revalidation via `revalidateTag` is deferred to a later milestone.
 */

export interface HomepageFeaturedPath {
  slug: string;
  title: string;
  description: string;
  difficulty: LearningPath["difficulty"];
  lessonCount: number;
  estimatedDuration: number;
}

export interface HomepageRecommendedLesson {
  slug: string;
  title: string;
  summary: string;
  difficulty: LessonPreview["difficulty"];
  estimatedDuration: number;
  /** Slug of the parent learning path (for future linking). */
  pathSlug: string;
  /** Title of the parent learning path. */
  pathTitle: string;
}

export interface HomepageTopicSummary {
  label: string;
  count: number;
}

export interface HomepageCounts {
  /** Number of featured learning paths surfaced. */
  featuredPaths: number;
  /** Total lessons across all featured paths. */
  lessonsInFeaturedPaths: number;
}

export interface HomepageData {
  featuredPaths: HomepageFeaturedPath[];
  recommendedLessons: HomepageRecommendedLesson[];
  topics: HomepageTopicSummary[];
  counts: HomepageCounts;
}

/**
 * Compose homepage data from published Strapi content.
 *
 * Returns a `status` discriminator so the page can distinguish a successful
 * empty response (no published content) from a failed request. The caller
 * decides how to render each case.
 */
export async function getHomepageData(options?: {
  signal?: AbortSignal;
}): Promise<
  | { status: "ok"; data: HomepageData }
  | { status: "empty"; data: HomepageData }
  | { status: "error"; error: Error }
> {
  const api = getPathwayApiClient();

  let featuredPaths: LearningPath[];
  try {
    featuredPaths = await api.getFeaturedLearningPaths({
      signal: options?.signal,
      limit: 6,
    });
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }

  // If no featured paths are flagged, fall back to published paths so the
  // hero still surfaces real content rather than an empty state.
  if (featuredPaths.length === 0) {
    try {
      featuredPaths = await api.getPublishedLearningPaths({
        signal: options?.signal,
      });
    } catch (err) {
      return {
        status: "error",
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }

  if (featuredPaths.length === 0) {
    return {
      status: "empty",
      data: {
        featuredPaths: [],
        recommendedLessons: [],
        topics: [],
        counts: { featuredPaths: 0, lessonsInFeaturedPaths: 0 },
      },
    };
  }

  const homepageFeaturedPaths: HomepageFeaturedPath[] = featuredPaths.map(
    (path) => ({
      slug: path.slug,
      title: path.title,
      description: path.description,
      difficulty: path.difficulty,
      lessonCount: path.lessonCount,
      estimatedDuration: path.estimatedDuration,
    }),
  );

  // Deterministic recommended lessons: first lesson of each module across
  // featured paths. Capped to keep the hero lightweight.
  const RECOMMENDED_LIMIT = 6;
  const recommendedLessons: HomepageRecommendedLesson[] = [];
  for (const path of featuredPaths) {
    for (const learningModule of path.modules) {
      const firstLesson = learningModule.lessons[0];
      if (!firstLesson) continue;
      recommendedLessons.push({
        slug: firstLesson.slug,
        title: firstLesson.title,
        summary: firstLesson.summary,
        difficulty: firstLesson.difficulty,
        estimatedDuration: firstLesson.estimatedDuration,
        pathSlug: path.slug,
        pathTitle: path.title,
      });
      if (recommendedLessons.length >= RECOMMENDED_LIMIT) break;
    }
    if (recommendedLessons.length >= RECOMMENDED_LIMIT) break;
  }

  // Topic summaries: derived from featured path titles since the shared
  // API package does not expose a category listing endpoint. Each featured
  // path contributes one topic entry labelled with its title.
  const topics: HomepageTopicSummary[] = homepageFeaturedPaths.map((path) => ({
    label: path.title,
    count: path.lessonCount,
  }));

  const counts: HomepageCounts = {
    featuredPaths: homepageFeaturedPaths.length,
    lessonsInFeaturedPaths: homepageFeaturedPaths.reduce(
      (sum, path) => sum + path.lessonCount,
      0,
    ),
  };

  return {
    status: "ok",
    data: {
      featuredPaths: homepageFeaturedPaths,
      recommendedLessons,
      topics,
      counts,
    },
  };
}