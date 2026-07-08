# Testing and CI

## Status
Accepted

## Context

Marco 4.6 requires one meaningful automated test that guards a real product
behavior, plus a GitHub Actions workflow that validates lint, typecheck, and
tests on every pull request and push. The project had 125 existing tests
(47 API, 70 web lib, 8 mobile parser) — all pure-function tests using
Node's built-in `node:test` runner with `--experimental-strip-types`. No
Jest, Vitest, React Native Testing Library, or browser E2E tooling is
installed.

## Decision

### 1. Chosen flow — Save and remove a lesson (+ completion)

The test targets the **learning activity reducer**
(`apps/mobile/src/features/learning-activity/learning-activity.reducer.ts`),
which is the pure function that drives every local user action in the
mobile product: saving/removing lessons, saving/removing paths, marking
lessons complete/incomplete, and hydration from persisted storage.

This was chosen over rendering a component because:

- The reducer contains 100% of the business logic for save/complete — the
  UI components only dispatch actions and read state.
- It can be tested without Jest, React Native Testing Library, or any new
  dependency — the existing `node:test` + `--experimental-strip-types`
  stack works directly.
- It validates a real user flow (save → complete → unsave → incomplete)
  with deterministic assertions, not visual snapshots.
- It is the single most valuable guard for the product's local behavior.

### 2. What the test covers

- `TOGGLE_LESSON_SAVED` adds a lesson to saved items (slug record + ordered array).
- `TOGGLE_LESSON_SAVED` removes a previously saved lesson.
- `TOGGLE_LESSON_SAVED` prepends new lessons (most-recent-first ordering).
- `MARK_LESSON_COMPLETED` marks a lesson as completed.
- `MARK_LESSON_COMPLETED` is idempotent (no duplicate order entries).
- `MARK_LESSON_INCOMPLETE` removes completion.
- `MARK_LESSON_INCOMPLETE` is a no-op when not completed.
- `TOGGLE_PATH_SAVED` adds and removes a path.
- **Full flow**: save → complete → unsave (completion persists) → incomplete.
- `toPersistedPayload` serializes ordered arrays (not records) with version 1.
- `HYDRATE` restores state from a persisted payload.
- `HYDRATE_EMPTY` and `HYDRATE_ERROR` set the correct hydration + storage status.

### 3. What it deliberately does not cover

- React component rendering or accessibility tree queries (no RNTL installed).
- AsyncStorage I/O (the storage module is not exercised — the reducer is pure).
- API/Strapi integration (no network calls).
- Web Explore filtering (already covered by 70 existing web lib tests).
- Visual layout, StyleX classes, or spacing values.
- Navigation between screens.

### 4. Mock strategy

**No mocks are needed.** The reducer is a pure function with no external
dependencies — it imports only types from a sibling `.types.ts` file. The
test calls `learningActivityReducer(state, action)` directly and asserts
on the returned state. This is the strongest possible test: it exercises
the real logic with zero indirection.

### 5. Local commands before opening a pull request

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
```

- `pnpm lint` → runs `pnpm -r lint` (mobile + web).
- `pnpm typecheck` → runs `pnpm -r typecheck` (api + cms + mobile + web).
- `pnpm test` → runs API tests (47) then mobile tests (21: 8 parser + 13 reducer).

### 6. What GitHub Actions validates

`.github/workflows/quality.yml` runs on `pull_request` and `push` to `main`:

1. Checkout the repository.
2. Setup Node.js 22 (LTS — the project uses Node 26 locally, but 22 is the
   current LTS and is compatible with all workspace dependencies).
3. Enable Corepack and install pnpm 11.8.0 (matches `packageManager` in
   the root `package.json`).
4. `pnpm install --frozen-lockfile` — reproducible, no lockfile drift.
5. `pnpm lint` — lint across all workspaces.
6. `pnpm typecheck` — typecheck across all workspaces.
7. `pnpm test` — API + mobile tests.

No secrets, no Strapi, no database, no Expo account, no `continue-on-error`.

### 7. Known limitations

- **No E2E coverage** — no Playwright, Cypress, or Detox. The product's
  visual and interaction behavior is validated manually.
- **No Strapi integration test** — the API tests use Zod schemas and
  mappers with fixture payloads, not a running Strapi instance.
- **No React component tests** — the mobile app's UI components are not
  tested with React Native Testing Library. The reducer test guards the
  business logic; the UI is validated manually.
- **No web component tests** — the web app's React components are not
  tested with Testing Library. The 70 web lib tests guard pure logic
  (filters, parser, navigation, revalidation).
- **Node 22 in CI vs Node 26 locally** — the CI uses Node 22 LTS for
  stability. The project's `engines` field in `apps/cms` allows
  `>=20.0.0 <=26.x.x`, so 22 is within range.
- **No coverage analysis** — `node:test` does not emit coverage reports.
  Coverage tooling is deferred.
- **CMS lint** — `apps/cms` does not have a `lint` script (Strapi does not
  ship a linter by default). The CI lints mobile and web only.
