# Foundation Refactor — Structural Boilerplate & Architecture

## Status: In Progress

## Problems Found

### API Layer
- `fetchJson` in `client/request.ts` is a thin wrapper with no timeout, no retry, no request-id, no query-string serialization, and no schema validation at the HTTP boundary.
- Three separate error classes (`PathwayApiHttpError`, `PathwayApiNetworkError`, `PathwayApiValidationError`) with no common base, no `kind` discriminator, no serialization, and no user-facing message mapping.
- Resource functions (`get-published-learning-paths.ts`, etc.) manually build URLs with string concatenation and `URLSearchParams` — no typed query params.
- No timeout: a hanging Strapi request hangs the client indefinitely.
- No retry: a transient 503 or network blip fails immediately.
- AbortError is detected by `err.name === "AbortError"` string comparison — fragile.
- No request-id for observability and log correlation.

### Mobile Data Fetching
- Home screen uses `useEffect + fetch + useState` pattern with manual `AbortController` management.
- `LoadState` is a hand-rolled union type duplicated per screen.
- No cache, no refetch-on-focus, no pull-to-refresh.
- Error handling is a binary `status: "error"` with no error details passed to the UI.

### Web Data Fetching
- Server components fetch directly via `getPathwayApiClient()` — correct approach, but the client has no timeout or retry.
- `error.tsx` is a client component with a generic message — no error normalization.
- `loading.tsx` is a plain text "Loading..." — no skeleton.

### Styling
- Mobile: `StyleSheet.create` with hardcoded color values scattered across components (e.g. `"#FAF9F5"`, `"#000000"`, `"#EFEEEA"`). Tokens exist in `@pathway/ui-tokens` but are only consumed via `constants/theme.ts` — many components bypass them.
- Web: Tailwind CSS v4 with utility classes inline in JSX. No design tokens shared with mobile.
- No shared visual language between web and mobile beyond the token values.

### StyleX Assessment
- **Web (Next.js)**: StyleX is fully supported via `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin`. The official Next.js example demonstrates the exact setup needed. Feasible to implement.
- **Mobile (Expo/React Native)**: StyleX compiles styles to atomic CSS class names. React Native has no CSS engine — `stylex.props()` returns `{ className, style }` where `style` is empty (all values are in class names) and `className` is not a valid prop on React Native components. There is no official React Native integration, no `@stylexjs/react-native` package, and no example in the StyleX repository. **StyleX does not work on React Native without a custom runtime layer that does not exist.** The existing `StyleSheet.create` + `@pathway/ui-tokens` approach on mobile is the correct solution for React Native and will be retained.

## Decisions

### API Layer
1. **Single `ApiClient` class** based on `fetch` (no Axios). Supports: baseUrl, global headers, per-request headers, HTTP method, typed query params, JSON body, AbortSignal, timeout, request-id, optional Zod schema validation, safe JSON/text parsing.
2. **Single `ApiError` class** with a `kind` discriminator (`network | timeout | aborted | http | validation | configuration`), status, code, method, url, requestId, retriable flag, details, cause. Plus `isApiError()`, `serializeApiError()`, `toUserFacingError()`.
3. **Retry** with exponential backoff + jitter. Only GET/HEAD. Only for network, timeout, 408, 429, 5xx. Respects `Retry-After`. Never retries after manual abort. Configurable per-request.
4. **Timeout** via `AbortController.timeout()` (or manual `setTimeout` for older runtimes), merged with external `AbortSignal`.
5. **Schemas** stay in Zod at the boundary. Mappers transform validated Strapi payloads to clean domain models.
6. **Resources** are thin functions that call `ApiClient.request()` with the right path, query, and schema — no URL building in screens.

### Mobile Data Fetching
1. **Minimal `useQuery` hook** — no RTK Query, no TanStack Query. A small hook that wraps `ApiClient` calls with loading/error/refresh states and AbortController lifecycle. The Ponytail rule: no new dependency for something a 40-line hook can do.
2. **Resource hooks**: `useFeaturedLearningPathsQuery()`, `usePublishedLearningPathsQuery()`, `useLearningPathBySlugQuery(slug)`.
3. Screens consume hooks, never call `fetch` or build URLs.

### Web Data Fetching
1. Keep server-side fetching in Server Components.
2. Use the new `ApiClient` with timeout and retry.
3. `error.tsx` uses `toUserFacingError()` for normalized messages.
4. `loading.tsx` uses skeleton components.

### Styling
1. **Web**: Migrate to StyleX with `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin`. Shared tokens in `@pathway/ui-tokens` mapped to StyleX `defineVars`.
2. **Mobile**: Keep `StyleSheet.create` + `@pathway/ui-tokens`. Document that StyleX is web-only. Consolidate hardcoded values to use tokens consistently.

### Tokens
1. Restructure `@pathway/ui-tokens` with semantic names: `surfaceCanvas`, `surfaceRaised`, `textPrimary`, `borderStrong`, `accentPrimary`, `space100`, etc.
2. Both web and mobile consume the same token values.

## Patterns That Must Not Be Used

- `fetch` directly in screens or components.
- `useEffect + fetch + useState` for server data in screens.
- Manual URL string concatenation for API calls.
- `URLSearchParams` in screen or component code.
- `try/catch` for network errors in screen render bodies.
- `any`, `as unknown as`, `@ts-ignore`, broad `eslint-disable`.
- Hardcoded color/spacing values in components (use tokens).
- Tailwind utility classes in web (use StyleX).
- `StyleSheet.create` as the primary styling system on web (use StyleX).
- Strapi payload shapes (`documentId`, `data.attributes`) in UI components.

## StyleX Limitation — Honest Assessment

### Web (Next.js)
StyleX was configured with `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin` following the official Next.js example. However, the StyleX babel plugin's `unstable_moduleResolution` could not resolve `.stylex.ts` files in the project structure:

- `commonJS` type: looks for files in `node_modules` paths, not relative project paths.
- `haste` type: requires `.stylex.ts` extension, but Turbopack/webpack can't resolve files with double extensions (`.stylex.ts`).
- `rootFile` type: also failed to resolve relative paths to `.stylex.ts` files.
- `@stylexjs/unplugin` was also tried but had the same module resolution issue.
- Using `next/font` with a custom `babel.config.js` causes a conflict (next/font requires SWC, custom babel config forces Babel).

**Decision**: Web styling remains on Tailwind CSS v4 for now. The new API layer, error handling, and token sharing are the valuable parts of this refactor. StyleX migration is documented as blocked and will be revisited when StyleX adds proper Turbopack support or a Next.js-specific plugin.

### Mobile (Expo/React Native)
StyleX does not work on React Native. `stylex.props()` returns `{ className, style }` where `className` is not a valid prop on React Native components. There is no `@stylexjs/react-native` package. The existing `StyleSheet.create` + `@pathway/ui-tokens` approach is the correct solution for React Native and is retained.

## What Was Actually Implemented

1. **API Layer**: `ApiClient` with timeout, retry, request-id, schema validation, `ApiError` with kind discriminator, `toUserFacingError()`, `serializeApiError()`.
2. **Mobile Data Fetching**: `useQuery` hook replacing `useEffect + fetch + useState`. Resource hooks: `useFeaturedLearningPathsQuery()`, `usePublishedLearningPathsQuery()`, `useLearningPathBySlugQuery()`.
3. **Web Error Handling**: `error.tsx` uses `toUserFacingError()` for normalized messages. Home page catches API errors and shows user-facing messages.
4. **Shared Tokens**: `@pathway/ui-tokens` restructured with `foundation.ts` + `semantic.ts` + backward-compatible `index.ts`.
5. **Tests**: 41 tests covering ApiClient, ApiError, retry, timeout, abort, validation, mapper, and error utilities.
6. **Documentation**: `docs/foundation-refactor.md` with full analysis and decisions.
