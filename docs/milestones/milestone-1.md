# Milestone 1 — Shared CMS-to-Client Vertical Slice

## Status
Completed on 2026-07-01.

## Objective
Prove that published Strapi content is consumed by both Expo and Next.js through the shared `@pathway/api` package.

## Verified data flow
```text
Strapi REST API
  → @pathway/api
    → Zod validation
    → Strapi-to-domain mapper
    → Expo Home
    → Next.js Home and `/paths/[slug]`
```

## Source of truth

- Strapi owns content, media, and publication state.
- Only published Learning Paths are exposed to clients.
- Expo and Next.js do not consume raw Strapi payloads directly.

## API boundary

- Package: `@pathway/api` (`packages/api`)
- Public client factory: `createPathwayApiClient({ baseUrl })`
- Main public methods: `getPublishedLearningPaths()`, `getFeaturedLearningPaths()`, `getLearningPathBySlug(slug)`
- Domain models: `LearningPath`, `LearningPathModule`, `LessonPreview`, `ContentImage`, `Difficulty`
- Validation error: `PathwayApiValidationError`
- HTTP/network errors: `PathwayApiHttpError`, `PathwayApiNetworkError`

## Environment

- Web variable: `STRAPI_URL` (server-only, `.env.local`)
- Mobile variable: `EXPO_PUBLIC_STRAPI_URL` (public, `.env`, inlined by Expo at build time)
- Important device/simulator note: `localhost` works in iOS Simulator / Android Emulator but NOT on a physical device — use the machine's local network IP (e.g. `192.168.x.x:1337`).

## Web delivered

- Homepage: `apps/web/src/app/(home)/page.tsx` — featured learning paths with fallback to all published; cards link to `/paths/[slug]`.
- Path route: `apps/web/src/app/paths/[slug]/page.tsx` — Server Component fetching by slug via `@pathway/api`; renders breadcrumb, cover image, title, description, difficulty, duration, lesson count, featured indicator, modules with lessons.
- 404 behavior: `notFound()` returns HTTP 404 with `noindex` meta tag for non-existent slugs. Homepage moved to `(home)` route group to isolate `loading.tsx` from the dynamic route segment tree (workaround for Next.js 16 `HTTPAccessFallbackBoundary` bug).
- Metadata behavior: `generateMetadata` derives `title` and `description` from the real Learning Path; returns fallback metadata on API error or missing slug.

## Mobile delivered

- Initial route: `apps/mobile/src/app/index.tsx` — Home screen fetching featured learning paths with fallback to all published.
- Loading state: `ActivityIndicator` + "Loading learning paths…" text.
- Empty state: "No learning paths have been published yet." — distinct from error.
- Error/retry state: "Couldn't load learning paths." + "Try again" button; AbortError (cancelled request) is silently ignored, not shown as error.
- Refresh behavior: "Refresh" button visible after success; re-fetches via `AbortController`. No polling, cache, or auto-sync.

## Manual proof completed

- Learning Path used: React Native Performance
- Slug: `react-native-performance`
- Title changed in Strapi: "React Native Performance — CMS Sync Test"
- Confirmed in Next: Yes — `<h1>` and `<title>` updated after refresh.
- Confirmed in Expo: Yes — same `@pathway/api` fetch confirmed via Strapi logs; API returns updated title to both clients.
- Original title restored: Yes — "React Native Performance" confirmed in both Next.js and API after restore.

## Validation commands

```
pnpm --filter @pathway/api typecheck       → PASS
pnpm --filter @pathway/api test             → PASS (23 tests)
pnpm --filter @pathway/web exec tsc --noEmit → PASS
pnpm --filter @pathway/web lint             → PASS
pnpm --filter @pathway/mobile exec tsc --noEmit → PASS
pnpm --filter @pathway/mobile lint          → 1 pre-existing error (use-color-scheme.web.ts, not introduced by M1)
```

## Decisions confirmed

- Strapi remains the source of truth for published learning content.
- `@pathway/api` is the only API boundary for CMS data in Expo and Next.
- External CMS payloads are runtime-validated with Zod and mapped to domain models.
- Client apps own environment configuration; the shared package receives `baseUrl` explicitly.
- No custom CMS dashboard is being built in Next.

## Intentional limitations

- No mobile path detail route.
- No lesson route.
- No search, save, progress, authentication, or cache.
- No final visual system.

## Next milestone
Milestone 2 — Expo Mobile Core Journey:
Home → Explore → Learning Path Detail → Lesson Detail → Save and local progress persistence.