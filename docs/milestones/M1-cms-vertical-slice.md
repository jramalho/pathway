# Milestone 1 — Shared CMS-to-Client Vertical Slice

> **Status:** Ready
> **Active milestone:** Yes

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

- [ ] A published title changed in Strapi appears in Expo after refresh.
- [ ] A published title changed in Strapi appears in Next.js after refresh.
- [ ] Both clients consume the shared `@pathway/api` package.
- [ ] External CMS data is validated at the API boundary (Zod schemas, no `any`).
- [ ] No production content is hardcoded independently in mobile or web.

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

- [ ] Add Zod and fetch dependencies to `packages/api`
- [ ] Implement fetch client for Strapi REST API
- [ ] Define Zod schemas for Strapi learning-path and lesson responses
- [ ] Implement Strapi response mappers
- [ ] Define typed domain models for Learning Path and Lesson
- [ ] Export public API from `packages/api/src/index.ts`
- [ ] Wire `@pathway/api` into Expo
- [ ] Create Expo screen consuming a published learning path
- [ ] Wire `@pathway/api` into Next.js
- [ ] Create Next.js page consuming the same published content
- [ ] Add required env variables for Strapi URL

## Validation checklist

- [ ] `pnpm lint` passes
- [ ] `pnpm --filter @pathway/web exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/mobile exec tsc --noEmit` passes
- [ ] `pnpm --filter @pathway/web build` passes
- [ ] No `any` types introduced
- [ ] Manual demo sequence passes end-to-end

## Evidence

_To be filled when the milestone is closed._

- [ ] Screenshot or recording of Expo showing updated title
- [ ] Screenshot or recording of Next.js showing updated title
- [ ] Confirmation that both clients use `@pathway/api`
- [ ] Confirmation that no production content is hardcoded
