# M3 — Next.js Public Web Experience

## Status
Ready

## User-visible outcome

A visitor can open the public Pathway website, browse published learning paths, open a learning path page with a stable URL, read the lesson content in a clean editorial layout, and share a direct link to a lesson that loads with correct title, description, and Open Graph metadata — all consuming the same Strapi content as the mobile app through the shared `@pathway/api` package.

## Goal

Turn the same Strapi content into a discoverable, shareable, SEO-friendly public website. Deliver the smallest complete public web reading experience: homepage → path → lesson, with stable URLs, page-level metadata, and responsive layouts — without duplicating content or rebuilding CMS admin.

## In scope

- Public homepage with real published content from `@pathway/api`.
- Simple explore/discovery page with search and filters (only if the current data model supports it without increasing scope).
- Public learning path route `/paths/[slug]` with modules and lessons.
- Public lesson route `/lessons/[slug]` with readable editorial layout.
- Page-level metadata (title, description) derived from Strapi content.
- Canonical URLs and basic Open Graph tags.
- Responsive behavior: readable on desktop and mobile web.
- Loading, error, and empty/unavailable states for each public route.
- Direct, stable URLs that work on refresh and share.

## Explicitly out of scope

- Custom CMS dashboard (Strapi already ships its admin).
- Authentication, login, user accounts.
- Sync of mobile saved items or progress with web.
- Signed-in web area (continue learning, saved lessons on web).
- Full-text search infrastructure (server-side search).
- Analytics.
- Payments or subscriptions.
- Video player.
- Offline downloads.
- Content duplicated manually in Next.js.
- M4+ functionality (visual polish, CI, deployment).

## Existing dependencies from M1 and M2

- `createPathwayApiClient({ baseUrl })` — shared client factory.
- `api.getPublishedLearningPaths({ signal })` — all published Learning Paths.
- `api.getFeaturedLearningPaths({ signal, limit })` — featured Learning Paths.
- `api.getLearningPathBySlug(slug, { signal })` — single Learning Path by slug.
- `api.getLessonBySlug(slug, { signal })` — single published LessonDetail by slug.
- `resolveStrapiMediaUrl(mediaUrl, baseUrl)` — media URL resolver.
- Domain models: `LearningPath`, `LearningPathModule`, `LessonPreview`, `LessonDetail`, `Author`, `Category`, `ContentImage`, `Difficulty`, `LessonBodyBlock`.
- `apps/web/src/lib/pathway-api.ts` — server-only singleton client.
- `apps/web/src/lib/env.ts` — `STRAPI_URL` reader (server-only).
- `apps/web/src/app/(home)/page.tsx` — M1 homepage (featured paths, error, empty).
- `apps/web/src/app/paths/[slug]/page.tsx` — M1 path route (hero, modules, lessons, generateMetadata).
- `apps/web/src/app/layout.tsx` — root layout with Inter + Epilogue fonts.
- `apps/web/src/app/error.tsx` — root error boundary.
- `apps/web/src/app/(home)/loading.tsx` — home loading skeleton.
- `@pathway/ui-tokens` — shared visual tokens (colors, spacing, typography, borders, shadows).
- `next.config.ts` — transpiles `@pathway/api` and `@pathway/ui-tokens`, configures `next/image` remote patterns.

## Relevant invariants

- `architecture.content-source` — Strapi is the source of truth; web does not hardcode content.
- `architecture.surface-ownership` — Next.js owns public web discovery, SEO, and shareable reading pages.
- `architecture.no-custom-cms` — Next.js must not recreate Strapi admin or content CRUD.
- `quality.external-data` — All CMS data is runtime-validated at the `@pathway/api` boundary.
- `scope.v1` — No V2 features beyond this milestone's scope.

## Public user journeys

1. **Discovery:** Visitor lands on homepage → sees featured learning paths → clicks a path.
2. **Path reading:** Visitor opens `/paths/[slug]` → sees hero, modules, lessons → clicks a lesson.
3. **Lesson reading:** Visitor opens `/lessons/[slug]` → reads the lesson body in a clean layout → sees author, category, key takeaway → navigates to next/previous lesson or back to path.
4. **Sharing:** Visitor copies a lesson URL → shares it → recipient opens it → sees the same content with correct title and OG preview.
5. **Search (if implemented):** Visitor opens explore → searches → finds a path or lesson → opens it.

## Incremental delivery slices

1. **Audit Next.js foundation and integrate API** — Verify existing M1 web app, confirm `@pathway/api` integration, audit `next.config.ts`, `layout.tsx`, `globals.css`, env setup. Identify what exists vs what needs to be built.

2. **Homepage with real content** — Refine the M1 homepage with proper layout, featured paths, and empty/error states. Ensure it consumes `@pathway/api` correctly and renders domain models.

3. **Public Learning Path route** — Refine `/paths/[slug]` with hero, modules, lessons, breadcrumb, and proper metadata. Ensure `notFound()` for missing slugs, stable URLs, and responsive layout.

4. **Public Lesson route** — Create `/lessons/[slug]` with editorial reading layout, author, category, body renderer (HTML/React equivalent of the mobile `LessonBodyRenderer`), key takeaway, and navigation back to path. Ensure `notFound()` for missing slugs.

5. **Metadata, canonical URL, and Open Graph** — Add `generateMetadata` for each route with title, description, canonical URL, and basic OG tags (og:title, og:description, og:image from coverImage/videoThumbnail). Ensure noindex on error/404 pages.

6. **Explore with search and filters** — Create a simple explore page with client-side search and topic filters, reusing the same keyword-based approach from mobile. Only if the data model supports it without increasing scope.

7. **Responsiveness and states** — Ensure all pages are readable on desktop and mobile web. Add loading, error, and empty/unavailable states for each route. Verify focus states and keyboard navigation.

8. **URL validation and handoff** — Verify direct URLs work on refresh, share, and navigation. Validate metadata with browser dev tools. Hand off to M4 for visual polish.

## Acceptance criteria

- [ ] Homepage shows published learning paths from Strapi via `@pathway/api`.
- [ ] `/paths/[slug]` shows a learning path with modules and lessons.
- [ ] `/lessons/[slug]` shows a lesson with readable body content.
- [ ] Lesson page is readable on desktop and mobile web.
- [ ] Page title and description come from Strapi content.
- [ ] Canonical URLs are present.
- [ ] Basic Open Graph tags are present (og:title, og:description, og:image).
- [ ] Direct URLs work on refresh and share.
- [ ] 404 / not-found works for invalid slugs.
- [ ] Loading, error, and empty states exist for each public route.
- [ ] No content is hardcoded — all from `@pathway/api`.
- [ ] No `any` types introduced.
- [ ] `pnpm --filter @pathway/web exec tsc --noEmit` passes.
- [ ] `pnpm --filter @pathway/web lint` passes.
- [ ] `pnpm --filter @pathway/web build` passes.

## SEO and metadata requirements

- Each route must have `generateMetadata` returning `{ title, description }`.
- Title format: `{content title} | Pathway`.
- Description: from the content's `description` (path) or `summary` (lesson).
- Canonical URL: the full public URL of the page.
- Open Graph: `og:title`, `og:description`, `og:image` (from `coverImage` or `videoThumbnail`, resolved via `resolveStrapiMediaUrl`), `og:type` (`article` for lessons, `website` for paths/home).
- 404 and error pages must have `noindex` meta.
- The homepage must have a site-level title and description.

## Validation checklist

- [ ] `pnpm --filter @pathway/api exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/api test` passes
- [ ] `pnpm --filter @pathway/web exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/web lint` passes
- [ ] `pnpm --filter @pathway/web build` passes
- [ ] Manual: open homepage → click path → click lesson → read content
- [ ] Manual: refresh a direct lesson URL → content loads
- [ ] Manual: check page title and meta description in browser dev tools
- [ ] Manual: check Open Graph tags (og:title, og:description, og:image)
- [ ] Manual: visit invalid slug → 404 page renders
- [ ] Manual: resize to mobile width → content is readable
- [ ] No `any` types introduced
- [ ] No hardcoded production content

## Expected areas of change

| Area | Path | Purpose |
| ---- | ---- | ------- |
| Web homepage | `apps/web/src/app/(home)/page.tsx` | Refine layout, states, content |
| Web path route | `apps/web/src/app/paths/[slug]/page.tsx` | Refine layout, metadata, states |
| Web lesson route | `apps/web/src/app/lessons/[slug]/page.tsx` | New route for lesson reading |
| Web explore | `apps/web/src/app/(explore)/page.tsx` or `apps/web/src/app/explore/page.tsx` | New explore page (if in scope) |
| Web layout | `apps/web/src/app/layout.tsx` | Site-level metadata, font setup |
| Web components | `apps/web/src/components/` | Shared web components (cards, body renderer, states) |
| Web lib | `apps/web/src/lib/` | Helpers (body renderer, metadata helpers) |
| Web config | `apps/web/next.config.ts` | Image domains, transpile packages (already configured) |

## Progress checklist

- [ ] Audit Next.js foundation and API integration
- [ ] Homepage with real content
- [ ] Public Learning Path route
- [ ] Public Lesson route
- [ ] Metadata, canonical URL, and Open Graph
- [ ] Explore with search and filters (if in scope)
- [ ] Responsiveness and states
- [ ] URL validation and handoff

## Evidence

_To be filled as slices are completed._

## Handoff to M4

_To be filled when M3 is closed. Expected: stable public web with homepage, path, and lesson routes; direct URLs with metadata; responsive reading layout; ready for visual polish, accessibility audit, and CI._
