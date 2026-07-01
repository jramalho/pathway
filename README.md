# Pathway

A CMS-driven professional learning platform built as a portfolio proof project. Strapi manages structured content and publishing, an Expo app delivers the iOS and Android learning experience, and a Next.js website provides public discovery, SEO, and shareable lesson URLs.

## Tech stack

- **Mobile** — Expo Router (React Native) for iOS and Android
- **Web** — Next.js App Router for public discovery and SEO
- **CMS** — Strapi 5 (REST API, admin, media, publishing)
- **Shared packages** — `@pathway/api` (future API boundary), `@pathway/ui-tokens` (shared visual tokens)
- **Tooling** — pnpm workspaces, TypeScript

## Monorepo structure

```text
pathway/
├── apps/
│   ├── mobile/          # @pathway/mobile — Expo Router app (iOS + Android)
│   ├── web/             # @pathway/web — Next.js App Router public website
│   └── cms/             # @pathway/cms — Strapi 5 CMS and REST API
├── packages/
│   ├── api/             # @pathway/api — shared API boundary (future)
│   └── ui-tokens/       # @pathway/ui-tokens — shared visual tokens
├── docs/                # project brief, milestones, architecture
├── package.json         # root workspace scripts
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js 22** (LTS)
- **pnpm** (the repo pins `pnpm@11.8.0` via `packageManager`)

Install pnpm if you don't have it:

```bash
corepack enable
corepack prepare pnpm@11.8.0 --activate
```

## Running locally

From the repository root, install dependencies once:

```bash
pnpm install
```

Then run any of the three apps (each in its own terminal):

| App    | Command            | URL / notes                          |
| ------ | ------------------ | ------------------------------------ |
| Mobile | `pnpm dev:mobile`  | Expo dev server; press `i` or `a`    |
| Web    | `pnpm dev:web`     | http://localhost:3000                |
| CMS    | `pnpm dev:cms`     | http://localhost:1337 (Strapi admin)  |

The first time you start the CMS, Strapi will prompt you to create an admin account at http://localhost:1337/admin.

## Milestone 0 status

- [x] pnpm workspace with `apps/mobile`, `apps/web`, `apps/cms`, `packages/api`, `packages/ui-tokens`
- [x] Workspace package names: `@pathway/mobile`, `@pathway/web`, `@pathway/cms`, `@pathway/api`, `@pathway/ui-tokens`
- [x] Expo, Next.js, and Strapi scaffolds present and runnable
- [x] Root README with setup instructions
- [x] `docs/architecture.md` explaining the three-surface split
- [x] `.gitignore` covering root, Expo, Next.js, Strapi, SQLite, env, and build artifacts
- [ ] Strapi content types: Learning Path, Module, Lesson, Category, Author
- [ ] Seed content: 4 learning paths, 3 modules per path, 3–4 lessons per module
- [ ] At least one complete published path: **React Native Performance**
- [ ] Strapi exposes published content through its API
- [ ] A seeded lesson can be opened and edited in Strapi Admin