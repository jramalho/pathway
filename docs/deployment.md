# Deployment

> **Status:** The project runs fully locally. This document defines the deployment targets, required env vars, and smoke test checklist. Deployment itself is in progress (Milestone 5.3+).

## Strategy

| Surface | Target | Status |
| ------- | ------ | ------ |
| Web (Next.js) | Vercel | Coming soon |
| CMS (Strapi) | Railway (preferred) or Render | Coming soon |
| Mobile (Expo) | Expo Go / EAS preview build | Coming soon (M5.4) |

### Why this split

- **Vercel** is zero-config for Next.js monorepos and handles ISR, on-demand revalidation, and edge proxy out of the box.
- **Railway** provides a persistent Postgres + persistent volume for Strapi uploads with minimal config and a free/hobby tier sufficient for a portfolio demo.
- **Render** is the fallback if Railway has issues — same feature set, slightly slower cold starts.
- **Local + tunnel (ngrok/Cloudflare Tunnel)** is a temporary fallback if a hosted CMS is not yet set up. The web app builds and deploys with empty/fallback states when Strapi is unreachable (see Build resilience below).

## Web deploy (Vercel)

### Vercel project settings

Configure these in the Vercel dashboard (Project → Settings). No `vercel.json` is needed — Vercel auto-detects Next.js and pnpm.

| Setting | Value |
| ------- | ----- |
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm --filter @pathway/web build` |
| Output Directory | (leave default — Next.js handles this) |
| Node.js Version | 22.x |
| Package Manager | pnpm (auto-detected from `packageManager` field) |

> **Monorepo note:** Vercel detects the pnpm workspace from the root `pnpm-workspace.yaml`. Setting Root Directory to `apps/web` tells Vercel to build only the web app while installing the full workspace (needed for `@pathway/api` and `@pathway/ui-tokens` workspace dependencies).

### Web environment variables (Vercel → Settings → Environment Variables)

| Variable | Required | Example | Notes |
| -------- | -------- | ------- | ----- |
| `STRAPI_URL` | Yes | `https://pathway-cms.up.railway.app` | Server-side only. The deployed Strapi URL. Must be reachable from Vercel. |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://pathway.vercel.app` | The deployed Vercel URL. Used for canonical URLs, OG tags, sitemap, robots. Must be a valid absolute `https://` URL — the app throws in production if missing or invalid. |
| `REVALIDATE_SECRET` | Optional | (random 32+ char string) | Server-side only. For on-demand revalidation webhook from Strapi. Generate with `openssl rand -hex 32`. When unset, the revalidation endpoint rejects all requests; ISR (5-minute) fallback still works. |

> **Important:** Do not use `SITE_URL` in production — use `NEXT_PUBLIC_SITE_URL`. The app accepts `SITE_URL` as a legacy fallback, but `NEXT_PUBLIC_SITE_URL` is the preferred variable.

### Build resilience (CMS offline)

The web build **does not hard-depend on Strapi being online**. When Strapi is unreachable at build time:

- `generateStaticParams` for `/paths/[slug]` and `/lessons/[slug]` catches fetch errors and returns `[]` — zero static pages are prerendered, but the routes still work at request time (server-rendered on demand).
- The sitemap route catches errors and serves only the static entries (`/`, `/explore`).
- The homepage renders the hero without content sections (graceful empty state).

The web API client timeout is set to 5s (below the shared package default of 12s) so that build-time fetches fail fast. Without this, a 12s timeout × 3 retries × multiple fetches exceeds Next.js's 60s static generation limit and the build fails.

**This means:** you can deploy the web app to Vercel before the CMS is deployed. The site will show empty/fallback states until `STRAPI_URL` points to a reachable Strapi instance. Once the CMS is live, update the env var and redeploy (or wait for ISR to refresh).

## CMS deploy (Strapi)

### Option A — Railway (recommended)

1. Create a new project on Railway.
2. Deploy from the GitHub repo, setting Root Directory to `apps/cms`.
3. Add a Postgres database service (Railway provisioned).
4. Add a persistent volume for uploads (mount at `/data` or configure `UPLOADS_DIR`).
5. Set all environment variables (see CMS env vars below).
6. Railway auto-detects Node.js. Build command: `pnpm --filter @pathway/cms build`. Start command: `pnpm --filter @pathway/cms start`.
7. After first deploy, create an admin account and run the seed: `pnpm --filter @pathway/cms seed:pathway` (run locally with `STRAPI_URL` pointed at the Railway URL, or via Railway's shell).
8. Configure public read permissions in Strapi Admin → Settings → Roles → Public.

### Option B — Render

Same approach as Railway. Create a Web Service from the repo, set Root Directory to `apps/cms`, add a Postgres database, and a persistent disk for uploads.

### Option C — Local + tunnel (temporary fallback)

Run Strapi locally and expose it via ngrok or Cloudflare Tunnel:

```bash
pnpm dev:cms
ngrok http 1337    # or: cloudflared tunnel --url http://localhost:1337
```

Point `STRAPI_URL` on Vercel to the tunnel URL. This is acceptable for a short demo but not stable for a portfolio link (tunnel URLs change on restart).

### Option D — Web-only deploy with empty states

Deploy the web app to Vercel with `STRAPI_URL` pointing to a placeholder or the expected future CMS URL. The site builds and serves empty/fallback states. Update the env var once the CMS is live. This is the fastest path to a live URL and is fully supported by the build.

### CMS environment variables

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `HOST` | Yes | `0.0.0.0` (bind to all interfaces) |
| `PORT` | Yes | Railway/Render assign this automatically; set to `1337` if not |
| `APP_KEYS` | Yes | Comma-separated random strings. Generate with `openssl rand -base64 32` |
| `API_TOKEN_SALT` | Yes | Random string |
| `ADMIN_JWT_SECRET` | Yes | Random string |
| `TRANSFER_TOKEN_SALT` | Yes | Random string |
| `JWT_SECRET` | Yes | Random string |
| `ENCRYPTION_KEY` | Yes | Random string |
| `DATABASE_CLIENT` | Yes | `postgres` (for Railway/Render Postgres) |
| `DATABASE_HOST` | Yes | Railway/Render Postgres host |
| `DATABASE_PORT` | Yes | `5432` |
| `DATABASE_NAME` | Yes | Railway/Render database name |
| `DATABASE_USERNAME` | Yes | Railway/Render database user |
| `DATABASE_PASSWORD` | Yes | Railway/Render database password |
| `DATABASE_SSL` | Yes | `true` (for managed Postgres) |

> **SQLite is local-only.** The local dev setup uses `better-sqlite3`. For any hosted deploy, switch to Postgres via the `DATABASE_*` env vars. Do not use SQLite in production — it does not support concurrent access and will corrupt on Railway/Render.

> **Uploads:** Local Strapi stores uploads in `public/uploads/`. On Railway/Render, mount a persistent volume for this directory. S3/Cloudinary is not configured and is out of scope for V1.

## Mobile demo (Expo)

The mobile app runs locally via **Expo Go** — no EAS build, no App Store, no Play Store. All native dependencies are Expo Go compatible. See [`docs/mobile-preview.md`](mobile-preview.md) for the full guide: prerequisites, env vars, run commands, simulator/emulator notes, physical device notes, troubleshooting, and demo checklist.

| Path | Status |
| ---- | ------ |
| Expo Go (local) | Ready — primary demo path |
| iOS Simulator / Android Emulator | Ready — fallback for screen recording |
| EAS internal distribution (Android APK) | Optional V2 — not needed for current demo |

## Smoke test checklist

Run this after the web app is deployed and `STRAPI_URL` points to a reachable Strapi:

### With CMS online

- [ ] Homepage loads (`/`) — hero + content sections with real data
- [ ] Explore loads (`/explore`) — search and filters work
- [ ] A path page loads (`/paths/react-native-performance`) — curriculum, lessons
- [ ] A lesson page loads (`/lessons/[slug]`) — article body, TOC, share
- [ ] `<title>` and `<meta name="description">` are correct on each route
- [ ] Canonical URL and OG tags point to the deployed origin (not localhost)
- [ ] `sitemap.xml` is accessible and lists real path/lesson URLs
- [ ] `robots.txt` is accessible and points to sitemap
- [ ] Invalid slug (`/paths/does-not-exist`) returns 404 with `noindex`
- [ ] No `localhost` URLs in the page source or production logs

### With CMS offline (fallback verification)

- [ ] Homepage loads with hero only (no content sections) — no crash
- [ ] Explore shows error state with retry — no crash
- [ ] Path/lesson pages show error boundary — no crash
- [ ] `sitemap.xml` serves static entries (`/`, `/explore`) only
- [ ] No `localhost` in canonical/OG URLs

### Revalidation webhook (optional)

- [ ] `POST /api/revalidate` with valid `Authorization: Bearer <secret>` and a Strapi webhook payload returns `{ "revalidated": true }`
- [ ] `POST /api/revalidate` without auth returns 401
- [ ] After a Strapi content edit + publish, the web page reflects the change within the ISR window (or immediately if the webhook is configured)

## Rollback / fallback notes

- **Web:** Vercel keeps every deployment. Roll back to any previous deploy from the Vercel dashboard (Deployments → ⋮ → Promote to Production).
- **CMS:** Railway/Render keep deploy history. Roll back from the dashboard. Database migrations are not used (Strapi manages its own schema), so rollback is safe.
- **Content loss:** If the CMS database is reset, re-run `pnpm --filter @pathway/cms seed:pathway` to restore seeded content. User-created content is lost unless the database is backed up.

## What is still "coming soon"

- [ ] Live web URL (Vercel deploy not yet executed)
- [ ] Hosted CMS URL (Railway/Render not yet provisioned)
- [ ] Expo preview build (M5.4)
- [ ] Screenshots (M5.5)
- [ ] Demo video (M5.5)
- [ ] Portfolio/LinkedIn text (M5.6)
