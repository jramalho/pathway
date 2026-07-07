# M4 — Product Polish and Engineering Signals

## Status
Ready

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

- [ ] Visual audit and token consolidation documented
- [ ] Priority reusable primitives implemented
- [ ] Mobile main flow polished (Home, Explore, Path Detail, Lesson Detail, Saved)
- [ ] Web public pages polished (Homepage, Explore, Path, Lesson)
- [ ] Loading, error, empty, and unavailable states hardened
- [ ] Accessibility review completed (labels, focus, contrast, touch targets, headings)
- [ ] At least one meaningful automated test added
- [ ] CI configured for lint, typecheck, and tests
- [ ] Final demonstration flow has no visibly broken states
- [ ] `pnpm --filter @pathway/api exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/api test` passes
- [ ] `pnpm --filter @pathway/web exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/web lint` passes
- [ ] `pnpm --filter @pathway/web build` passes
- [ ] `pnpm --filter @pathway/mobile exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/mobile lint` passes
- [ ] No `any` types introduced
- [ ] No hardcoded production content

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

- [ ] Slice 1: Visual audit and token consolidation
- [ ] Slice 2: Priority reusable primitives
- [ ] Slice 3: Mobile main flow polish
- [ ] Slice 4: Web public page polish
- [ ] Slice 5: Loading, error, empty, and unavailable states
- [ ] Slice 6: Accessibility review
- [ ] Slice 7: Meaningful automated test
- [ ] Slice 8: CI for lint, typecheck, and tests
- [ ] Slice 9: Final demonstration flow review

## Evidence

_To be filled as slices are completed._

## Handoff to M5

_To be filled when M4 is closed. Expected: visually coherent mobile and web experience; consolidated tokens; hardened states; accessibility review done; at least one meaningful test; CI running; ready for deployment, screenshots, and portfolio packaging._
