# ADR-005 — Public Content Unavailable Policy

## Status
Accepted

## Context

The public Next.js website serves content from Strapi through the shared
`@pathway/api` package. Not every slug a visitor requests corresponds to
published content. A URL may reference a path or lesson that was never
created, has been unpublished, has been deleted, or is temporarily
unreachable because the CMS is down. The website needs a consistent,
safe, and comprehensible behavior for each of these cases — both for
human visitors and for search engines.

The question is what the website does when a public content route
(`/paths/[slug]`, `/lessons/[slug]`) cannot serve published content, and
how it distinguishes "content does not exist" from "the content source
failed."

## Decision

Public content routes use a three-state discriminator at the data layer
and map each state to a distinct user-facing outcome:

### Data layer: `status` discriminator

Every public data helper (`getPathDetailView`, `getLessonDetailView`,
`getHomepageData`, `getExploreContent`) returns a typed result with a
`status` field:

- **`"ok"`** — published content was found and validated. Render the page.
- **`"missing"`** — no published content exists for this slug. The CMS
  responded successfully, but the content is not there (never created,
  unpublished, or deleted).
- **`"error"`** — the CMS request failed (network error, timeout, 5xx,
  validation failure). The content source is unreachable or returned
  invalid data.

### Route behavior

| State | Behavior | HTTP | Indexing |
| ----- | -------- | ---- | -------- |
| `ok` | Render the page with real content | 200 | indexable |
| `missing` | Call `notFound()` → render the public 404 boundary | 404 (not-found) | `noindex` |
| `error` | Throw the error → render the root error boundary | 500 (error) | not indexed (error page) |

### 404 / not-found

- Both the root `not-found.tsx` and the `(public)/not-found.tsx`
  boundaries carry `robots: { index: false, follow: true }`.
- The 404 page is a real page with the public shell (header, footer),
  a clear "Page not found" message, and links back to home and explore.
- A 404 is never a blank screen or a raw error dump.

### Error boundary

- The root `error.tsx` is a Client Component (required by Next.js) that
  receives `reset()`.
- It maps the error to a user-facing message via `toUserFacingError` and
  `USER_FACING_MESSAGES` from `@pathway/api` — no stack traces or JSON
  shown to visitors.
- It offers "Try again" (calls `reset()`) and "Back to home".

### Homepage and Explore

- Homepage and Explore use `"ok"` / `"empty"` / `"error"` (no `"missing"`
  — these are listing pages, not slug routes).
- `"empty"` renders a graceful empty state, not a 404.
- `"error"` renders an error state within the public shell.

### Placeholder routes

- `/paths`, `/topics`, and `/signin` are placeholder routes that exist
  so header links never lead to a 404. They carry `noindex` and render
  a clear "arrives soon" message. They are not content routes and do
  not fetch from the CMS.

## Consequences

- Visitors always get a comprehensible page — never a blank screen, a
  raw JSON error, or a stack trace.
- Search engines do not index 404 or error pages (`noindex`).
- The distinction between "missing" and "error" is preserved: a missing
  slug is a 404 (content genuinely absent); a CMS failure is a 500
  (transient infrastructure issue). This avoids caching a 404 for
  content that is temporarily unreachable.
- Unpublishing or deleting content in Strapi causes the affected route
  to render 404 on the next request after revalidation (ISR or
  on-demand webhook) — the page does not serve stale published content.
- The data layer contract (`status` discriminator) is the single place
  where the decision is made; route components only interpret it.

## Related milestone
M3 — Next.js Public Web Experience
