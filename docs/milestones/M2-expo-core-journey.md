# M2 — Expo Mobile Core Journey

## Status
Ready

## User-visible outcome

A user can open the app, browse published learning paths from Strapi, search for "FlashList", open the "React Native Performance" learning path, open the "Optimizing Long Lists with FlashList" lesson, save it, mark it as completed, close and reopen the app, and see their saved items and progress preserved locally.

## Goal

Deliver the smallest complete mobile learning journey: discovery → path detail → lesson detail → save → progress → persistence, all consuming the shared `@pathway/api` contract from M1.

## In scope

- Expo app shell and navigation structure (tabs: Home, Explore).
- Home consuming real published content from `@pathway/api`.
- Explore screen with search and loading/empty/error states.
- Learning Path Detail route consuming `getLearningPathBySlug`.
- Lesson Detail route consuming a new `getLessonBySlug` query (to be added to `@pathway/api`).
- Local persistence of saved items (AsyncStorage or equivalent).
- Local persistence of lesson progress (completed status).
- Loading, empty, and error states across all screens.
- Full flow validation end-to-end.

## Explicitly out of scope

- Authentication (real login, user accounts, JWT).
- Cross-device sync of saved items or progress.
- Backend storage of progress or saved items.
- Offline downloads of content or media.
- Push notifications.
- Payments or subscriptions.
- Gamification, badges, streaks, or complex scoring.
- Universal design system shared with web.
- Any M3+ functionality (web SEO, deployment, analytics).

## Existing dependencies from M1

- `createPathwayApiClient({ baseUrl })` — shared client factory.
- `api.getPublishedLearningPaths({ signal })` — all published Learning Paths.
- `api.getFeaturedLearningPaths({ signal, limit })` — featured Learning Paths.
- `api.getLearningPathBySlug(slug, { signal })` — single Learning Path by slug.
- `resolveStrapiMediaUrl(mediaUrl, baseUrl)` — media URL resolver.
- Domain models: `LearningPath`, `LearningPathModule`, `LessonPreview`, `ContentImage`, `Difficulty`.
- `apps/mobile/src/lib/pathway-api.ts` — singleton client.
- `apps/mobile/src/lib/env.ts` — `EXPO_PUBLIC_STRAPI_URL` reader.
- `apps/mobile/src/app/index.tsx` — Home screen (featured paths, loading, error, empty, refresh).
- `apps/mobile/src/components/learning-path-card.tsx` — card rendering domain fields.

## Relevant invariants

- `architecture.content-source` — Strapi is the source of truth; mobile does not hardcode content.
- `architecture.surface-ownership` — Expo owns the mobile learning product.
- `quality.external-data` — All CMS data is runtime-validated at the `@pathway/api` boundary.
- `scope.v1` — No V2 features beyond this milestone's scope.

## Product flow

1. User opens app → sees Home with featured learning paths from Strapi.
2. User taps Explore tab → sees all published learning paths, can search.
3. User searches "FlashList" → filtered results show "React Native Performance".
4. User taps "React Native Performance" → Learning Path Detail shows modules and lessons.
5. User taps "Optimizing Long Lists with FlashList" → Lesson Detail shows lesson content.
6. User taps Save → lesson is saved locally.
7. User taps Mark as Completed → progress is stored locally.
8. User closes and reopens app → saved items and progress are preserved.

## Incremental delivery slices

1. **Navigation shell** — Tab structure (Home, Explore), safe area, theme provider.
2. **Home with real content** — Wire existing Home to `@pathway/api` (already done in M1, verify and refine).
3. **Explore with search** — All published paths, client-side search filter, loading/empty/error states.
4. **Learning Path Detail** — Route consuming `getLearningPathBySlug`, modules and lessons list.
5. **Lesson Detail** — New `getLessonBySlug` in `@pathway/api`, route consuming it, lesson content rendering.
6. **Local persistence — saved items** — AsyncStorage (or equivalent), save/unsave toggle, saved items state.
7. **Local persistence — progress** — Lesson completion status stored locally, persisted across app restarts.
8. **States polish** — Loading, empty, and error states across all screens; pull-to-refresh where natural.
9. **Full flow validation** — End-to-end manual test of the complete journey.

## Acceptance criteria

- [ ] App has Home and Explore tabs.
- [ ] Home shows featured learning paths from Strapi via `@pathway/api`.
- [ ] Explore shows all published learning paths and supports search.
- [ ] Search for "FlashList" returns "React Native Performance".
- [ ] Learning Path Detail shows modules and lessons for a given slug.
- [ ] Lesson Detail shows lesson content for a given lesson slug.
- [ ] User can save a lesson and it persists across app restarts.
- [ ] User can mark a lesson as completed and it persists across app restarts.
- [ ] All screens have loading, empty, and error states.
- [ ] No content is hardcoded — all from `@pathway/api`.
- [ ] No `any` types introduced.
- [ ] `pnpm --filter @pathway/mobile exec tsc --noEmit` passes.
- [ ] `pnpm --filter @pathway/mobile lint` passes (or only pre-existing errors).
- [ ] `pnpm --filter @pathway/api test` passes.

## Validation checklist

- [ ] `pnpm --filter @pathway/api exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/api test` passes
- [ ] `pnpm --filter @pathway/mobile exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/mobile lint` passes (or only pre-existing errors)
- [ ] Manual flow: open → browse → search "FlashList" → open path → open lesson → save → complete → restart → verify persistence
- [ ] No `any` types introduced
- [ ] No hardcoded production content

## Expected areas of change

| Area | Path | Purpose |
| ---- | ---- | ------- |
| API package | `packages/api/src/` | Add `getLessonBySlug` query, `Lesson` domain model, Zod schema for lesson detail |
| API package exports | `packages/api/src/index.ts` | Export new `Lesson` model and `getLessonBySlug` |
| Mobile navigation | `apps/mobile/src/app/` | Tab structure, new routes for path detail and lesson detail |
| Mobile screens | `apps/mobile/src/app/` | Explore screen, path detail, lesson detail |
| Mobile components | `apps/mobile/src/components/` | Lesson card, search bar, save toggle, progress indicator |
| Mobile persistence | `apps/mobile/src/lib/` or `apps/mobile/src/hooks/` | AsyncStorage helpers for saved items and progress |
| Mobile env | `apps/mobile/.env` | `EXPO_PUBLIC_STRAPI_URL` (already configured) |

## Progress checklist

- [ ] Navigation shell with Home and Explore tabs
- [ ] Home consuming real content (verify from M1)
- [ ] Explore with search and states
- [ ] Learning Path Detail route
- [ ] Lesson Detail route (requires new `getLessonBySlug` in `@pathway/api`)
- [ ] Saved items local persistence
- [ ] Lesson progress local persistence
- [ ] Loading, empty, error states across all screens
- [ ] Full flow validation

## Evidence

_To be filled as slices are completed._

## Handoff to M3

_To be filled when M2 is closed. Expected: stable mobile journey, API contract extended with lesson detail, local persistence patterns established for M3 web reading experience._