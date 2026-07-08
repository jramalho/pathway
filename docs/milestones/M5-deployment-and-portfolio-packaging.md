# M5 — Deployment and Portfolio Packaging

## Status
Ready

## User-visible outcome

A visitor, recruiter, or reviewer can understand what Pathway is, how it works, and why it was built in less than one minute. The public web app is deployed and accessible via a URL. The mobile app can be run locally or via a preview build. The CMS demo path is documented and reproducible. The README tells the full story: architecture, stack, setup, decisions, screenshots, limitations, and next steps. The project is packaged for GitHub, LinkedIn Featured, and job applications.

## Goal

Transform Pathway from a working local project into a comprehensible portfolio piece. Deploy the web app, document the CMS and mobile demo paths, capture screenshots and a short demo video, write the final README, and package the project for presentation — without changing product scope or adding features.

## In scope

- Deploy the Next.js public web app (Vercel or equivalent).
- Document and verify the Strapi CMS demo path (deployed or reliable local setup).
- Document and verify the Expo mobile demo path (preview build, Expo Go, or video demo).
- Write the final README (overview, architecture, stack, setup, decisions, screenshots, links, limitations, next steps).
- Create an architecture diagram.
- Capture screenshots of key mobile and web screens.
- Record a 60–90 second demo video.
- Write portfolio text for GitHub, LinkedIn Featured, and job applications.
- Compile an honest list of V1 limitations.
- Migrate `middleware.ts` to `proxy.ts` (Next.js 16 deprecation).

## Explicitly out of scope

- New product features.
- V2 functionality.
- Real authentication.
- Cross-device sync.
- Payments.
- Advanced analytics.
- Additional redesign or visual rework.
- Large refactors.
- Promises of scale or unproven metrics.
- Publishing an Expo build to App Store or Play Store.
- Changing LinkedIn profile content (only preparing Featured text).

## Existing dependencies from M1, M2, M3 and M4

- `@pathway/ui-tokens` — shared visual tokens (color, spacing, typography, borders, shadows, radii, icons, touch targets).
- `@pathway/api` — shared typed API boundary with Zod schemas, Strapi mappers, and domain models.
- `apps/cms` — Strapi CMS with seed script (`pnpm --filter @pathway/cms seed:pathway`).
- `apps/mobile` — Expo app with Home, Explore, Saved, Profile, Path Detail, Lesson Detail.
- `apps/web` — Next.js app with Homepage, Explore, Path, Lesson, sitemap, robots, revalidation webhook.
- `.github/workflows/quality.yml` — CI for lint, typecheck, test.
- `docs/decisions/` — 6 ADRs + 3 decision docs (visual-system, accessibility-and-states, testing-and-ci).
- `docs/architecture.md` — three-surface split documentation.
- `docs/cms-seeding.md` — reset-and-seed workflow.

## Relevant invariants

- `architecture.content-source` — Strapi is the source of truth for content, media, and publishing.
- `architecture.surface-ownership` — Expo owns mobile, Next.js owns public web.
- `architecture.no-custom-cms` — no CMS admin in Next.js.
- `quality.external-data` — runtime validation at the API boundary.
- `scope.v1` — no V2 features.

## Release readiness checklist

- [ ] `middleware.ts` migrated to `proxy.ts` (Next.js 16 deprecation)
- [ ] Web build passes with production env vars (`STRAPI_URL`, `NEXT_PUBLIC_SITE_URL`)
- [ ] Web deploy succeeds on Vercel (or equivalent)
- [ ] Deployed web app loads homepage with real content from a reachable Strapi
- [ ] Deployed web app loads a path page and a lesson page
- [ ] Deployed web app shows 404 for invalid slug
- [ ] Sitemap.xml and robots.txt accessible on deployed URL
- [ ] Strapi CMS demo path documented (deployed or local setup guide)
- [ ] Expo mobile demo path documented (Expo Go, preview build, or video)
- [ ] README final written (overview, architecture, stack, setup, decisions, screenshots, links, limitations, next steps)
- [ ] Architecture diagram created
- [ ] Screenshots captured (mobile + web, key screens)
- [ ] Demo video recorded (60–90 seconds)
- [ ] Portfolio text written (GitHub, LinkedIn Featured, job applications)
- [ ] V1 limitations list compiled
- [ ] All links checked (README, portfolio text, deployed URLs)
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm --filter @pathway/web build` passes

## Deployment strategy

### Next.js (Web)

**Platform:** Vercel (preferred — zero-config Next.js deployment).

**Steps:**
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the root directory to `apps/web` (or configure monorepo detection).
4. Set environment variables:
   - `STRAPI_URL` — the Strapi CMS base URL (must be reachable from Vercel).
   - `NEXT_PUBLIC_SITE_URL` — the deployed Vercel URL (e.g. `https://pathway.vercel.app`).
   - `REVALIDATE_SECRET` — optional, for on-demand revalidation webhook.
5. Build command: `pnpm --filter @pathway/web build` (or let Vercel auto-detect).
6. Deploy.

**Key constraint:** The deployed web app requires a reachable Strapi instance. If Strapi is local-only, the deployed web app will show empty/error states. Options:
- Deploy Strapi (e.g. on Railway, Render, or a VPS) and point `STRAPI_URL` to it.
- Use a local Strapi with a tunnel (ngrok, Cloudflare Tunnel) for demo purposes.
- Accept that the deployed web app shows empty states without a running CMS and document this honestly.

**Fallback:** If deploying Strapi is too complex, the web app can be demoed locally with `pnpm dev:cms` + `pnpm dev:web`. The README should document both paths.

### Strapi (CMS)

**Option A — Deployed Strapi (preferred for live demo):**
- Deploy on Railway, Render, or a VPS.
- Set all Strapi environment variables (APP_KEYS, JWT_SECRET, etc.).
- Run `pnpm --filter @pathway/cms seed:pathway` after first deploy to create content.
- Configure public read permissions for learning-path, module, lesson, category, author.
- Point web `STRAPI_URL` and mobile `EXPO_PUBLIC_STRAPI_URL` to the deployed URL.

**Option B — Local Strapi (reliable, documented):**
- `pnpm dev:cms` → http://localhost:1337/admin
- `pnpm --filter @pathway/cms seed:pathway` to seed content.
- Document the setup in the README with clear steps.
- Use a tunnel (ngrok) if the deployed web app needs to reach local Strapi.

**Recommendation:** Deploy Strapi on Railway or Render for the live demo. If time-constrained, document the local setup thoroughly and use a tunnel for the deployed web app.

### Expo (Mobile)

**Option A — Expo Go (if compatible):**
- `pnpm dev:mobile` → scan QR code with Expo Go.
- Verify that all native modules (expo-symbols, expo-image, expo-symbols) are compatible with Expo Go.
- If incompatible, fall back to Option B.

**Option B — Development Build / EAS Build:**
- `npx eas build --profile preview --platform ios` to create a preview build.
- Install on a device or simulator via TestFlight or ad-hoc distribution.
- This is the most reliable path for screenshots and demo video.

**Option C — Video demo (fallback):**
- Record a screen capture of the iOS Simulator running `pnpm dev:mobile:ios`.
- This avoids build distribution complexity and is sufficient for a portfolio piece.

**Recommendation:** Try Expo Go first. If incompatible, record a simulator video. EAS Build is the most polished but may be overkill for a portfolio project.

## Demo paths

### Mobile demo flow (60 seconds)

1. Open Home — greeting, continue learning, featured paths.
2. Tap Explore — search "FlashList" — see results.
3. Tap React Native Performance path — see modules and lessons.
4. Tap Optimizing Long Lists with FlashList lesson — read content.
5. Tap bookmark — lesson saved.
6. Tap "Mark as complete" — completion card appears.
7. Go to Saved tab — see the saved lesson.
8. Go to Profile tab — see completed lesson and saved item.
9. (Optional) Restart app — verify persistence.

### Web demo flow (30 seconds)

1. Open homepage — hero, featured paths, popular lessons, topics.
2. Click a featured path — path page with curriculum.
3. Click a lesson — lesson page with article body, TOC, share.
4. Reload the URL — page loads (SSG/ISR).
5. Try an invalid slug — 404 page.

### Strapi demo flow (15 seconds)

1. Open Strapi admin — Content Manager.
2. Show learning paths and lessons.
3. Edit a lesson title — save — publish.
4. (Optional) Show the webhook triggering revalidation on web.

## README requirements

The final README must include:

1. **Overview** — what Pathway is, why it was built, who it's for.
2. **Architecture** — three-surface split (Strapi CMS, Expo mobile, Next.js web), shared API boundary, diagram.
3. **Stack** — TypeScript, pnpm workspace, Expo, Next.js, Strapi, StyleX, Zod, node:test, GitHub Actions.
4. **Project structure** — monorepo layout (apps/mobile, apps/web, apps/cms, packages/api, packages/ui-tokens).
5. **Local setup** — prerequisites, install, env vars, seed, run commands for each surface.
6. **Technical decisions** — summary of ADRs (content source of truth, shared API, local persistence, revalidation, unavailable policy, route convention, visual system, accessibility, testing).
7. **Screenshots** — mobile and web key screens.
8. **Demo links** — deployed web URL, Expo demo instructions, Strapi demo instructions.
9. **Known limitations** — honest list of V1 constraints.
10. **Next steps** — honest, non-committal future directions (V2 ideas, not promises).

## Screenshot plan

| Screen | Surface | Notes |
| ------ | ------- | ----- |
| Mobile Home | Expo | Greeting, continue learning, featured paths |
| Mobile Explore | Expo | Search "FlashList" with results |
| Mobile Learning Path | Expo | React Native Performance with modules expanded |
| Mobile Lesson | Expo | Optimizing Long Lists with FlashList, body content |
| Mobile Saved | Expo | Saved lesson card, segmented control |
| Web Homepage | Next.js | Hero, featured paths, popular lessons, topics |
| Web Learning Path | Next.js | React Native Performance, curriculum, sticky summary |
| Web Lesson | Next.js | Optimizing Long Lists with FlashList, TOC, article body |
| Strapi Admin | CMS | Content Manager showing learning paths |
| Architecture | Diagram | Three-surface split with data flow |

## Demo video plan

**Duration:** 60–90 seconds.

**Script:**
1. (0–10s) "Pathway is a CMS-driven professional learning platform. Strapi is the content source of truth, Expo delivers the mobile experience, and Next.js provides public web discovery and reading."
2. (10–25s) Show mobile: Home → Explore → search "FlashList" → open path → open lesson → save → mark complete.
3. (25–40s) Show web: Homepage → click path → click lesson → reload URL → show it works.
4. (40–50s) Show Strapi: admin → edit a lesson → save → publish → show it appears on web.
5. (50–60s) Show architecture diagram. "Shared API boundary with Zod validation. Local persistence with AsyncStorage. ISR with on-demand revalidation. CI for lint, typecheck, and tests."
6. (60–90s) "Built with TypeScript, Expo, Next.js, Strapi, StyleX, and pnpm workspaces. All content from Strapi, no hardcoded data, runtime-validated at the API boundary."

**Recording:** Screen capture iOS Simulator + browser + Strapi admin. Edit in iMovie or similar. Export at 1080p.

## Portfolio and LinkedIn packaging

### GitHub repo description

```
Pathway — A CMS-driven professional learning platform. Strapi content source of truth, Expo mobile learning experience, Next.js public web with ISR and SEO. Shared typed API boundary with Zod validation. Green neo-brutalist design system. TypeScript, pnpm monorepo.
```

### LinkedIn Featured text

```
Pathway — a portfolio project demonstrating a full-stack monorepo architecture:

• Strapi CMS as the single content source of truth
• Expo (React Native) mobile app with local persistence (AsyncStorage)
• Next.js public web with ISR, sitemap, robots, OG metadata, and on-demand revalidation
• Shared typed API boundary (@pathway/api) with Zod runtime validation
• Green neo-brutalist design system with shared tokens (@pathway/ui-tokens)
• GitHub Actions CI for lint, typecheck, and tests
• 68 automated tests (API schemas/mappers + mobile reducer + web lib logic)

Built with TypeScript, pnpm workspaces, Expo, Next.js, Strapi, StyleX, and node:test.

🔗 [deployed web URL]
📱 Mobile: run locally with Expo (instructions in README)
📝 Content: Strapi CMS with seeded learning paths and lessons
```

### Job application text

```
I built Pathway, a CMS-driven learning platform monorepo, to demonstrate my approach to full-stack architecture: a shared typed API boundary with runtime Zod validation, a three-surface split (Strapi CMS, Expo mobile, Next.js web), local persistence with AsyncStorage, ISR with on-demand revalidation, a consistent design system with shared tokens, and CI for lint/typecheck/tests. The codebase has no `any` types, no hardcoded content, and 68 automated tests.
```

## Validation checklist

- [ ] `middleware.ts` migrated to `proxy.ts`
- [ ] Web deployed and accessible
- [ ] Strapi demo path documented and verified
- [ ] Expo demo path documented and verified
- [ ] README written with all required sections
- [ ] Architecture diagram created
- [ ] All screenshots captured
- [ ] Demo video recorded
- [ ] Portfolio text written (GitHub, LinkedIn, applications)
- [ ] V1 limitations list compiled
- [ ] All links checked
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm --filter @pathway/web build` passes

## Expected areas of change

| Area | Path | Purpose |
| ---- | ---- | ------- |
| Middleware | `apps/web/src/middleware.ts` → `proxy.ts` | Migrate deprecated Next.js 16 convention |
| README | `README.md` | Final portfolio README |
| Architecture | `docs/architecture.md` or new diagram | Visual architecture diagram |
| CI | `.github/workflows/quality.yml` | Optionally add web build step |
| Env docs | `.env.example` files | Document production env vars |

## Progress checklist

- [ ] Slice 1: Audit env/config/deploy readiness
- [ ] Slice 2: Deploy or document reproducible Next.js path
- [ ] Slice 3: Deploy or document reproducible Strapi path
- [ ] Slice 4: Document Expo demo path
- [ ] Slice 5: Write final README
- [ ] Slice 6: Create architecture diagram
- [ ] Slice 7: Capture screenshots
- [ ] Slice 8: Write and record demo video script
- [ ] Slice 9: Review links and setup
- [ ] Slice 10: Package for GitHub/LinkedIn/applications

## Evidence

_To be filled as slices are completed._

## Project completion handoff

When M5 is complete:
- The public web app is deployed and accessible via a URL.
- The CMS demo path is documented (deployed or local).
- The mobile demo path is documented (Expo Go, preview build, or video).
- The README tells the full story in under 2 minutes of reading.
- Screenshots and a demo video exist.
- Portfolio text is ready for GitHub, LinkedIn, and applications.
- V1 limitations are honestly documented.
- The project is a comprehensible portfolio piece.
