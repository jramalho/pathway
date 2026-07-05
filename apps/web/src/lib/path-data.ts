import "server-only";
import { cache } from "react";
import { getPathwayApiClient } from "./pathway-api";
import { getStrapiUrl } from "./env";
import { resolveStrapiMediaUrl, type LearningPath, type Difficulty } from "@pathway/api";

/**
 * Server-side learning-path detail data composition layer.
 *
 * Fetches a single published learning path from Strapi via the shared
 * `@pathway/api` client and maps it into a route-specific view model
 * for `/paths/[slug]`. Visual components receive this model — they
 * never touch Strapi domain models or raw API responses directly.
 *
 * Revalidation: the route exports `revalidate = 300` (5 minutes),
 * matching the homepage and Explore convention. Published CMS content
 * changes are infrequent and a 5-minute window keeps path pages fresh
 * without hammering Strapi on every request.
 */

export interface PathDetailModule {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: PathDetailLesson[];
}

export interface PathDetailLesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimatedDuration: number;
  difficulty: Difficulty;
}

export interface PathDetailView {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  lessonCount: number;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  category: { name: string; slug: string } | null;
  modules: PathDetailModule[];
}

/** Compact view model for a related-path card. */
export interface RelatedPathItem {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  lessonCount: number;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  category: { name: string; slug: string } | null;
}

/**
 * Load a single published learning path by slug.
 *
 * Wrapped in React `cache()` so the same slug fetch is deduplicated
 * across `generateMetadata` and the page render within a single
 * request — no duplicate Strapi round-trips.
 *
 * Returns a `status` discriminator:
 *   - "ok"      — path found and mapped to a view model
 *   - "missing" — no published path exists for this slug
 *   - "error"   — the CMS request failed (caller renders error boundary)
 *
 * The caller decides how to render each case (notFound vs error).
 */
export const getPathDetailView = cache(
  async (
    slug: string,
    options?: { signal?: AbortSignal },
  ): Promise<
    | { status: "ok"; data: PathDetailView }
    | { status: "missing" }
    | { status: "error"; error: Error }
  > => {
    const api = getPathwayApiClient();
    const strapiBaseUrl = getStrapiUrl();

    let path: LearningPath | null;
    try {
      path = await api.getLearningPathBySlug(slug, {
        signal: options?.signal,
      });
    } catch (err) {
      return {
        status: "error",
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }

    if (!path) {
      return { status: "missing" };
    }

    return { status: "ok", data: toPathDetailView(path, strapiBaseUrl) };
  },
);

/** Map a typed LearningPath domain model into the route view model. */
function toPathDetailView(
  path: LearningPath,
  strapiBaseUrl: string,
): PathDetailView {
  return {
    id: path.id,
    slug: path.slug,
    title: path.title,
    description: path.description,
    difficulty: path.difficulty,
    estimatedDuration: path.estimatedDuration,
    lessonCount: path.lessonCount,
    coverImageUrl: resolveCoverUrl(path.coverImage, strapiBaseUrl),
    coverImageAlt: path.coverImage?.alternativeText ?? null,
    category: path.category
      ? { name: path.category.name, slug: path.category.slug }
      : null,
    modules: path.modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        summary: l.summary,
        estimatedDuration: l.estimatedDuration,
        difficulty: l.difficulty,
      })),
    })),
  };
}

function resolveCoverUrl(
  media: LearningPath["coverImage"],
  baseUrl: string,
): string | null {
  if (!media) return null;
  return resolveStrapiMediaUrl(media.url, baseUrl);
}

/**
 * Return the slugs of all currently published learning paths.
 *
 * Used by `generateStaticParams` so known published paths are
 * prerendered at build time. On-demand generation handles future
 * content; revalidation keeps the static pages fresh.
 */
export async function getPublishedPathSlugs(options?: {
  signal?: AbortSignal;
}): Promise<{ slug: string }[]> {
  const api = getPathwayApiClient();
  let paths: LearningPath[];
  try {
    paths = await api.getPublishedLearningPaths({
      signal: options?.signal,
    });
  } catch {
    // ponytail: if the CMS is unreachable at build time, generate no
    // static params — on-demand generation handles paths at request time.
    // Ceiling: a build with no CMS produces no prerendered path pages.
    // Upgrade path: fail the build in CI once a production CMS is stable.
    return [];
  }
  return paths
    .filter((p) => Boolean(p.slug))
    .map((p) => ({ slug: p.slug }));
}

/** Maximum number of related paths to surface. */
const RELATED_PATHS_LIMIT = 3;

/**
 * Select related learning paths for a given path.
 *
 * Selection rules, in order of preference:
 *   1. paths sharing a real category with the current path
 *   2. paths with matching real difficulty (when no category matches)
 *   3. deterministic published-path fallback excluding the current path
 *
 * The current path is never included. Selection is deterministic (stable
 * sort by slug). Returns an empty array when no other published path
 * exists — the caller renders nothing rather than a forced empty block.
 *
 * This is a typed server-side data boundary — not JSX, not a recommendation
 * engine. It uses only real published Strapi data.
 */
export async function getRelatedPaths(
  currentPath: PathDetailView,
  options?: { signal?: AbortSignal },
): Promise<RelatedPathItem[]> {
  const api = getPathwayApiClient();
  const strapiBaseUrl = getStrapiUrl();

  let publishedPaths: LearningPath[];
  try {
    publishedPaths = await api.getPublishedLearningPaths({
      signal: options?.signal,
    });
  } catch {
    // ponytail: if the CMS is unreachable, no related paths. Ceiling: a
    // page with no CMS produces no related section. Upgrade path: none
    // needed — the section is supplementary, not critical.
    return [];
  }

  // Exclude the current path.
  const candidates = publishedPaths.filter((p) => p.slug !== currentPath.slug);
  if (candidates.length === 0) return [];

  const toRelated = (p: LearningPath): RelatedPathItem => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    difficulty: p.difficulty,
    estimatedDuration: p.estimatedDuration,
    lessonCount: p.lessonCount,
    coverImageUrl: resolveCoverUrl(p.coverImage, strapiBaseUrl),
    coverImageAlt: p.coverImage?.alternativeText ?? null,
    category: p.category
      ? { name: p.category.name, slug: p.category.slug }
      : null,
  });

  // Deterministic sort by slug so results are stable across requests.
  const sorted = [...candidates].sort((a, b) => a.slug.localeCompare(b.slug));

  // 1. Paths sharing a real category with the current path.
  if (currentPath.category) {
    const byCategory = sorted.filter(
      (p) => p.category?.slug === currentPath.category?.slug,
    );
    if (byCategory.length > 0) {
      return byCategory.slice(0, RELATED_PATHS_LIMIT).map(toRelated);
    }
  }

  // 2. Paths with matching real difficulty.
  const byDifficulty = sorted.filter(
    (p) => p.difficulty === currentPath.difficulty,
  );
  if (byDifficulty.length > 0) {
    return byDifficulty.slice(0, RELATED_PATHS_LIMIT).map(toRelated);
  }

  // 3. Deterministic published-path fallback.
  return sorted.slice(0, RELATED_PATHS_LIMIT).map(toRelated);
}