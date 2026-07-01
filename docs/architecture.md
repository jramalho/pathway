# Pathway — Architecture

> **Status:** Milestone 0 note
> **Scope:** Why the project has three apps and where each one's responsibility begins and ends.

## The three surfaces

```text
                         ┌─────────────────────────┐
                         │         Strapi          │
                         │ CMS Admin + REST API    │
                         │                         │
                         │ content, media, paths,  │
                         │ lessons, authors, tags, │
                         │ draft/published state   │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
         ┌───────────────────────┐          ┌───────────────────────┐
         │      Expo Mobile      │          │      Next.js Web      │
         │ iOS + Android product │          │ public discovery + SEO│
         │                       │          │                       │
         │ browse, learn, save,  │          │ landing pages, paths, │
         │ track progress        │          │ lessons, sharing      │
         └───────────────────────┘          └───────────────────────┘
```

## Strapi owns CMS administration, media, and publishing

Strapi is the single source of truth for content. It owns:

- **Content administration** — creating and editing learning paths, modules, lessons, categories, and authors.
- **Media management** — uploading and organizing cover images, author avatars, and lesson media.
- **Publishing state** — draft/review/published status and the `publishedAt` timestamp. Public clients only ever see published content.
- **REST API** — the only channel through which the mobile and web clients read content.

Strapi already ships a full admin UI. The project does not rebuild that admin UI anywhere else.

## Expo owns the native learning product

The Expo app is the end-user product for iOS and Android. It is responsible for:

- Browsing and discovering learning paths and lessons.
- Reading and progressing through lessons.
- Saving content locally.
- Tracking progress.

Expo consumes published content from Strapi through the shared `@pathway/api` package. It does not own content, media, or publishing — those stay in Strapi.

## Next.js owns public discovery, SEO, and shareable lesson URLs

The Next.js website is the public web surface. It is responsible for:

- The public homepage and marketing/exploration pages.
- Stable, shareable URLs for learning paths and lessons.
- SEO metadata, Open Graph tags, and canonical URLs.
- Editorial reading layouts for long-form lesson content.

Next.js also consumes published content from Strapi through the shared `@pathway/api` package. It is a read-only public client of the CMS, not a content management surface.

## There is intentionally no custom CMS dashboard in Next.js

Strapi already provides a complete admin UI for content CRUD, media upload, and publishing. Rebuilding any of that in Next.js would duplicate the CMS and weaken the architecture story.

A separate web operations dashboard would only make sense later if it served a genuinely different need — analytics, support operations, client reporting, or external data aggregation. That is out of scope for version 1.

## Shared packages

- **`@pathway/api`** — the future shared API boundary: fetch client, Zod schemas, response mappers, and typed models. Both Expo and Next.js will validate external CMS data here, at the application boundary, instead of scattering `any` across UI components.
- **`@pathway/ui-tokens`** — shared visual tokens (color, spacing, typography, radius, border, shadow). Shared tokens are enough for the first version; a universal cross-platform UI component package is not forced unless it actually speeds up delivery.

## What this split demonstrates

- Clear ownership: each surface has one job, and no surface duplicates another.
- A single content source of truth consumed by two different client surfaces.
- Deliberate restraint: no custom CMS dashboard, no premature shared UI library, no backend accounts for saved items in version 1.