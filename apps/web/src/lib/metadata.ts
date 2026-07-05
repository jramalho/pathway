import "server-only";
import type { Metadata } from "next";
import { getSiteUrl } from "./env";

/**
 * Server-side metadata helpers for public content routes.
 *
 * All helpers derive metadata from real Strapi content passed in as
 * typed view models — no hardcoded titles, descriptions, or images.
 * Canonical URLs and Open Graph URLs are built from the configured
 * SITE_URL so they resolve to absolute, shareable URLs.
 */

/** Maximum length for an OG/meta description before truncation. */
const META_DESCRIPTION_MAX = 160;

/**
 * Truncate a description for meta tags without cutting mid-word.
 * Returns the original string when it already fits.
 */
export function truncateForMeta(text: string, max = META_DESCRIPTION_MAX): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  // ponytail: simple word-boundary truncation. Ceiling: a description with
  // no spaces in the first 160 chars cuts at max anyway. Upgrade path: none
  // needed — meta descriptions are plain prose.
  const cut = lastSpace > 0 ? lastSpace : max;
  return `${slice.slice(0, cut).trimEnd()}…`;
}

/** Build an absolute canonical URL for a path-relative route. */
export function buildCanonicalUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Build an absolute image URL from a resolved cover image URL, or null. */
export function buildAbsoluteImageUrl(
  coverImageUrl: string | null,
): string | null {
  if (!coverImageUrl) return null;
  // Already absolute (e.g. https://...) — return as-is.
  if (/^https?:\/\//i.test(coverImageUrl)) return coverImageUrl;
  // Relative Strapi media URL — resolve against the Strapi base, but for
  // OG we need a publicly reachable absolute URL. The coverImageUrl passed
  // in is already resolved against the Strapi base by the data layer, so
  // it is absolute already. This guard exists for safety only.
  return coverImageUrl;
}

export interface PathMetadataInput {
  title: string;
  description: string;
  slug: string;
  coverImageUrl: string | null;
}

/**
 * Build route-level Metadata for a published learning path.
 *
 * Title uses the root template (`%s | Pathway`). Description is
 * truncated for meta tags. Canonical and Open Graph URLs are absolute.
 * OG image is included only when a valid cover image URL exists.
 */
export function buildPathMetadata(input: PathMetadataInput): Metadata {
  const canonical = buildCanonicalUrl(`/paths/${input.slug}`);
  const description = truncateForMeta(input.description);
  const ogImage = buildAbsoluteImageUrl(input.coverImageUrl);

  return {
    title: input.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: input.title,
      description,
      url: canonical,
      type: "website",
      siteName: "Pathway",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: input.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export interface LessonMetadataInput {
  title: string;
  summary: string;
  slug: string;
  /** Resolved absolute cover/thumbnail image URL, or null. */
  coverImageUrl: string | null;
  /** ISO published/updated date, or null. */
  publishedAt: string | null;
}

/**
 * Build route-level Metadata for a published lesson.
 *
 * Title uses the root template (`%s | Pathway`). Description is derived
 * from the lesson summary and truncated for meta tags. Canonical and
 * Open Graph URLs are absolute. OG image is included only when a valid
 * cover/thumbnail image URL exists. `og:type` is `article` for lessons.
 * The published date is surfaced via `article:published_time` when
 * available so social platforms can attribute the original publication.
 */
export function buildLessonMetadata(input: LessonMetadataInput): Metadata {
  const canonical = buildCanonicalUrl(`/lessons/${input.slug}`);
  const description = truncateForMeta(input.summary);
  const ogImage = buildAbsoluteImageUrl(input.coverImageUrl);

  return {
    title: input.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: input.title,
      description,
      url: canonical,
      type: "article",
      siteName: "Pathway",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      ...(input.publishedAt
        ? { publishedTime: input.publishedAt }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: input.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}