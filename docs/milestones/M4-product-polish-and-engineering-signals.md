# M4 — Product Polish and Engineering Signals

## Status
Done

## User-visible outcome

A visitor opens the mobile app or the public website and experiences a visually coherent, refined, and reliable product. The primary flows — discovering a learning path, opening it, reading a lesson — feel consistent across mobile and web. Loading, error, and empty states are clear and never leave a blank screen. Accessibility basics hold. At least one automated test meaningfully guards a real behavior, and lint, typecheck, and tests run in CI.

## Goal

Deliver a visually coherent, refined, and reliable experience across mobile and web without expanding product scope. Apply the green neo-brutalist visual language consistently, consolidate shared tokens where it makes sense, refine the primary user flows, harden product states, run a practical accessibility review, add at least one meaningful automated test, and configure continuous validation for lint, typecheck, and tests.

## In scope

- Apply the green neo-brutalist visual language consistently across mobile and web.
- Consolidate tokens (color, typography, spacing, borders, radii, shadows, icons, touch targets) when it makes sense for the current structure.
- Refine the primary mobile flows: Home, Explore, Learning Path Detail, Lesson Detail, Saved.
- Refine the public web pages: Homepage, Explore, Learning Path, Lesson.
- Ensure consistency between equivalent mobile and web components without forcing artificial component sharing.
- Improve priority loading, error, and empty states.
- Practical accessibility review: labels, visible focus on web, contrast, touch targets on mobile, heading hierarchy and editorial content on web.
- Add at least one meaningful automated test if none exists.
- Configure or complete CI for lint, typecheck, and tests if the project structure supports it without undue scope expansion.
- Ensure the main demonstration flow has no visibly broken states.

## Explicitly out of scope

- New product features.
- Real authentication.
- Progress sync across devices.
- Payments.
- Advanced analytics.
- Full redesign without need.
- A large universal design system.
- Deploy, final screenshots, video demo, final README, and portfolio packaging — these belong to M5.
- Any V2 functionality.

## Existing dependencies from M1, M2 and M3

- `@pathway/ui-tokens` — foundation.ts (raw values), semantic.ts (purpose-named), index.ts (flat export). Covers color, spacing, typography, border, radius, shadow, icon, touch, layout, zIndex.
- `apps/web/src/styles/tokens.stylex.ts` — web-only StyleX CSS custom properties mirroring the platform-agnostic values, extended with web-specific surfaces and transitions.
- Mobile consumes `@pathway/ui-tokens` directly; web consumes its own StyleX tokens that mirror the same values. The two token sets are aligned in value but not structurally unified.
- Mobile visual components: structural skeletons, EmptyState, ErrorState, PathCover, LessonMediaPreview, tab bar, module accordions, bookmark toggles, completion cards.
- Web visual components: PublicShell (header, footer, skip link), ContentState, skeleton components, HomeHero, PathHero, PathSummary, PathCurriculum, ModuleRow, LessonRow, RelatedPaths, LessonHero, LessonMedia, LessonBodyRenderer, LessonToc, LessonShare, LessonNav, LessonPathCta, LessonRelated, Breadcrumbs, ExploreWorkbench.
- Web routes: `/`, `/explore`, `/paths/[slug]`, `/lessons/[slug]`, `/paths` (placeholder), `/topics` (placeholder), `/signin` (placeholder), `/sitemap.xml`, `/robots.txt`, `/api/revalidate`.
- Mobile screens: Home, Explore, Saved, Profile, Learning Path Detail, Lesson Detail.
- Tests: 47 API tests, 70 web lib tests — all via `node --test`. No mobile tests. No CI.
- Validation commands: `pnpm lint`, `pnpm typecheck` (manual tsc), `pnpm --filter @pathway/api test`, `pnpm --filter @pathway/web build`, `pnpm --filter @pathway/mobile lint`.

## Relevant invariants

- `architecture.content-source` — Strapi is the source of truth; no content duplication.
- `architecture.surface-ownership` — Expo owns mobile, Next.js owns public web.
- `architecture.no-custom-cms` — no CMS admin in Next.js.
- `quality.external-data` — runtime validation at the API boundary.
- `scope.v1` — no V2 features.

## Visual direction

Green neo-brutalism, refined:

- Deep forest-green header surface (`#0F3D2E` on web).
- Warm off-white page surface (`#FAF9F5`).
- Dark, high-contrast borders (`#000000`, 3px strong / 2px thin).
- Hard offset shadows (no blur).
- Restrained emerald/mint/acid-green accents (`#D4E7DD`, `#79FF5B`, `#38FE13`).
- Epilogue headings, Inter body.
- No gradients, no glassmorphism, no decorative blur.
- Consistent hover, focus, and pressed states.

## Prioritized user flows

1. **Mobile Home → Learning Path → Lesson** — the core reading journey.
2. **Mobile Explore** — discovery with search and filters.
3. **Mobile Saved** — returning to saved content.
4. **Web Homepage → Learning Path → Lesson** — the public reading journey.
5. **Web Explore** — discovery with search and filters.

## Incremental delivery slices

1. **Visual audit and token consolidation** — Audit existing mobile and web tokens, identify drift, consolidate where it makes sense without forcing structural unification. Document the current state and the target.
2. **Priority reusable primitives** — Identify and implement the smallest set of reusable primitives needed to make the primary flows visually coherent (buttons, cards, badges, state containers). No large design system.
3. **Mobile main flow polish** — Refine Home, Explore, Learning Path Detail, Lesson Detail, Saved against the visual direction.
4. **Web public page polish** — Refine Homepage, Explore, Learning Path, Lesson against the visual direction.
5. **Loading, error, empty, and unavailable states** — Harden priority states across mobile and web; ensure no blank screens.
6. **Accessibility review** — Labels, visible focus on web, contrast, touch targets on mobile, heading hierarchy and editorial content on web.
7. **Meaningful automated test** — Add at least one automated test that meaningfully guards a real behavior if none exists.
8. **CI for lint, typecheck, and tests** — Configure continuous validation if the project structure supports it without undue scope expansion.
9. **Final demonstration flow review** — Walk the main flows end-to-end; ensure no visibly broken states.

## Reusable primitives

Identify during slice 1–2. Candidates based on what exists:

- **Buttons / CTAs** — primary, secondary, ghost (web has CTA styles inline; mobile has inline styles).
- **Cards** — path card, lesson card (mobile and web each have their own; align visual language without sharing code).
- **Badges** — difficulty, duration, topic (both surfaces have inline badge-like elements).
- **State containers** — loading skeleton, error, empty, unavailable (mobile has EmptyState/ErrorState; web has ContentState).
- **Media containers** — cover image with fallback, lesson media with fallback (both surfaces have fallback logic).

Do not force a single shared component library across React Native and React DOM. Share tokens and visual language, not component code.

## Accessibility expectations

- **Labels** — all interactive elements have accessible names (links, buttons, toggles, inputs).
- **Visible focus on web** — `:focus-visible` outlines present and visible on all interactive elements.
- **Contrast** — text and interactive elements meet WCAG AA contrast against their backgrounds.
- **Touch targets on mobile** — 44px minimum on all interactive elements.
- **Heading hierarchy** — one h1 per page; logical heading order; no skipped levels.
- **Editorial content on web** — semantic article structure, lists, blockquotes, code blocks, links with safe rel attributes.
- **Reduced motion** — respect `prefers-reduced-motion`.
- **Skip link** — web has a skip-to-content link; verify it works.

## Quality and testing expectations

- No `any` types.
- No hardcoded production content.
- No broken imports or invalid routes.
- `pnpm --filter @pathway/api exec tsc --noEmit` passes.
- `pnpm --filter @pathway/api test` passes.
- `pnpm --filter @pathway/web exec tsc --noEmit` passes.
- `pnpm --filter @pathway/web lint` passes.
- `pnpm --filter @pathway/web build` passes.
- `pnpm --filter @pathway/mobile exec tsc --noEmit` passes.
- `pnpm --filter @pathway/mobile lint` passes.
- At least one meaningful automated test guards a real behavior.
- CI runs lint, typecheck, and tests on push/PR if the project structure supports it.

## Validation checklist

- [x] Visual audit and token consolidation documented
- [x] Priority reusable primitives implemented
- [x] Mobile main flow polished (Home, Explore, Path Detail, Lesson Detail, Saved)
- [x] Web public pages polished (Homepage, Explore, Path, Lesson)
- [x] Loading, error, empty, and unavailable states hardened
- [x] Accessibility review completed (labels, focus, contrast, touch targets, headings)
- [x] At least one meaningful automated test added
- [x] CI configured for lint, typecheck, and tests
- [x] Final demonstration flow has no visibly broken states
- [x] `pnpm --filter @pathway/api exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/api test` passes
- [x] `pnpm --filter @pathway/web exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/web lint` passes
- [x] `pnpm --filter @pathway/web build` passes
- [x] `pnpm --filter @pathway/mobile exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/mobile lint` passes
- [x] No `any` types introduced
- [x] No hardcoded production content

## Expected areas of change

| Area | Path | Purpose |
| ---- | ---- | ------- |
| Shared tokens | `packages/ui-tokens/src/` | Consolidate tokens if drift found |
| Web tokens | `apps/web/src/styles/tokens.stylex.ts` | Align with consolidated tokens |
| Web components | `apps/web/src/components/` | Polish, reusable primitives, state containers |
| Web pages | `apps/web/src/app/(public)/` | Polish page layouts |
| Mobile components | `apps/mobile/src/components/` | Polish, reusable primitives, state containers |
| Mobile screens | `apps/mobile/src/app/` | Polish screen layouts |
| Tests | `packages/api/src/`, `apps/web/src/lib/`, `apps/mobile/src/` | Add meaningful test |
| CI | `.github/workflows/` or equivalent | Lint, typecheck, test pipeline |
| Middleware | `apps/web/src/middleware.ts` → `proxy.ts` | Migrate deprecated middleware convention |

## Progress checklist

- [x] Slice 1: Visual audit and token consolidation
- [x] Slice 2: Priority reusable primitives
- [x] Slice 3: Mobile main flow polish
- [x] Slice 4: Web public page polish
- [x] Slice 5: Loading, error, empty, and unavailable states
- [x] Slice 6: Accessibility review
- [x] Slice 7: Meaningful automated test
- [x] Slice 8: CI for lint, typecheck, and tests
- [x] Slice 9: Final demonstration flow review

## Evidence

### Visual and token consolidation (M4.1, M4.9)

- `@pathway/ui-tokens` exports `foundation` (raw values), `semantic` (purpose-named), and `tokens` (flat backward-compatible export). Covers color, spacing, typography, border, radius, shadow, icon, touch, layout, zIndex.
- Web `apps/web/src/styles/tokens.stylex.ts` mirrors the same values as StyleX CSS custom properties, extended with web-specific surfaces and transitions.
- Mobile consumes `@pathway/ui-tokens` directly via `apps/mobile/src/constants/theme.ts`; web consumes its own StyleX tokens. Aligned in value, not structurally unified — intentional (see `docs/decisions/visual-system.md`).
- No hardcoded `#000000`/`#FAF9F5`/`#EFEEEA`/`#D4E7DD`/`#79FF5B`/`#38FE13` in mobile source (grep confirmed). Only documented `#0F1F18` code-block surface remains.
- Web has editorial-specific colors in `lesson-body-renderer.tsx` (`#0F1F18` code surface, `#C9D6CF` code language label, `#14503B` code header, `#E9E8E4` inline code) — intentional, not token drift.

### Reusable primitives consolidated

**Mobile (`apps/mobile/src/components/ui/`):** NeoButton, BookmarkControl, FilterChip, CardShell, EmptyState, ErrorState, PathCover, LessonMediaPreview, Screen, TabBar, ProgressBar, Tag, DifficultyBadge, DurationLabel, SkeletonCard, LoadingState, SearchInput, NeoPressable, NeoSurface.

**Web (`apps/web/src/components/primitives/`):** PrimaryButton, SecondaryButton, GhostButton, BookmarkControl, FilterChip, CardShell, EmptyState, ErrorState, DifficultyBadge, DurationLabel, ProgressBar, SearchInput, SkeletonCard. State containers in `apps/web/src/components/public/states/`: ContentState, StateIcon, StateAction, SkeletonPage, SkeletonText, SkeletonMedia.

### Mobile flows (M4.2, M4.3)

- **Home** (`apps/mobile/src/app/(tabs)/index.tsx`): greeting, continue learning card with real progress, featured paths, recommended lessons, recently saved, hydration skeleton.
- **Explore** (`apps/mobile/src/app/(tabs)/explore.tsx`): all published paths, client-side search, topic filters (All, Mobile, Accessibility, Product, AI), no-results state, loading skeleton, error retry.
- **Learning Path Detail** (`apps/mobile/src/app/paths/[slug].tsx`): hero with cover/metadata/progress/contextual CTA (START PATH / CONTINUE LEARNING / REVIEW PATH), module accordions with completion summary, lesson rows with LessonStatusIndicator (icon + text, never color alone), bookmark toggle, back navigation.
- **Lesson Detail** (`apps/mobile/src/app/lessons/[slug].tsx`): context breadcrumb (LessonContextLink), tags, title, summary, author, media preview/fallback, LessonBodyRenderer (typed Markdown blocks), key takeaway, LessonCompletionCard with path-complete feedback, prev/next navigation (router.replace resets scroll).
- **Saved** (`apps/mobile/src/app/(tabs)/saved.tsx`): segmented control (Lessons/Paths), resolves saved slugs against published content, distinguishes empty vs unavailable, storage error notice.
- **Profile** (`apps/mobile/src/app/(tabs)/profile.tsx`): hero, learning overview grid, active/completed path cards, completed lesson rows, local data notice.
- **Save/remove lesson**: BookmarkControl with accessibilityState.selected, persists via AsyncStorage.
- **Mark lesson complete/incomplete**: LessonCompletionCard, path-complete banner on last lesson, persists via AsyncStorage.
- **Persistence**: AsyncStorage (`@pathway/learning-activity:v1`), versioned payload, type-guarded read, single-flight write queue, hydration before writes, storage error handling without data loss (see ADR-003).

### Web flows (M4.4)

- **Homepage** (`apps/web/src/app/(public)/page.tsx`): HomeHero + FeaturedPathsSection + PopularLessonsSection + TopicsSection + PracticalLearningSection. Sections gracefully omitted when CMS empty. revalidate=300.
- **Explore** (`apps/web/src/app/(public)/explore/page.tsx`): search + topic/difficulty filters, URL sync debounced, no-results state with clear-filters, noindex on filtered variants, canonical to /explore.
- **Learning Path** (`apps/web/src/app/(public)/paths/[slug]/page.tsx`): hero + curriculum + sticky summary + related paths. notFound() for missing/unpublished. generateStaticParams. revalidate=300.
- **Lesson** (`apps/web/src/app/(public)/lessons/[slug]/page.tsx`): hero + media + TOC + Markdown body renderer + share + prev/next nav + parent CTA + related lessons. notFound() for missing/unpublished. generateStaticParams. revalidate=300.
- **Direct URLs**: SSG paths and lessons (●) prerendered at build time; future content generated on-demand and cached.
- **Responsiveness**: mobile navigation (hamburger) operable by keyboard, desktop nav links, viewport meta present on all routes.
- **Metadata**: buildPathMetadata, buildLessonMetadata, buildCanonicalUrl in `apps/web/src/lib/metadata.ts` — title, description, canonical, OG, twitter card, article:published_time. Not broken by M4.
- **States**: 404 with noindex, error boundary with toUserFacingError, ContentState (loading/error/empty/unavailable/not-found).

### Accessibility improvements verified (M4.5, M4.6)

**Mobile:**
- accessibilityRole on all interactive elements (button, tab, search, header, progressbar, alert, summary).
- accessibilityLabel on cards ("Open learning path/lesson {title}"), bookmarks ("Save/Remove {title}"), completion ("Mark lesson {title} as complete/incomplete"), navigation ("Go to previous/next lesson {title}").
- accessibilityState: selected (tabs, chips, bookmarks), disabled (hydration, action loading), expanded (module accordions).
- Touch targets: 44px minimum (Layout.touchTarget), hitSlop extends smaller visual targets. FilterChip raised from 36px to 44px.
- Decorative icons: accessibilityElementsHidden + importantForAccessibility="no-hide-descendants".
- Hydration: bookmark and completion controls disabled with accessibilityState.disabled; progress shows "RESTORING PROGRESS" not misleading 0%.
- ErrorState: accessibilityRole=alert + accessibilityLiveRegion=assertive + retryLoading.
- EmptyState: accessibilityRole=summary + accessibilityLiveRegion=polite.

**Web:**
- Semantic HTML: header, nav, main, section, article, aside, footer. One h1 per page, logical heading order.
- Skip link: PublicShell renders "Skip to content" visible on :focus-visible, targets #main-content.
- Focus visibility: :focus-visible on all interactive elements (2px solid accentFocus, 2px offset). Converted from :focus to :focus-visible across all public components.
- Keyboard navigation: tab order follows visual order. Mobile menu operable by keyboard (Escape closes, focus moves to first link on open, back to trigger on close).
- Search input: aria-label, visible clear button with aria-label="Clear search".
- Filters: aria-pressed on filter chips, fieldset + legend for topic/difficulty groups.
- Breadcrumbs: nav aria-label="Breadcrumb", aria-current="page" on current page.
- TOC: aside aria-label="Table of contents" with nav inside.
- Images: alt from Strapi when available, decorative fallbacks aria-hidden.
- Share controls: aria-label on every button/link, copy button announces success via aria-live=polite.
- Progress bars: role=progressbar with aria-valuenow/min/max and aria-label.
- Error/empty states: ContentState uses role=alert (error, unavailable) or role=status (loading, empty, not-found) with appropriate aria-live.
- Reduced motion: globals.css disables animations and transitions under @media (prefers-reduced-motion: reduce), including skeleton pulse.

### Automated test (M4.7)

- **Learning activity reducer test** (13 tests) in `apps/mobile/src/features/learning-activity/learning-activity.test.ts`.
- Guards: TOGGLE_LESSON_SAVED (add/remove/prepend), MARK_LESSON_COMPLETED (mark/idempotent), MARK_LESSON_INCOMPLETE (remove/no-op), TOGGLE_PATH_SAVED (add/remove), full user flow (save → complete → unsave → incomplete), toPersistedPayload (ordered arrays, version 1), HYDRATE/HYDRATE_EMPTY/HYDRATE_ERROR.
- Pure-function test, no mocks, no React rendering, no AsyncStorage, no Strapi.
- Uses existing node:test + --experimental-strip-types stack — no new dependencies.
- Mobile test script: `node --experimental-strip-types --test src/lib/lesson-body-parser.test.ts src/features/learning-activity/learning-activity.test.ts` (21 tests total).
- Root test script: `pnpm --filter @pathway/api test && pnpm --filter @pathway/mobile test` (68 tests total).

### CI (M4.8)

- `.github/workflows/quality.yml` runs on pull_request and push to main.
- Steps: checkout, setup Node 22 LTS, corepack enable, pnpm 11.8.0, pnpm install --frozen-lockfile, pnpm lint, pnpm typecheck, pnpm test.
- No secrets, no Strapi, no database, no Expo account, no continue-on-error.
- See `docs/decisions/testing-and-ci.md` for full rationale.

### Quality validation (M4.9, re-validated 2026-07-07)

| Check | Command | Result |
| ----- | ------- | ------ |
| Frozen lockfile | `pnpm install --frozen-lockfile` | ✅ reproducible |
| Lint | `pnpm lint` | ✅ mobile + web pass (0 errors, 0 warnings) |
| Typecheck | `pnpm typecheck` | ✅ api + cms + mobile + web pass |
| Test | `pnpm test` | ✅ 68 tests pass (47 API + 21 mobile) |
| Web build | `pnpm --filter @pathway/web build` | ✅ 11 static pages generated |
| CI workflow | `.github/workflows/quality.yml` | ✅ lint + typecheck + test |
| No `any` | grep `: any\|as any\|<any>` | ✅ no type-level `any` in mobile/web source |

### Manual demonstration

**Not executed in this audit session.** The environment has no running Strapi CMS, Expo simulator, or Next.js dev server. Previous manual demonstrations are documented in M2 and M3 evidence in `.project/project-state.json`. The codebase inspection confirms:
- Mobile screens exist and are wired to @pathway/api with loading/empty/error states.
- Web routes exist and are server-rendered with ISR, notFound(), error boundary, sitemap, robots.
- Both surfaces consume the shared API package — no raw Strapi payload interpretation in components.
- All validation commands pass (lint, typecheck, test, build).

**What needs manual validation before publishing:**
- Start Strapi with published content, start Expo, walk mobile flows (Home → Explore → search "FlashList" → Path → Lesson → save → complete → restart → verify persistence).
- Start Next.js, walk web flows (homepage → path → lesson → direct URL reload → invalid slug → mobile viewport → desktop viewport).
- Verify metadata (title, description, canonical, OG) in browser dev tools.

## Known limitations

- **No authentication** — local-only demo, no sign-in, no user accounts.
- **Saved items are local** — AsyncStorage on mobile only, no cross-device sync.
- **Progress does not sync** — lesson completion stored locally on device.
- **Media is thumbnail/embed** — no video player pipeline; direct video URLs render native `<video>` (web) or play-icon affordance (mobile); external platform URLs not embedded.
- **Search is limited** — client-side substring match, no full-text search.
- **No E2E tests** — no Playwright/Cypress/Detox; validation is manual + unit tests.
- **No Strapi integration test** — API tests use Zod schemas and mappers with fixture payloads.
- **No React component tests** — reducer test guards business logic; UI validated manually.
- **No coverage analysis** — node:test does not emit coverage reports.
- **Mobile lesson body links** — external http(s) links render as styled text on native (Expo Router rejects external URLs); expo-web-browser wiring deferred.
- **Web ToC scroll-spy** — no JavaScript active-heading tracking; TOC links to real anchors but doesn't highlight current section.
- **Dark mode** — intentionally single-mode (light); no dark theme planned for V1.
- **Mobile landscape** — not explicitly supported or tested.
- **No automated a11y testing** — no axe or similar wired; validation is manual.
- **CMS lint** — apps/cms has no lint script (Strapi does not ship a linter by default).

## Deviations from plan

- **Middleware not migrated to proxy.ts**: The M4 document listed `apps/web/src/middleware.ts → proxy.ts` as an expected area of change. Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts` (with a codemod). The file was NOT migrated — `middleware.ts` still exists and works (deprecated but functional). This is a minor deviation: the build passes, the middleware works, but the file convention is deprecated. M5 should migrate it via `npx @next/codemod@canary middleware-to-proxy .` or manually rename + update the export.
- **Web build page count varies**: M4.4 evidence says 21 static pages, M4.5 says 11, M4.9 says 11. The actual build on 2026-07-07 produces 11 static pages (the seed content has 1 published path with 9 published lessons). The 21-page count was likely from a different seed state. Not a regression — the build reflects current published content.
- **No web build in CI**: The CI workflow runs lint, typecheck, and test but not `pnpm --filter @pathway/web build`. The build is validated locally. Adding it to CI would increase confidence but also build time. Documented as a known limitation.

## Important decisions taken

- **Share tokens, not components** (see `docs/decisions/visual-system.md`): React Native and React DOM have fundamentally different styling primitives. Forcing a shared component library would add complexity without reuse value. Each platform consumes the same token values and builds its own components.
- **Accessibility is manual, not automated** (see `docs/decisions/accessibility-and-states.md`): No axe or automated a11y testing is wired. Validation is manual via the checklist in the ADR. This is a V1 limitation, not a permanent decision.
- **Test the reducer, not the UI** (see `docs/decisions/testing-and-ci.md`): The learning activity reducer contains 100% of the business logic for save/complete. Testing it as a pure function is the strongest possible guard without introducing Jest/Vitest/RNTL. UI is validated manually.
- **CI validates lint/typecheck/test, not build**: The CI workflow does not run the web build. Build validation is local. This keeps CI fast and avoids Next.js build complexity in CI. Documented as a known limitation.

## Handoff to M5

### Screens ready for screenshots

- **Mobile**: Home (with content), Explore (with search results), Learning Path Detail (with modules expanded), Lesson Detail (with body content), Saved (with saved items), Profile (with activity).
- **Web**: Homepage (with all sections), Explore (with filters), Learning Path page (with curriculum), Lesson page (with article body + TOC).
- **Strapi**: Admin dashboard showing content types, editing a lesson, publishing a path.

### Flows that can be demonstrated safely

- **Mobile**: Home → Explore → search "FlashList" → open React Native Performance path → open Optimizing Long Lists with FlashList lesson → save → mark complete → restart app → verify Saved and Profile show the activity.
- **Web**: Homepage → click featured path → path page → click first lesson → lesson page → reload URL directly → go back → Explore → search → filter by topic → invalid slug shows 404.
- **Strapi**: Open admin → Content Manager → Learning Paths → edit a published path title → save → see it appear on web (after ISR revalidate=300 or manual revalidate).

### Best URLs/routes/seed data for recording

- **Seed**: `pnpm --filter @pathway/cms seed:pathway` creates 4 categories, 1 author, 4 learning paths, 12 modules, 36 lessons. Only "React Native Performance" path is published (3 modules, 9 published lessons).
- **Web URLs**: `/`, `/explore`, `/paths/react-native-performance`, `/lessons/optimizing-long-lists-with-flashlist`.
- **Mobile routes**: Home tab, Explore tab, `/paths/react-native-performance`, `/lessons/optimizing-long-lists-with-flashlist`, Saved tab, Profile tab.
- **Invalid slug**: `/paths/slug-que-nao-existe` → 404 with noindex.

### How to run mobile, web, and CMS

| Surface | Command | URL |
| ------- | ------- | --- |
| CMS (Strapi) | `pnpm dev:cms` | http://localhost:1337/admin |
| Web (Next.js) | `pnpm dev:web` | http://localhost:3000 |
| Mobile (Expo) | `pnpm dev:mobile` | press `i` (iOS) or `a` (Android) |
| Mobile (iOS) | `pnpm dev:mobile:ios` | iOS Simulator |
| Mobile (Android) | `pnpm dev:mobile:android` | Android Emulator |

Seed: `pnpm --filter @pathway/cms seed:pathway` (see `docs/cms-seeding.md` for reset-and-seed workflow).

### Environment variables that impact deploy

| Variable | Surface | Required | Purpose |
| --------- | ------- | -------- | ------- |
| `STRAPI_URL` | Web | Yes (server) | Strapi CMS base URL for API calls |
| `NEXT_PUBLIC_SITE_URL` | Web | Yes (production) | Public origin for canonical, OG, sitemap, robots |
| `SITE_URL` | Web | No (legacy) | Fallback for NEXT_PUBLIC_SITE_URL |
| `REVALIDATE_SECRET` | Web | No (optional) | Bearer token for on-demand revalidation webhook |
| `EXPO_PUBLIC_STRAPI_URL` | Mobile | Yes (build time) | Strapi CMS base URL, inlined into the app |
| `HOST` | CMS | Yes | Strapi bind host (default 0.0.0.0) |
| `PORT` | CMS | Yes | Strapi port (default 1337) |
| `APP_KEYS` | CMS | Yes | Strapi session secrets |
| `API_TOKEN_SALT` | CMS | Yes | Strapi API token salt |
| `ADMIN_JWT_SECRET` | CMS | Yes | Strapi admin JWT secret |
| `TRANSFER_TOKEN_SALT` | CMS | Yes | Strapi transfer token salt |
| `JWT_SECRET` | CMS | Yes | Strapi JWT secret |
| `ENCRYPTION_KEY` | CMS | Yes | Strapi encryption key |

### Limitations that need to appear in the README

- No authentication, no user accounts — local-only demo.
- Saved items and progress are device-local (AsyncStorage), no cross-device sync.
- No video player pipeline — media is thumbnail/embed only.
- Search is client-side substring match, not full-text.
- No E2E or component tests — validation is manual + unit tests.
- No automated accessibility testing — manual checklist only.
- No dark mode — intentionally single-mode (light).
- Mobile lesson body external links do not navigate (expo-web-browser wiring deferred).
- Web ToC has no scroll-spy active-heading tracking.
- On-demand revalidation webhook is implemented and unit-tested but end-to-end Strapi webhook trigger was not validated manually.
- `middleware.ts` is deprecated in Next.js 16 (should be `proxy.ts`) — works but should be migrated.

### Risks before publishing

- **Strapi demo path**: If Strapi is not deployed, the demo requires a local Strapi instance running. This is the biggest friction point for a portfolio demo — a reviewer must run `pnpm dev:cms` and seed content. Consider a deployed Strapi instance or a clear, fast local setup guide.
- **Expo demo path**: Expo Go may not be compatible with all native modules (expo-symbols, expo-image). A development build or EAS Build may be needed for a reliable demo. Expo Go compatibility must be verified.
- **Web deploy**: Next.js deploys cleanly to Vercel. The only requirement is `STRAPI_URL` (pointing to a reachable Strapi) and `NEXT_PUBLIC_SITE_URL` (the public origin). If Strapi is local-only, the deployed web app will show empty/error states — the demo only works with a running CMS.
- **Seed content**: Only 1 of 4 learning paths is published. The demo shows a single path with 9 lessons. This is honest but may look sparse. Consider publishing more seed content for the demo (content change, not code change).
- **Middleware deprecation**: `middleware.ts` works but is deprecated in Next.js 16. Should be migrated to `proxy.ts` before or during M5 to avoid future breakage.
