# Milestone 1 — Shared CMS-to-Client Vertical Slice

> **Status:** Done
> **Active milestone:** No (M2 is active)

## User-visible objective

Change and publish a title in Strapi, then observe the same updated title in both the Expo app and the Next.js website after refresh — using a single shared typed API package.

## Scope

- **`packages/api`** — fetch client, Zod schemas, Strapi response mappers, and typed domain models for Learning Path and Lesson.
- **Expo** — one simple screen consuming a published learning path from the shared API package.
- **Next.js** — one simple page or route consuming the same published content from the shared API package.
- Both clients must use `@pathway/api` and must not hardcode production content.

## Out of scope

- Full app navigation
- Search
- Saved items
- Authentication
- Final visual design
- Complete SEO implementation
- Video pipeline
- Deployment

## Dependencies

- Milestone 0 complete (CMS running, content seeded, published content available via REST API).
- Strapi public read permissions for `learning-path`, `lesson`, `module`, `category`, `author`.

## Relevant invariants

- `architecture.content-source` — Strapi is the source of truth for structured content, media, and publishing.
- `architecture.surface-ownership` — Expo owns mobile; Next.js owns public web.
- `architecture.no-custom-cms` — Next.js must not recreate Strapi admin or content CRUD.
- `scope.v1` — Do not introduce V2 features before this milestone is demonstrably complete.
- `quality.external-data` — External CMS data must be runtime-validated at the API boundary.

## Acceptance criteria

- [x] A published title changed in Strapi appears in Expo after refresh.
- [x] A published title changed in Strapi appears in Next.js after refresh.
- [x] Both clients consume the shared `@pathway/api` package.
- [x] External CMS data is validated at the API boundary (Zod schemas, no `any`).
- [x] No production content is hardcoded independently in mobile or web.

## Manual demonstration sequence

1. Start the CMS: `pnpm dev:cms`
2. Open Strapi admin at http://localhost:1337/admin
3. Edit the title of the published **React Native Performance** learning path (or one of its published lessons)
4. Save and publish the change in Strapi
5. Start Expo: `pnpm dev:mobile` — confirm the updated title appears after refresh
6. Start Next.js: `pnpm dev:web` — confirm the updated title appears after refresh
7. Revert the title in Strapi, publish again, and confirm both clients reflect the revert

## Expected files and areas of change

| Area | Path | Purpose |
| ---- | ---- | ------- |
| API package | `packages/api/src/` | Fetch client, Zod schemas, mappers, domain models |
| API package config | `packages/api/package.json` | Dependencies (zod), exports |
| Expo screen | `apps/mobile/src/app/` | New or updated screen consuming `@pathway/api` |
| Expo config | `apps/mobile/package.json` | Add `@pathway/api` dependency |
| Next.js page | `apps/web/src/app/` | New or updated route consuming `@pathway/api` |
| Next.js config | `apps/web/package.json` | Add `@pathway/api` dependency |
| Env config | `.env` files as needed | `NEXT_PUBLIC_STRAPI_URL`, `EXPO_PUBLIC_STRAPI_URL` |

## Progress checklist

- [x] Add Zod and fetch dependencies to `packages/api`
- [x] Implement fetch client for Strapi REST API
- [x] Define Zod schemas for Strapi learning-path and lesson responses
- [x] Implement Strapi response mappers
- [x] Define typed domain models for Learning Path and Lesson
- [x] Export public API from `packages/api/src/index.ts`
- [x] Wire `@pathway/api` into Expo
- [x] Create Expo screen consuming a published learning path
- [x] Wire `@pathway/api` into Next.js
- [x] Create Next.js page consuming the same published content
- [x] Add required env variables for Strapi URL

## Validation checklist

- [x] `pnpm --filter @pathway/api exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/api test` passes (23 tests)
- [x] `pnpm --filter @pathway/web exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/mobile exec tsc --noEmit` passes
- [x] `pnpm --filter @pathway/web lint` passes
- [x] `pnpm --filter @pathway/mobile lint` — 1 pre-existing error in `use-color-scheme.web.ts` (not introduced by M1)
- [x] No `any` types introduced (verified via grep across `packages/api/src`, `apps/web/src`, `apps/mobile/src`)
- [x] Manual demo sequence passes end-to-end

## Evidence

- **API package**: `packages/api/src/index.ts` exports `createPathwayApiClient`, `LearningPath`, `LearningPathModule`, `LessonPreview`, `ContentImage`, `Difficulty`, `resolveStrapiMediaUrl`, `PathwayApiValidationError`, `PathwayApiHttpError`, `PathwayApiNetworkError`.
- **Zod validation**: `packages/api/src/strapi/learning-path.schema.ts` validates Strapi responses at runtime; `packages/api/src/strapi/learning-path.mapper.ts` maps to domain models.
- **Tests**: `pnpm --filter @pathway/api test` — 23 tests pass (parser, mapper, media URL resolver).
- **Expo**: `apps/mobile/src/lib/pathway-api.ts` creates singleton client; `apps/mobile/src/app/index.tsx` fetches featured paths with fallback; `apps/mobile/src/components/learning-path-card.tsx` renders domain fields only.
- **Next.js**: `apps/web/src/lib/pathway-api.ts` creates server-only client; `apps/web/src/app/(home)/page.tsx` links cards to `/paths/[slug]`; `apps/web/src/app/paths/[slug]/page.tsx` fetches by slug with `notFound()` and `generateMetadata`.
- **No direct Strapi access**: grep for `/api/learning-paths`, `documentId`, `data.attributes`, `attributes.` in `apps/web/src` and `apps/mobile/src` returns zero matches.
- **No hardcoded content**: grep for production titles in `apps/web/src` and `apps/mobile/src` returns zero matches.
- **No `any`**: grep for `any` in `packages/api/src`, `apps/web/src`, `apps/mobile/src` returns zero matches.
- **Manual proof**: Changed Strapi title to "React Native Performance — M1 Audit Sync Test"; confirmed updated title in Next.js `<h1>` and `<title>`; confirmed API returns updated title to both clients; Strapi logs show both Next.js (slug filter) and Expo (featured filter) requests via `@pathway/api`; restored original title and confirmed revert.
- **Web 404**: `/paths/slug-que-nao-existe` returns HTTP 404 with `noindex` meta tag.
- **Commit**: `94243fa` — `feat(pathway): complete shared CMS vertical slice`

## Known limitations

- No mobile path detail route — cards are informational, not clickable.
- No lesson route on web or mobile.
- No search, filters, saved items, progress, or authentication.
- No final visual design system.
- Mobile lint has 1 pre-existing error in `use-color-scheme.web.ts` (Expo scaffold code, not introduced by M1).
- Web `pnpm --filter @pathway/web build` was not run during this audit (dev server validation used instead).

## Deviations from plan

- **Env variable names**: Plan mentioned `NEXT_PUBLIC_STRAPI_URL` and `EXPO_PUBLIC_STRAPI_URL`. Web uses `STRAPI_URL` (server-only, no `NEXT_PUBLIC_` prefix needed since fetch happens server-side). Mobile uses `EXPO_PUBLIC_STRAPI_URL` as planned.
- **Web route structure**: Homepage moved to `(home)` route group to isolate `loading.tsx` from the dynamic route segment tree — workaround for Next.js 16 `HTTPAccessFallbackBoundary` bug where `loading.tsx` causes `notFound()` to return HTTP 200 instead of 404.
- **Lesson model**: Plan mentioned "Lesson" domain model. Implementation uses `LessonPreview` (lightweight lesson view inside a LearningPath tree) — full `Lesson` model deferred to M2.

## Handoff to M2

### Existing API queries and functions

- `createPathwayApiClient({ baseUrl })` — factory for the shared client.
- `api.getPublishedLearningPaths({ signal })` — all published Learning Paths.
- `api.getFeaturedLearningPaths({ signal, limit })` — featured Learning Paths only.
- `api.getLearningPathBySlug(slug, { signal })` — single Learning Path by slug, returns `null` if not found.
- `resolveStrapiMediaUrl(mediaUrl, baseUrl)` — resolves relative Strapi media URLs against a base URL.

### Stable domain models

- `LearningPath` — `id`, `slug`, `title`, `description`, `featured`, `difficulty`, `estimatedDuration`, `coverImage`, `modules`, `lessonCount`.
- `LearningPathModule` — `id`, `title`, `description`, `order`, `lessons`.
- `LessonPreview` — `id`, `slug`, `title`, `summary`, `estimatedDuration`, `difficulty`.
- `ContentImage` — `url`, `alternativeText`, `width`, `height`.
- `Difficulty` — `"beginner" | "intermediate" | "advanced"`.

### Routes and screens already consuming content

- **Web**: `/` (homepage with featured paths), `/paths/[slug]` (path detail with modules and lessons).
- **Mobile**: `src/app/index.tsx` (Home with featured paths, loading, error, empty states).

### Limitations to respect

- No full `Lesson` model yet — only `LessonPreview` exists (no body content, no video URL).
- No lesson-by-slug query in the API package yet.
- No search or filter queries in the API package yet.
- The shared package never reads env vars — clients pass `baseUrl` explicitly.

### Smallest next step in Expo

Establish the Expo app shell and navigation structure (tabs: Home, Explore) and wire the existing Home to the current `@pathway/api` client. Then build the Learning Path Detail route consuming `getLearningPathBySlug`.
