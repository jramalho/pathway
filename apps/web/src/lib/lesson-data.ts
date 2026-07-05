import "server-only";
import { cache } from "react";
import { getPathwayApiClient } from "./pathway-api";
import { getStrapiUrl } from "./env";
import {
  resolveStrapiMediaUrl,
  type Difficulty,
  type LessonDetail,
} from "@pathway/api";

/**
 * Server-side lesson detail data composition layer.
 *
 * Fetches a single published lesson from Strapi via the shared
 * `@pathway/api` client and maps it into a route-specific view model
 * for `/lessons/[slug]`. Visual components receive this model — they
 * never touch Strapi domain models or raw API responses directly.
 *
 * Revalidation: the route exports `revalidate = 300` (5 minutes),
 * matching the homepage, Explore, and path-route convention. Published
 * CMS content changes are infrequent and a 5-minute window keeps lesson
 * pages fresh without hammering Strapi on every request.
 */

export interface LessonDetailView {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Lesson body as Markdown (Strapi richtext default editor). */
  body: string;
  estimatedDuration: number;
  difficulty: Difficulty;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  videoThumbnailAlt: string | null;
  publishedAt: string | null;
  author: {
    name: string;
    shortBio: string | null;
    avatarUrl: string | null;
    avatarAlt: string | null;
  } | null;
  category: { name: string; slug: string } | null;
  learningPath: {
    title: string;
    slug: string;
    description: string | null;
  } | null;
  module: {
    title: string;
    description: string | null;
    order: number;
  } | null;
}

/**
 * Load a single published lesson by slug.
 *
 * Wrapped in React `cache()` so the same slug fetch is deduplicated
 * across `generateMetadata` and the page render within a single
 * request — no duplicate Strapi round-trips.
 *
 * Returns a `status` discriminator:
 *   - "ok"      — lesson found and mapped to a view model
 *   - "missing" — no published lesson exists for this slug
 *   - "error"   — the CMS request failed (caller renders error boundary)
 *
 * The caller decides how to render each case (notFound vs error).
 */
export const getLessonDetailView = cache(
  async (
    slug: string,
    options?: { signal?: AbortSignal },
  ): Promise<
    | { status: "ok"; data: LessonDetailView }
    | { status: "missing" }
    | { status: "error"; error: Error }
  > => {
    const api = getPathwayApiClient();
    const strapiBaseUrl = getStrapiUrl();

    let lesson: LessonDetail | null;
    try {
      lesson = await api.getLessonBySlug(slug, {
        signal: options?.signal,
      });
    } catch (err) {
      return {
        status: "error",
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }

    if (!lesson) {
      return { status: "missing" };
    }

    return { status: "ok", data: toLessonDetailView(lesson, strapiBaseUrl) };
  },
);

/** Map a typed LessonDetail domain model into the route view model. */
function toLessonDetailView(
  lesson: LessonDetail,
  strapiBaseUrl: string,
): LessonDetailView {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    summary: lesson.summary,
    body: lesson.body,
    estimatedDuration: lesson.estimatedDuration,
    difficulty: lesson.difficulty,
    videoUrl: lesson.videoUrl,
    videoThumbnailUrl: resolveMediaUrl(lesson.videoThumbnail?.url ?? null, strapiBaseUrl),
    videoThumbnailAlt: lesson.videoThumbnail?.alternativeText ?? null,
    publishedAt: lesson.publishedAt,
    author: lesson.author
      ? {
          name: lesson.author.name,
          shortBio: lesson.author.shortBio,
          avatarUrl: resolveMediaUrl(lesson.author.avatar?.url ?? null, strapiBaseUrl),
          avatarAlt: lesson.author.avatar?.alternativeText ?? null,
        }
      : null,
    category: lesson.category
      ? { name: lesson.category.name, slug: lesson.category.slug }
      : null,
    learningPath: lesson.learningPath
      ? {
          title: lesson.learningPath.title,
          slug: lesson.learningPath.slug,
          description: lesson.learningPath.description,
        }
      : null,
    module: lesson.module
      ? {
          title: lesson.module.title,
          description: lesson.module.description,
          order: lesson.module.order,
        }
      : null,
  };
}

function resolveMediaUrl(
  url: string | null,
  baseUrl: string,
): string | null {
  if (!url) return null;
  return resolveStrapiMediaUrl(url, baseUrl);
}

/**
 * Return the slugs of all currently published lessons.
 *
 * Used by `generateStaticParams` so known published lessons are
 * prerendered at build time. On-demand generation handles future
 * content; revalidation keeps the static pages fresh.
 *
 * The shared API package does not expose a standalone published-lessons
 * listing endpoint, so we derive lesson slugs from the published
 * learning-path tree (each module's lessons). This reuses the existing
 * `getPublishedLearningPaths` call — no duplicate API implementation.
 */
export async function getPublishedLessonSlugs(options?: {
  signal?: AbortSignal;
}): Promise<{ slug: string }[]> {
  const api = getPathwayApiClient();
  let paths: import("@pathway/api").LearningPath[];
  try {
    paths = await api.getPublishedLearningPaths({
      signal: options?.signal,
    });
  } catch {
    // ponytail: if the CMS is unreachable at build time, generate no
    // static params — on-demand generation handles lessons at request time.
    // Ceiling: a build with no CMS produces no prerendered lesson pages.
    // Upgrade path: fail the build in CI once a production CMS is stable.
    return [];
  }
  const slugs: { slug: string }[] = [];
  const seen = new Set<string>();
  for (const path of paths) {
    for (const learningModule of path.modules) {
      for (const lesson of learningModule.lessons) {
        if (!lesson.slug || seen.has(lesson.slug)) continue;
        seen.add(lesson.slug);
        slugs.push({ slug: lesson.slug });
      }
    }
  }
  return slugs;
}
