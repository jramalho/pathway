# ADR-006 — Public Route and Metadata Convention

## Status
Accepted

## Context

The public Next.js website needs stable, shareable, SEO-friendly URLs for
all published content, and consistent metadata (title, description,
canonical, Open Graph) derived from real Strapi content — not hardcoded.
Without a convention, each route would invent its own URL structure,
metadata format, and canonical URL strategy, leading to inconsistency,
duplicate metadata, and poor SEO.

The question is what the public route structure is, how slugs are
generated, and how metadata is built for every public content route.

## Decision

### Route structure

All public content routes live under a `(public)` route group with a
shared layout (`PublicShell`: skip link, header, main, footer):

| Route | Type | Purpose |
| ----- | ---- | ------- |
| `/` | Dynamic, ISR 300s | Homepage with featured content |
| `/explore` | Dynamic, ISR 300s | Discovery with search and filters |
| `/paths/[slug]` | SSG + ISR 300s | Learning path detail |
| `/lessons/[slug]` | SSG + ISR 300s | Lesson detail (editorial reading) |
| `/paths` | Static, noindex | Placeholder (full listing deferred) |
| `/topics` | Static, noindex | Placeholder (topic pages deferred) |
| `/signin` | Static, noindex | Placeholder (auth out of scope) |
| `/sitemap.xml` | Static, ISR 300s | Dynamic sitemap from published content |
| `/robots.txt` | Static | Crawl hints |
| `/api/revalidate` | Dynamic, POST-only | On-demand revalidation webhook |

### Slug generation

- Slugs come from Strapi (the CMS owns slug values).
- `generateStaticParams` derives known slugs from published content at
  build time: path slugs from `getPublishedLearningPaths`, lesson slugs
  from the published learning-path tree (each module's lessons).
- Future content (published after a build) is generated on-demand at
  request time and cached for the revalidation window.
- A minimal slug sanity check rejects empty/whitespace-only slugs before
  hitting the CMS; Strapi is the final authority on slug validity.

### Metadata convention

- **Root layout:** `metadataBase` from `SITE_URL`, title template
  `%s | Pathway`, default title "Pathway", default description, OG
  site name "Pathway".
- **Content routes:** `generateMetadata` fetches the content via the
  cached data helper and calls `buildPathMetadata` or `buildLessonMetadata`.
- **Title:** `{content title} | Pathway` (via root template).
- **Description:** from the content's `description` (path) or `summary`
  (lesson), truncated to 160 characters at a word boundary.
- **Canonical:** absolute URL built from `SITE_URL` + route path
  (`buildCanonicalUrl`).
- **Open Graph:** `og:title`, `og:description`, `og:url`, `og:site_name`,
  `og:type` (`website` for paths/home, `article` for lessons),
  `og:image` when a cover image or video thumbnail exists (resolved via
  `resolveStrapiMediaUrl`), `article:published_time` for lessons when
  available.
- **Twitter:** `summary_large_image` when an image exists, `summary`
  otherwise.
- **404 / not-found:** `robots: { index: false, follow: true }`, minimal
  title ("Learning path not found" / "Lesson not found").
- **Explore filtered variants:** `noindex, follow` with canonical to
  `/explore` (filtered URLs are an unbounded set).

### Request deduplication

- `getPathDetailView` and `getLessonDetailView` are wrapped in React
  `cache()` so the same slug fetch is deduplicated across
  `generateMetadata` and the page render within a single request — no
  duplicate Strapi round-trips.

## Consequences

- All public content routes have stable, shareable URLs that work on
  refresh and direct access.
- Metadata is always derived from real Strapi content — no hardcoded
  titles, descriptions, or images.
- Canonical URLs are absolute and consistent, preventing duplicate-
  content indexing issues.
- 404 and filtered variants are excluded from the index.
- Adding a new public content route requires: a data helper with
  `status` discriminator, a `generateMetadata` using the metadata
  helpers, `generateStaticParams` for known slugs, and `revalidate = 300`.
- The `(public)` route group ensures every public page gets the shell
  (header, footer, skip link) without per-page duplication.

## Related milestone
M3 — Next.js Public Web Experience
