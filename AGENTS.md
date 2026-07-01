# Pathway — Agent Operating Guide

Pathway is a CMS-driven professional learning platform. Strapi is the source of truth for structured content, media, and publishing. Expo delivers the iOS and Android learning experience. Next.js provides public discovery, SEO, shareable URLs, and long-form web reading.

## Non-negotiables

- Strapi is the source of truth for content, media, and publishing state.
- Expo owns the mobile learning product (iOS + Android).
- Next.js owns public web discovery, SEO, shareable routes, and reading pages.
- Do **not** create a custom CMS dashboard in Next.js. Strapi already ships its admin.
- Do **not** add V2 features before the active milestone is demonstrably complete.
- Do **not** duplicate content manually between mobile and web — both consume Strapi.
- Do **not** use `any`. External CMS data must be runtime-validated at the API boundary (`packages/api`).
- Prefer small, testable, unrelated-change-free diffs.

## Before implementing a task

1. Read `.project/project-state.json` to know the active milestone and project state.
2. Read the active milestone document in `docs/milestones/`.
3. Check relevant ADRs in `docs/decisions/`.
4. Inspect existing code before writing new code.
5. List the files you intend to change before editing.

## After completing a task

1. Run the relevant validations (lint, typecheck, build — see commands below).
2. Update `.project/project-state.json` if milestone status or next task changed.
3. Record an ADR in `docs/decisions/` only when there is a relevant, durable architectural decision.

## Commands

These are the real commands defined in the workspace `package.json` files. Run them from the repository root unless noted.

### Development

| Action | Command |
| ------ | ------- |
| Start CMS (Strapi) | `pnpm dev:cms` → http://localhost:1337/admin |
| Start Web (Next.js) | `pnpm dev:web` → http://localhost:3000 |
| Start Mobile (Expo) | `pnpm dev:mobile` (press `i` or `a`) |
| Start Mobile (iOS) | `pnpm dev:mobile:ios` |
| Start Mobile (Android) | `pnpm dev:mobile:android` |

### Lint

| Scope | Command |
| ----- | ------- |
| All packages with a `lint` script | `pnpm lint` |
| Mobile only | `pnpm --filter @pathway/mobile lint` |
| Web only | `pnpm --filter @pathway/web lint` |

### Typecheck

The root defines `pnpm typecheck` (`pnpm -r typecheck`), but no workspace package currently defines a `typecheck` script. Until per-package `typecheck` scripts are added, typecheck manually:

| Scope | Command |
| ----- | ------- |
| Web | `pnpm --filter @pathway/web exec tsc --noEmit` |
| Mobile | `pnpm --filter @pathway/mobile exec tsc --noEmit` |
| CMS | `pnpm --filter @pathway/cms exec tsc --noEmit` |

### Build

| Scope | Command |
| ----- | ------- |
| Web | `pnpm --filter @pathway/web build` |
| CMS | `pnpm --filter @pathway/cms build` |

### CMS seed

| Action | Command |
| ----- | ------- |
| Seed Pathway content | `pnpm --filter @pathway/cms seed:pathway` |
| Seed example content | `pnpm --filter @pathway/cms seed:example` |

See `docs/cms-seeding.md` for the full reset-and-seed workflow.

### Install

```bash
pnpm install
```
