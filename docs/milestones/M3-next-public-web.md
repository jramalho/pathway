# M3 — Next.js Public Web Experience

## Status
Done

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

- [x] Homepage shows published learning paths from Strapi via `@pathway/api`.
- [x] `/paths/[slug]` shows a learning path with modules and lessons.
- [x] `/lessons/[slug]` shows a lesson with readable body content.
- [x] Lesson page is readable on desktop and mobile web.
- [x] Page title and description come from Strapi content.
- [x] Canonical URLs are present.
- [x] Basic Open Graph tags are present (og:title, og:description, og:image).
- [x] Direct URLs work on refresh and share.
- [x] 404 / not-found works for invalid slugs.
- [x] Loading, error, and empty states exist for each public route.
- [x] No content is hardcoded — all from `@pathway/api`.
- [x] No `any` types introduced.
- [x] `pnpm --filter @pathway/web exec tsc --noEmit` passes.
- [x] `pnpm --filter @pathway/web lint` passes.
- [x] `pnpm --filter @pathway/web build` passes.

## SEO and metadata requirements

- Each route must have `generateMetadata` returning `{ title, description }`.
- Title format: `{content title} | Pathway`.
- Description: from the content's `description` (path) or `summary` (lesson).
- Canonical URL: the full public URL of the page.
- Open Graph: `og:title`, `og:description`, `og:image` (from `coverImage` or `videoThumbnail`, resolved via `resolveStrapiMediaUrl`), `og:type` (`article` for lessons, `website` for paths/home).
- 404 and error pages must have `noindex` meta.
- The homepage must have a site-level title and description.

## Validation checklist

- [x] `pnpm --filter @pathway/api exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/api test` passes (47 tests, 0 fail)
- [x] `pnpm --filter @pathway/web exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/web lint` passes
- [x] `pnpm --filter @pathway/web build` passes
- [x] Manual: open homepage → click path → click lesson → read content
- [x] Manual: refresh a direct lesson URL → content loads
- [x] Manual: check page title and meta description in browser dev tools
- [x] Manual: check Open Graph tags (og:title, og:description, og:image)
- [x] Manual: visit invalid slug → 404 page renders
- [x] Manual: resize to mobile width → content is readable
- [x] No `any` types introduced
- [x] No hardcoded production content

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
- [x] Public Lesson route (M3.5.1: shell, metadata, safe navigation)
- [x] Metadata, canonical URL, and Open Graph (path route + lesson route)
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

### M3.5.1 — Public dynamic Lesson routes, typed lesson loading, metadata, safe navigation

- `/lessons/[slug]` route created at `apps/web/src/app/(public)/lessons/[slug]/page.tsx`
  - Server Component, loads published lesson via `@pathway/api` `getLessonBySlug`
  - `notFound()` for missing/unpublished/invalid slugs; public 404 with `noindex` renders
  - `generateMetadata` derives title, description, canonical URL, Open Graph (article type), published time from real Strapi content
  - `generateStaticParams` prerenders known published lessons (slugs derived from published learning-path tree); `revalidate = 300` (ISR)
  - Minimal shell: breadcrumb (Home → Learning paths → parent path → current lesson), h1, summary, real metadata (duration, difficulty, author, published date), link back to parent learning path, transition area
- Shared API package corrected to match real Strapi response:
  - **Body format discovery:** Strapi `body` is a richtext field configured with the default Markdown editor — Strapi returns it as a plain Markdown string (not a JSON array of blocks). The previous schema assumed Strapi Blocks format (`z.array(bodyBlockSchema)`) which would fail validation against real data.
  - `LessonDetail.body` is now `string` (Markdown); `LessonBodyBlock` type removed; `LessonBody` type added
  - `learningPath` and `module` manyToOne relations added to schema, mapper, domain model, and populate tree
  - `LessonLearningPathRef` and `LessonModuleRef` domain types added (title, slug, description / title, description, order)
  - Mobile `LessonBodyRenderer` updated to accept Markdown string (structured Markdown renderer deferred to a separate mobile task)
  - 47 API tests pass (42 existing + 5 new lesson schema/mapper tests)
- Web lesson data layer: `apps/web/src/lib/lesson-data.ts` (`getLessonDetailView`, `getPublishedLessonSlugs`)
  - Wrapped in React `cache()` for request deduplication across `generateMetadata` and page render
  - Returns `status` discriminator: "ok" / "missing" / "error"
  - Maps typed `LessonDetail` into route-specific `LessonDetailView` (resolves media URLs against Strapi base)
- Web metadata helpers: `buildLessonMetadata` added to `apps/web/src/lib/metadata.ts` (article OG type, publishedTime, canonical, safe image fallback)
- Lesson hero component (`lesson-hero.tsx`): forest-green field, breadcrumb with parent path link, h1, summary, real metadata (duration, difficulty, author, published date), link back to parent learning path
- Lesson transition component (`lesson-transition.tsx`): polished placeholder making clear the complete editorial reading experience is being built below
- Safe lesson navigation enabled:
  - `ExploreLessonCard` renders as Next.js Link when `href` is provided; Explore workbench passes `/lessons/[slug]` hrefs for lessons with valid slugs
  - Curriculum `LessonRow` renders as Next.js Link to `/lessons/[slug]` when lesson has a valid slug; preserves non-interactive fallback when slug is absent
  - Homepage has no lesson cards (only featured path route steps and a "Browse lessons" CTA) — no homepage lesson navigation to update
- Accessibility: semantic breadcrumb nav with aria-current, one h1, keyboard-accessible lesson links with visible focus states, decorative elements aria-hidden, metadata readable at narrow widths
- Verification: API tests (47 pass), API typecheck, web typecheck, web lint, web build, mobile typecheck, mobile lint all pass
- Manual: valid slug renders with correct title/canonical/OG/article:published_time; nonexistent slug renders 404 with noindex; Explore and curriculum lesson links resolve to real lesson URLs

### M3.5.2 — Complete editorial reading experience for lesson routes

- Full lesson article hero (`lesson-hero.tsx` updated): forest-green field, breadcrumb (Home → Learning paths → parent path → current lesson), h1, summary, real metadata (duration, difficulty, topic/category, published date), author section (name, avatar when valid image exists, short bio when available), link back to parent learning path
- Lesson media area (`lesson-media.tsx`): honest media rendering — native HTML5 `<video>` with controls for direct video URLs (mp4/webm/ogg), real Strapi video thumbnail as `<img>` when no direct video, decorative geometric fallback (aria-hidden) when neither exists; no fake playback controls, no autoplay, no third-party embedded player; stable 16:9 aspect ratio prevents layout shift
- Safe structured body renderer (`lesson-body-renderer.tsx`): typed Markdown → semantic HTML via `parseLessonBody` — renders `<article>`, headings (`h2`–`h4` with anchor IDs and permalink `#`), `<p>`, `<ul>`/`<ol>`, `<blockquote>`, `<pre><code>` (horizontal scroll inside bounded region), inline `<strong>`, `<em>`, `<code>`, `<a>` (external links get `target="_blank"`, `rel="noopener noreferrer"`, and ↗ indicator); no `dangerouslySetInnerHTML`, no raw HTML injection; raw HTML in Markdown is treated as plain text
- Typed Markdown parser (`lesson-body-parser.ts`): focused parser for the actual content subset — ATX headings (level 1–4), paragraphs, ordered/unordered lists, block quotes, fenced code blocks (with optional language), inline emphasis (**bold**, *italic*, `code`, [link](url)); deterministic anchor ID generation with deduplication; `extractTocEntries` for TOC; 14 parser tests pass
- Table of contents (`lesson-toc.tsx`): desktop sticky aside (≥1024px) with real headings and deterministic anchor IDs; mobile/tablet in-flow "On this page" section (compact, non-dominant); omitted when fewer than 2 headings; `scroll-margin-top: 5rem` on heading anchors accounts for the sticky site header; no scroll-spy or JS active-state tracking
- Parent-path CTA (`lesson-path-cta.tsx`): forest-green panel after article body with "Continue the learning path" eyebrow, real parent path title, real path description, honest context ("This lesson is part of a structured curriculum. Open the learning path to see the surrounding modules and lessons."), "View full curriculum" CTA linking to `/paths/[slug]`; omitted entirely when no valid learning-path relationship; no implication of saved progress, resume, enrollment, or account state
- Responsive two-column layout: article body (max 48rem reading measure) + sticky TOC (16rem) on desktop (≥1024px); natural stacking on mobile/tablet; media fits naturally above the article; code blocks scroll horizontally inside their own bounded region — no page-level overflow
- Key takeaway callout: intentionally omitted — the Strapi lesson schema has no `keyTakeaway` or equivalent field. The component is not created rather than fabricating takeaway content from the summary or body
- Missing-content handling: no cover image → decorative fallback; no video URL/thumbnail → decorative fallback; no author → author section omitted; no category → topic omitted from metadata; no headings → TOC omitted; short body → renders as-is; long body → readable with editorial spacing; code blocks → horizontal scroll within bounded region
- Accessibility: one clear h1, logical heading hierarchy (h1 → h2 → h3 → h4), semantic `<article>` structure, visible focus states on all links, `<time dateTime>` for published date, decorative fallback aria-hidden, TOC nav with aria-label, code blocks keyboard-scrollable, external links marked with ↗ and safe rel attributes, no color-only meaning
- Verification: parser tests (14 pass), web lib tests (32 pass), API tests (47 pass), web typecheck, web lint, web build all pass
- Manual: valid lesson renders full article with hero + media + TOC + body + CTA; headings have correct anchor IDs; TOC links resolve to correct sections; parent-path CTA links to valid `/paths/[slug]`; nonexistent slug renders 404 with noindex; metadata (title, description, canonical, OG article, published_time) correct

### M3.5.3 — Sharing controls, related lessons, previous/next navigation, final quality pass

- Related lessons section (`lesson-related.tsx`): renders after parent-path CTA; section title "Related lessons" with "Keep learning" h2; uses real published Strapi content only; cards link to valid `/lessons/[slug]` routes; renders nothing when no alternatives exist (no forced empty section); responsive grid (1 column mobile, 2 column tablet, 3 column desktop)
- Related-lesson selection logic (`getRelatedLessons` in `lesson-navigation.ts`): deterministic server-side data boundary; selection rules in order: (1) lessons sharing a real category with the current lesson, (2) lessons from the same real learning path excluding self, (3) lessons matching real difficulty, (4) deterministic published-lesson fallback; never includes the current lesson; limited to 3; stable sort by slug; does not fetch lesson bodies to choose related items
- Previous/next lesson navigation (`lesson-nav.tsx`): server-rendered; derives ordering from real Strapi module `order` field and lesson position within each module — not alphabetical or date-based; shows parent learning-path context as a real link; concise truthful labels ("Previous lesson", "Next lesson") with actual lesson title as supporting context; no fake locked/current/completed states; gracefully omits missing previous or next; renders nothing when reliable path ordering is unavailable
- Previous/next selection logic (`getLessonNav` in `lesson-navigation.ts`): fetches the parent learning path, sorts modules by `order`, flattens lessons in content order, finds the current lesson's index, returns previous/next targets; returns null when the lesson is not in the path or the path is unavailable
- Sharing controls (`lesson-share.tsx`): the only Client Component on the lesson page; receives minimal typed values (URL, title, summary) from the Server Component — never fetches lesson content; "Share lesson" uses Web Share API when available with real URL/title/summary; "Copy link" uses Clipboard API with `aria-live` success confirmation and `execCommand` fallback for environments without Clipboard API; LinkedIn and WhatsApp direct external share URLs using real canonical lesson URL with safe `rel="noopener noreferrer"` and visible text labels; no tracking parameters; no social analytics
- LessonTransition component removed — the full editorial reading experience is now built; the placeholder is no longer needed
- Final quality pass: metadata reviewed (title, description, canonical, OG article, published_time all correct and stable); no duplicate metadata between page and helper functions; route revalidation/SG remains consistent with `/paths/[slug]` (both `●` SSG with `revalidate = 300`); no `any` types; no unsafe type assertions; no dead code; no broken links across homepage, Explore, Learning Path, related content, and lesson navigation
- Accessibility: breadcrumb semantics with aria-current; one clear h1; logical heading hierarchy; semantic article landmark; TOC nav with aria-label; visible focus states on all links; previous/next link labels with aria-label; related-card link semantics with aria-label; sharing control accessible names and `aria-live` status feedback for copied-link confirmation; decorative elements aria-hidden; reduced-motion preferences respected via globals.css; touch-target sizes meet 44px minimum
- Targeted test (`lesson-navigation.test.ts`): 12 tests covering related-lesson selection (excludes current, prioritizes category, falls back to path/difficulty/deterministic, respects limit, returns empty) and previous/next navigation (middle lesson, first lesson, last lesson, not-in-list, single-lesson path)
- Verification: navigation tests (12 pass), parser tests (14 pass), web lib tests (32 pass), API tests (47 pass), web typecheck, web lint, web build all pass
- Manual: valid lesson renders full article with hero + media + TOC + body + share + nav + CTA + related; previous/next links resolve to valid `/lessons/[slug]` routes; related cards link to valid lesson routes; parent-path CTA links to valid `/paths/[slug]`; sharing controls render with accessible labels; nonexistent slug renders 404 with noindex; metadata correct

## Milestone 3.5 acceptance checklist

- [x] Public lesson has a stable URL (`/lessons/[slug]`)
- [x] Real CMS-driven article content (Markdown body → typed parser → semantic HTML)
- [x] Readable media and layout (honest video/image/fallback, responsive two-column with sticky TOC)
- [x] Correct metadata (title, description, canonical, OG article, published_time)
- [x] Valid internal navigation (previous/next within parent path, related lessons, parent-path CTA, breadcrumb)
- [x] Useful sharing (Web Share API, Clipboard API with confirmation, LinkedIn, WhatsApp)
- [x] Related lessons based on real content relationships (category → path → difficulty → fallback)
- [x] Polished responsive experience (320px, 390px, 768px, 1024px, wide desktop)
- [x] No fake user state (no progress, enrollment, completion, saved items, or account behavior)
- [x] No scope creep (no authentication, payments, analytics, video pipeline, or CMS redesign)

## Handoff to M4

### Final validation (2026-07-06)

- `pnpm --filter @pathway/api exec tsc --noEmit` — pass
- `pnpm --filter @pathway/api test` — 47 tests pass, 0 fail
- `pnpm --filter @pathway/web exec tsc --noEmit` — pass
- `pnpm --filter @pathway/web lint` — pass
- `pnpm --filter @pathway/web build` — pass (`/paths/[slug]` and `/lessons/[slug]` are SSG `●`, `/` and `/explore` are dynamic `ƒ`, sitemap revalidate 5m)
- `pnpm --filter @pathway/mobile exec tsc --noEmit` — pass (M3 did not break mobile)
- Web lib tests: 70 tests pass (explore-filters 25, lesson-body-parser 14, lesson-navigation 12, related-paths 7, revalidation 12)
- No `any` types in `apps/web/src` (grep returns empty)

### Manual demonstration executed (2026-07-06)

1. Strapi CMS started on `localhost:1337` with published React Native Performance path (3 modules, 9 published lessons).
2. Next.js dev server started on `localhost:3001` (port 3000 in use).
3. `GET /` → 200, `<title>Pathway</title>`, meta description, canonical, OG tags, h1.
4. `GET /paths/react-native-performance` → 200, `<title>React Native Performance | Pathway</title>`, meta description from Strapi, canonical, OG (type=website), h1 with real title.
5. Direct refresh of path URL → content loads (server-rendered).
6. `GET /lessons/optimizing-long-lists-with-flashlist` → 200, `<title>Optimizing Long Lists with FlashList | Pathway</title>`, meta description from Strapi summary, canonical, OG (type=article), article:published_time, h1, article body with 3 h2 headings, author Jonathan Ramalho with bio.
7. Direct refresh of lesson URL → content loads (server-rendered).
8. Page title and metadata verified in HTML source for all routes.
9. `GET /paths/slug-que-nao-existe` → not-found with `noindex`, `<title>Learning path not found | Pathway</title>`.
10. `GET /lessons/slug-que-nao-existe` → not-found with `noindex`, `<title>Lesson not found | Pathway</title>`.
11. Mobile User-Agent (iPhone) — all routes render with viewport meta and h1 content.
12. On-demand revalidation via Strapi webhook — **not executed manually**: could not obtain admin credentials or a valid API token to trigger a content change. ISR (`revalidate=300`) and the webhook endpoint (`POST /api/revalidate`) are implemented and unit-tested (12 revalidation tests pass); ADR-004 documents the strategy. End-to-end webhook trigger remains for manual validation when admin access is available.

### Public routes actually shipped

| Route | Type | Revalidate | Metadata |
| ----- | ---- | ---------- | -------- |
| `/` | Dynamic (ƒ) | 300s | Site-level title, description, canonical, OG (website) |
| `/explore` | Dynamic (ƒ) | 300s | Title, description, canonical; noindex on filtered variants |
| `/paths/[slug]` | SSG (●) | 300s | Title, description, canonical, OG (website), twitter card |
| `/lessons/[slug]` | SSG (●) | 300s | Title, description, canonical, OG (article), article:published_time, twitter card |
| `/paths` | Static (○) | — | noindex (placeholder) |
| `/topics` | Static (○) | — | noindex (placeholder) |
| `/signin` | Static (○) | — | noindex (placeholder) |
| `/sitemap.xml` | Static (○) | 300s | Dynamic, lists published paths + lessons |
| `/robots.txt` | Static (○) | — | Allows public routes, disallows /api/, /signin, /topics |
| `/api/revalidate` | Dynamic (ƒ) | — | POST-only, Bearer auth, not indexed |

### Metadata actually implemented

- Root layout: `metadataBase`, site-level title template (`%s | Pathway`), default description, OG site name.
- Homepage: canonical `/`, OG url, inherits root title/description.
- Explore: canonical `/explore`, noindex on filtered variants, title "Explore".
- Path route: `buildPathMetadata` — title from Strapi, description from Strapi (truncated 160 chars), canonical, OG (title, description, url, siteName, type=website, image when cover exists), twitter card.
- Lesson route: `buildLessonMetadata` — title from Strapi, description from Strapi summary (truncated), canonical, OG (title, description, url, siteName, type=article, image when thumbnail exists, publishedTime when available), twitter card.
- 404/not-found: `noindex` meta on both root and public-group not-found boundaries.
- Error boundary: Client Component, no metadata (error pages are not indexed).

### Known limitations of the web V1 surface

- `/paths`, `/topics`, and `/signin` are placeholder routes with `noindex` — the header links to them so no link leads to a 404, but they carry no real content.
- Explore topic filtering is keyword-based (no real category relation in the explore data layer — the shared API does not expose a category listing endpoint for the explore view model).
- On-demand revalidation webhook is implemented and unit-tested but not yet validated end-to-end with a real Strapi webhook configuration (admin access required).
- `og:image` is included only when a cover image or video thumbnail exists; the current published path has no cover image, so OG image is omitted for it.
- Sitemap omits `<lastmod>` (the domain models do not expose `publishedAt`/`updatedAt` for path/lesson listings).
- The lesson body parser handles a focused Markdown subset (ATX headings, paragraphs, lists, blockquotes, fenced code, inline emphasis/code/links); raw HTML in Markdown is treated as plain text.

### Deviations from plan

- The plan referenced `apps/web/src/app/(home)/page.tsx` and `apps/web/src/app/paths/[slug]/page.tsx` from M1; the actual M3 implementation moved routes into a `(public)` route group with a shared layout and shell. The M1 routes were refactored, not preserved in place.
- The plan listed `LessonBodyBlock` as a domain model; the actual Strapi richtext field returns Markdown (not Blocks), so `LessonDetail.body` is `string` and a typed Markdown parser was built instead.
- Explore was listed as conditional ("only if the current data model supports it"); it was implemented with client-side keyword search and topic/difficulty filters using the existing data model.

### Important decisions taken in this milestone

- **Route group `(public)`** with shared layout + `PublicShell` (skip link, header, main, footer) — keeps the shell consistent without per-page duplication.
- **ISR `revalidate = 300`** on all public content routes — modest, explainable default; on-demand revalidation via webhook is an optimization with ISR fallback (ADR-004).
- **React `cache()`** on `getPathDetailView` and `getLessonDetailView` — deduplicates the Strapi fetch across `generateMetadata` and page render within a single request.
- **Typed Markdown parser** (`lesson-body-parser.ts`) instead of `dangerouslySetInnerHTML` — safe structured rendering of Strapi Markdown content.
- **Status discriminator** (`ok` / `missing` / `error`) on all data layers — the caller decides `notFound()` vs error boundary, no silent failures.
- **`noindex` on all placeholder routes** (`/paths`, `/topics`, `/signin`) — defense-in-depth alongside robots.txt disallow.

### What exists for M4 to build on

**Visual components and patterns — mobile:**
- Neo-Academic Brutalist design system: Epilogue headings, Inter body, `#FAF9F5` background, `#000000` borders (3px strong, 2px thin), hard offset shadows, mint `#D4E7DD`, acid green `#79FF5B`, active green `#38FE13`, error `#BA1A1A`.
- Structural skeletons (HomeSkeleton, ExploreSkeleton, LearningPathDetailSkeleton, LessonDetailSkeleton, SavedContentSkeleton, ProfileSkeleton).
- EmptyState component with icon variants (bookmark, warning, grid).
- ErrorState component with retry and optional secondary action.
- PathCover with onError fallback to geometric CoverFallback.
- LessonMediaPreview with onError fallback to AbstractMediaFallback.
- Tab bar, module accordions, bookmark toggles, completion cards.

**Visual components and patterns — web:**
- StyleX design tokens (`apps/web/src/styles/tokens.stylex.ts`): forest-green header `#0F3D2E`, warm off-white page `#FAF9F5`, hard offset shadows, 3px/2px borders, acid-green accents.
- PublicShell: skip link, PublicHeader (sticky, responsive with mobile dropdown), PublicFooter.
- ContentState component (variants: not-found, error, empty) with StateAction and StateIcon.
- Skeleton components (skeleton-card, skeleton-media, skeleton-page, skeleton-text).
- HomeHero with CSS-only learning-route composition (no imagery).
- PathHero, PathSummary, PathCurriculum, ModuleRow, LessonRow, RelatedPaths.
- LessonHero, LessonMedia, LessonBodyRenderer, LessonToc (sticky + inline), LessonShare, LessonNav, LessonPathCta, LessonRelated.
- Breadcrumbs with aria-current.
- ExploreWorkbench (Client Component) with search and filters.

**Tokens that exist:**
- `packages/ui-tokens`: foundation.ts (raw values) + semantic.ts (purpose-named) + index.ts (flat backward-compatible export). Covers color, spacing, typography, border, radius, shadow, icon, touch, layout, zIndex.
- `apps/web/src/styles/tokens.stylex.ts`: web-only StyleX CSS custom properties mirroring the platform-agnostic values, extended with web-specific surfaces (surfaceHeader, surfaceAction, textOnHeader, transitions, contentMaxWidth 72rem).
- Mobile consumes `@pathway/ui-tokens` directly; web consumes its own StyleX tokens that mirror the same values. The two token sets are aligned in value but not structurally unified.

**Priority pages/screens for polish:**
- Mobile: Home, Explore, Learning Path Detail, Lesson Detail, Saved.
- Web: Homepage, Explore, Learning Path (`/paths/[slug]`), Lesson (`/lessons/[slug]`).

**Loading, error, and empty states — where they exist:**
- Mobile: structural skeletons on all screens; EmptyState on Saved/Profile; ErrorState with retry on all data screens; unavailable-content distinction on Saved.
- Web: ContentState (not-found, error, empty) on homepage, explore, path, lesson; skeleton components exist; error boundary (root error.tsx) with retry; not-found boundaries (root + public group).
- Where they still need work: visual refinement and consistency of these states across surfaces; the states exist functionally but have not been visually polished or audited for consistency between mobile and web.

**Visual, responsive, or accessibility issues observed:**
- Web placeholder routes (`/paths`, `/topics`, `/signin`) are visually unpolished (PlaceholderSection) — intentionally `noindex`, but linked from the header.
- The `middleware` file convention is deprecated in Next.js 16 (build warns to use `proxy` instead) — not breaking, but should migrate in M4.
- Web token set and mobile token set are aligned in value but not structurally unified — consolidation candidate for M4.
- Focus states exist (`:focus-visible` in globals.css) but have not been formally audited across all interactive elements.
- Touch targets meet 44px on mobile; web touch targets have not been formally audited.
- Heading hierarchy is logical on all pages but has not been audited with automated tooling.

**Tests that exist:**
- `packages/api`: 47 tests (Zod schemas, mappers, parser, media URL resolver, client, error handling) via `node --test`.
- `apps/web/src/lib`: 70 tests (explore-filters 25, lesson-body-parser 14, lesson-navigation 12, related-paths 7, revalidation 12) via `node --test`.
- `apps/mobile`: no automated tests (M2 validated manually + typecheck + lint).
- No end-to-end or integration tests exist.
- No CI pipeline exists.

**Validation commands that exist:**
- `pnpm lint` (root, runs lint on all packages with a lint script).
- `pnpm typecheck` (root, runs typecheck on all packages — but no workspace package defines a `typecheck` script yet; manual `tsc --noEmit` is used).
- `pnpm --filter @pathway/api test` (node --test).
- `pnpm --filter @pathway/web build` (next build).
- `pnpm --filter @pathway/mobile lint` (expo lint).
- Web lib tests are run manually via `node --experimental-strip-types --test apps/web/src/lib/*.test.ts` — no npm script wraps them.

**Limitations that should remain out of scope in M4:**
- New product features (auth, sync, payments, analytics, video player).
- Full design system with universal shared components across mobile and web.
- Deploy, screenshots, video demo, README final, portfolio packaging (M5).
- Any V2 functionality.
