import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { getPublishedPathSlugs } from "@/lib/path-data";
import { getPublishedLessonSlugs } from "@/lib/lesson-data";

/**
 * Dynamic sitemap route — `/sitemap.xml`.
 *
 * Server-side, typed, deterministic. Reuses the shared `@pathway/api`
 * boundary via the existing data-layer slug helpers (no duplicate Strapi
 * fetching, no full lesson bodies fetched solely for the sitemap).
 *
 * Included URLs:
 *   - `/` (homepage)
 *   - `/explore` (base discovery page — query variants are excluded)
 *   - `/paths/[slug]` for every published learning path with a valid slug
 *   - `/lessons/[slug]` for every published lesson with a valid slug
 *
 * Excluded:
 *   - drafts, review, unpublished content (the API only returns published)
 *   - placeholder routes (`/paths` listing, `/topics`, `/signin`)
 *   - API routes, internal routes
 *   - query-parameter variants of `/explore`
 *   - entries with missing or malformed slugs
 *
 * `lastModified` is omitted for every entry: the typed `LearningPath` and
 * `LessonPreview` domain models do not expose `publishedAt`/`updatedAt`,
 * and fetching full lesson bodies solely to recover a date is explicitly
 * avoided. Per the sitemap protocol, omitting `<lastmod>` is valid.
 *
 * Revalidation: matches the public-content convention (`revalidate = 300`,
 * 5 minutes). Published CMS content changes are infrequent; a 5-minute
 * window keeps the sitemap fresh without hammering Strapi per request.
 * On-demand revalidation is deferred to a later milestone.
 */
export const revalidate = 300;

/** Static public destinations always included in the sitemap. */
const STATIC_PUBLIC_PATHS = ["/", "/explore"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  // Static public destinations.
  const entries: MetadataRoute.Sitemap = STATIC_PUBLIC_PATHS.map((path) => ({
    url: `${base}${path}`,
  }));

  // Published learning paths — reuse the existing typed slug helper.
  // On CMS failure, no path URLs are added (on-demand generation handles
  // them when content returns); the sitemap still serves static entries.
  const pathSlugs = await getPublishedPathSlugs();
  for (const { slug } of pathSlugs) {
    if (!isValidSlug(slug)) continue;
    entries.push({ url: `${base}/paths/${slug}` });
  }

  // Published lessons — derived from the published learning-path tree
  // (no full lesson bodies fetched). Deduplicated by the slug helper.
  const lessonSlugs = await getPublishedLessonSlugs();
  for (const { slug } of lessonSlugs) {
    if (!isValidSlug(slug)) continue;
    entries.push({ url: `${base}/lessons/${slug}` });
  }

  return entries;
}

/**
 * Minimal slug sanity check for sitemap inclusion.
 *
 * Rejects empty/whitespace-only slugs and slugs containing characters
 * that would produce malformed URLs (spaces, control chars). Does not
 * reject valid slug punctuation (`-`, `_`) — Strapi is the final
 * authority on slug validity; this only guards against emitting
 * broken `<loc>` entries.
 */
function isValidSlug(slug: string): boolean {
  if (!slug || !slug.trim()) return false;
  // No spaces or control characters — a slug with these would URL-encode
  // oddly and is almost certainly not a real published slug.
  return !/[\s\x00-\x1f]/.test(slug);
}
