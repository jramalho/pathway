# Milestone 4 Review

## What was completed

- **Visual system and primitives** (M4.1): shared `@pathway/ui-tokens` consolidated, web StyleX tokens mirroring the same values, reusable primitives (buttons, cards, badges, state containers, media containers) on both surfaces.
- **Mobile polish** (M4.2–M4.3): Home, Explore, Saved, Learning Path Detail, and Lesson Detail refined against the green neo-brutalist visual direction. Contextual CTAs, lesson status indicators (icon + text, never color alone), module accordions with completion summary, lesson body parser, key takeaway, completion card with path-complete feedback, prev/next navigation.
- **Web polish** (M4.4): Homepage with real content sections, Explore with search and filters, Path page with sticky summary + curriculum + related paths, Lesson page with hero + media + TOC + article body + share + nav + related lessons. All server-rendered with ISR.
- **States and accessibility** (M4.5–M4.6): loading skeletons, error states with retry, empty/no-results/unavailable/not-found states hardened across mobile and web. ARIA roles, labels, states, touch targets, visible focus (`:focus-visible`), semantic HTML, `prefers-reduced-motion` respected.
- **Automated test** (M4.7): learning activity reducer test (13 tests) guarding save/remove lesson, mark complete/incomplete, path save, full user flow, persistence payload, and hydration — using existing `node:test` stack, no new dependencies.
- **CI** (M4.8): GitHub Actions workflow (`.github/workflows/quality.yml`) running lint, typecheck, and test on every pull request and push to main. Node 22 LTS, pnpm 11.8.0, frozen lockfile, no secrets.
- **Final review** (M4.9): token consolidation completed for profile and UI base components (app-header, tab-bar, screen, progress-bar, themed-text), overflow fix in LessonContextLink, semantic fix in LessonBodyRenderer.

## Verified flows

### Mobile
- Home loads real content from Strapi via `@pathway/api`; greeting, continue learning card, featured paths, recommended lessons, recently saved.
- Explore loads all published paths; client-side search and topic filters work; no-results state shows reset action.
- Saved shows persisted lessons and paths; segmented control switches tabs; unavailable content shows discrete notice without deleting slugs.
- Learning Path Detail loads by slug; hero with cover/metadata/progress/CTA; module accordions with lesson rows; bookmark toggle.
- Lesson Detail loads by slug; context breadcrumb, metadata tags, media preview/fallback, body renderer, key takeaway, completion card, prev/next navigation.
- Save/remove lesson and mark complete/incomplete persist via AsyncStorage; progress updates in real time.
- Bottom navigation respects safe areas; touch targets meet 44px minimum.

### Web
- Homepage renders hero + real content sections (featured paths, popular lessons, topics, practical learning); sections omitted gracefully when CMS is empty.
- Explore renders search + topic/difficulty filters + result grid; URL sync debounced; no-results state with clear-filters action.
- Path page (`/paths/[slug]`) renders hero + curriculum + sticky summary + related paths; `notFound()` for missing/unpublished.
- Lesson page (`/lessons/[slug]`) renders hero + media + TOC + article body + share + prev/next nav + parent CTA + related lessons; `notFound()` for missing/unpublished.
- 404 pages carry `noindex`; error boundary maps `toUserFacingError` with retry.
- Sitemap and robots.txt are dynamic and reflect published content.
- Keyboard navigation works; focus rings visible on all interactive elements.

### Strapi integration
- Both mobile and web consume the shared `@pathway/api` package.
- Published content from Strapi appears on both surfaces.
- Unpublished content does not appear publicly (API returns `null` for unpublished slugs → not-found).
- On-demand revalidation endpoint implemented and unit-tested; ISR (revalidate=300) is the fallback.

## Quality checks

| Check | Command | Result |
| ----- | ------- | ------ |
| Lint | `pnpm lint` | ✅ mobile + web pass |
| Typecheck | `pnpm typecheck` | ✅ api + cms + mobile + web pass |
| Test | `pnpm test` | ✅ 68 tests pass (47 API + 21 mobile) |
| Web build | `pnpm --filter @pathway/web build` | ✅ 11 static pages generated |
| Frozen lockfile | `pnpm install --frozen-lockfile` | ✅ reproducible |
| CI workflow | `.github/workflows/quality.yml` | ✅ lint + typecheck + test, no secrets |

## Known limitations

- **No authentication** — the product is a local-only demo; no sign-in, no user accounts.
- **Saved items are local** — AsyncStorage on mobile only; no cross-device sync.
- **Progress does not sync** — lesson completion is stored locally on the device.
- **Media is thumbnail/embed** — no video player pipeline; direct video URLs render a native `<video>` (web) or a play-icon affordance (mobile); external platform URLs are not embedded.
- **Search is limited** — client-side substring match across real text fields; no full-text search.
- **No E2E tests** — no Playwright, Cypress, or Detox; validation is manual + unit tests.
- **No Strapi integration test** — API tests use Zod schemas and mappers with fixture payloads, not a running Strapi.
- **No React component tests** — the reducer test guards business logic; UI is validated manually.
- **No coverage analysis** — `node:test` does not emit coverage reports.
- **Mobile lesson body links** — external `http(s)` links render as styled text on native (Expo Router rejects external URLs); `expo-web-browser` wiring is deferred.
- **Web ToC scroll-spy** — no JavaScript active-heading tracking; TOC links to real anchors but doesn't highlight the current section.
- **Dark mode** — intentionally single-mode (light); no dark theme planned for V1.
- **Deploy** — belongs to Milestone 5.

## Ready for Milestone 5

- [ ] Public web deployment (Vercel or equivalent)
- [ ] CMS demo/deployment path (Strapi hosted or seeded local demo)
- [ ] Mobile preview/demo path (Expo dev build or EAS Build for screenshots)
- [ ] Screenshots (mobile + web, key flows)
- [ ] README final (setup, architecture, demo instructions)
- [ ] Demo video (optional, short walkthrough)
- [ ] Portfolio / LinkedIn packaging (project description, links, screenshots)
