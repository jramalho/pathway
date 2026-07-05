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

- [x] Audit Next.js foundation and API integration
- [x] Homepage with real content
- [x] Public Learning Path route (M3.4.1: route, metadata, safe navigation)
- [ ] Public Lesson route
- [x] Metadata, canonical URL, and Open Graph (path route)
- [x] Explore with search and filters (if in scope)
- [x] Responsiveness and states (path route: sticky sidebar, mobile stacking, empty curriculum)
- [x] URL validation and handoff (path route: stable URLs, valid/invalid/missing slugs, card navigation)

## Evidence

### M3.4.1 — Public dynamic Learning Path routes

- `/paths/[slug]` route created at `apps/web/src/app/(public)/paths/[slug]/page.tsx`
  - Server Component, loads published path via `@pathway/api` `getLearningPathBySlug`
  - `notFound()` for missing/unpublished/invalid slugs; public 404 with `noindex` renders
  - `generateMetadata` derives title, description, canonical URL, Open Graph from real Strapi content
  - `generateStaticParams` prerenders known published paths; `revalidate = 300` (ISR)
  - Minimal shell: breadcrumb (Home → Learning paths → path title), h1, description, real metadata (difficulty, duration, lesson count, topic), transition area, structural module preview
- Shared API package extended:
  - `LearningPath` domain model now includes `category: LearningPathCategory | null`
  - Zod schema, mapper, populate tree updated to include the `category` manyToOne relation
  - 42 API tests pass (including new category assertions)
- Web metadata helpers: `apps/web/src/lib/metadata.ts` (`buildPathMetadata`, `buildCanonicalUrl`, `truncateForMeta`)
- Web path data layer: `apps/web/src/lib/path-data.ts` (`getPathDetailView`, `getPublishedPathSlugs`)
- Site URL config: `SITE_URL` env var + `getSiteUrl()` in `apps/web/src/lib/env.ts`; `metadataBase` set in root layout
- Breadcrumb component: `apps/web/src/components/public/breadcrumbs.tsx` (semantic nav, `aria-current="page"`)
- Safe card navigation enabled:
  - `ExplorePathCard` renders as Next.js Link when `href` is provided
  - Explore workbench passes `/paths/[slug]` hrefs for paths with valid slugs
  - Homepage hero route steps link to real `/paths/[slug]` URLs with accessible labels
  - `ExploreLessonCard` remains non-linked (lesson routes deferred)
- Verification: API tests (42 pass), API typecheck, web typecheck, web lint, web build all pass
- Manual: valid slug renders with correct title/canonical/OG; nonexistent slug renders 404 with noindex; homepage and Explore cards link to valid path URLs

### M3.4.2 — Complete public Learning Path detail experience

- Full path hero (`path-hero.tsx`): forest-green field, breadcrumb, cover media (real image or Pathway-built geometric fallback), h1 title, full description, real metadata (difficulty, duration, lessons, topic), primary CTA "View curriculum" (in-page anchor to #curriculum), secondary CTA "Explore all paths" (links to /paths)
- Cover media component (`cover-media.tsx`): renders real Strapi cover image when available; decorative geometric fallback (aria-hidden) with path title when no image
- Path summary component (`path-summary.tsx`): reusable semantic description list with difficulty, duration, lesson count, module count (derived from actual modules), topic/category; "Explore all paths" action; used as sticky desktop sidebar
- Path curriculum (`path-curriculum.tsx`): section with `id="curriculum"`, "Path curriculum" h2, real module/lesson totals, modules in content order; graceful empty state when no modules
- Module row (`module-row.tsx`): always-visible (no accordion — portfolio content set is small), order number from Strapi `order` field, title, optional description, lesson count, lessons in content order; "Lessons will appear here" message when module has no lessons
- Lesson row (`lesson-row.tsx`): semantic information row — not a link; title, summary (when available), duration, difficulty; no fabricated completion/video/locked states; no disabled links
- Responsive two-column layout: main curriculum column + sticky summary sidebar on desktop (≥1024px); natural stacking on mobile/tablet; CSS sticky (no JS scroll tracking); `scroll-margin-top` on curriculum anchor so it doesn't hide behind the sticky header
- Edge cases handled: path with no modules (graceful empty state), module with no lessons (inline message), missing cover image (geometric fallback), missing category (omitted from metadata), short/long description (max-width constraint)
- Heading hierarchy: h1 (path title) → h2 ("Path curriculum") → h3 (module titles) → h4 (lesson titles)
- Accessibility: semantic breadcrumb nav with aria-current, one h1, logical heading hierarchy, in-page anchor with scroll-margin-top, decorative fallback aria-hidden, no color-only metadata, keyboard-accessible CTAs with visible focus states
- Verification: API tests (42 pass), API typecheck, web typecheck, web lint, web build all pass; valid path renders full hero + curriculum + sticky sidebar; nonexistent slug renders 404 with noindex; no lesson links to missing routes

### M3.4.3 — Related learning paths and final quality pass

- Related learning paths section (`related-paths.tsx`): renders after curriculum; uses existing `ExplorePathCard` for visual consistency; cards link to real `/paths/[slug]` URLs; renders nothing when no other published path exists (no forced empty block); labelled "Related learning paths" (not "Recommended")
- Related-path selection logic (`getRelatedPaths` in `path-data.ts`): deterministic server-side data boundary; selection rules in order: (1) paths sharing a real category, (2) paths with matching difficulty, (3) deterministic published-path fallback; never includes the current path; limited to 3; stable sort by slug
- Category populate fix: Strapi 5 qs parser conflicts when mixing indexed array syntax (`populate[0]`) with nested object syntax (`populate[modules]`); fixed to use object-key syntax for all populate entries (`populate[coverImage]=true`, `populate[category]=true`, `populate[modules][populate][0]=lessons`); categories now correctly populated in API responses
- Metadata deduplication: `getPathDetailView` wrapped in React `cache()` so the same slug fetch is deduplicated across `generateMetadata` and page render within a single request
- Targeted test (`related-paths.test.ts`): 7 tests covering exclusion of current path, category prioritization, difficulty fallback, deterministic fallback, empty result, limit enforcement, deterministic sort stability
- Verification: API tests (42 pass), API typecheck, web typecheck, web lint, web build, related-paths test (7 pass), explore-filters test (25 pass) all pass
- Manual: valid path renders with category in metadata + summary; related path card navigates to valid path URL; nonexistent slug renders 404 with noindex; no lesson links

## Handoff to M4

_To be filled when M3 is closed. Expected: stable public web with homepage, path, and lesson routes; direct URLs with metadata; responsive reading layout; ready for visual polish, accessibility audit, and CI._
