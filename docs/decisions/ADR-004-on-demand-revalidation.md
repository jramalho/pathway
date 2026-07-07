# ADR-004 — On-Demand Revalidation from Strapi Webhooks

## Status
Accepted

## Context

The public Next.js website uses ISR (`revalidate = 300`, 5 minutes) on all
public content routes. This keeps content fresh without hammering Strapi on
every request, but means a published content change can take up to 5 minutes
to appear on the website. For a portfolio project this is acceptable, but
predictable, immediate refresh after a Strapi publish/unpublish event is a
better content freshness story.

Strapi 5 (v5.49.0) ships built-in webhooks (Settings → Webhooks in the
admin panel) that fire HTTP POST requests on content lifecycle events. The
webhook runner sends a JSON body with `{ event, createdAt, model, uid, entry }`
and supports custom headers configured per webhook. This makes it possible
to call a Next.js route handler to invalidate the ISR cache on demand.

## Decision

Add a single secure `POST /api/revalidate` route handler in the Next.js App
Router that Strapi webhooks call to trigger `revalidatePath` for affected
public routes.

### Endpoint

- **URL:** `POST /api/revalidate`
- **Authorization:** `Authorization: Bearer <REVALIDATE_SECRET>` (custom
  header configured in Strapi Admin → Settings → Webhooks)
- **Body:** the standard Strapi webhook JSON payload
  (`{ event, createdAt, model, uid, entry }`)
- **Environment variable:** `REVALIDATE_SECRET` (server-side only, never
  exposed to the browser)

### Strapi webhook events to enable

Configure one webhook in Strapi Admin → Settings → Webhooks with the
following events:

- `entry.publish` — content published
- `entry.update` — published content edited
- `entry.unpublish` — content unpublished
- `entry.delete` — content deleted

(`entry.create` and `entry.draft-discard` are not needed — drafts are not
publicly visible and don't require cache invalidation.)

### Invalidation rules by content type

**Learning path event (`api::learning-path.learning-path`):**
- `/` (homepage — featured/recommended content)
- `/explore` (listings)
- `/paths` (listing page)
- `/paths/[slug]` (the affected path page)
- `/sitemap.xml` (slug list may have changed)

**Lesson event (`api::lesson.lesson`):**
- `/` (homepage — recommended lessons)
- `/explore` (listings)
- `/paths` (listing page)
- `/lessons/[slug]` (the affected lesson page)
- `/paths/[parentPathSlug]` (parent path page — curriculum lists lessons;
  only when the parent path slug is present in the webhook payload)
- `/sitemap.xml` (slug list may have changed)

**Unpublish/delete:** the affected route is revalidated so the next request
re-runs `generateMetadata` and the page render, which calls `notFound()` when
the content is gone — refreshing the cached page into its correct
not-found state.

### Security design

- POST-only (GET returns 405).
- Bearer token compared with `crypto.timingSafeEqual` (timing-safe).
- `REVALIDATE_SECRET` is server-side only — never prefixed with
  `NEXT_PUBLIC_`, never imported by client components.
- Payload is validated with a typed parser: only
  `api::learning-path.learning-path` and `api::lesson.lesson` UIDs are
  accepted; slugs are validated; unsupported/malformed payloads are rejected
  without invalidating any content.
- No raw error messages, secrets, or internal cache details are exposed in
  responses. Errors are logged safely server-side (route path + event name
  only — no authorization headers or full payloads).
- The endpoint does not accept arbitrary route strings — route targets are
  derived from the validated content type and slug, not from the request.

### Fallback behavior

If the webhook is not configured, misconfigured, or fails, the existing
`revalidate = 300` (5-minute ISR) on each public route still keeps content
fresh. On-demand revalidation is an optimization, not a dependency. The
website continues to work correctly without it.

### Local development note

Strapi (running on `localhost:1337`) can reach the Next.js dev server
(`localhost:3000`) directly when both run on the same machine. Configure
the webhook URL as `http://localhost:3000/api/revalidate`. If Strapi is
hosted remotely, a tunneling solution (e.g. ngrok) is needed so Strapi can
reach the local Next.js dev server — `localhost` is not directly reachable
from a hosted instance.

## Consequences

- Published content changes appear on the website within seconds of a
  Strapi publish/unpublish event instead of waiting up to 5 minutes.
- The webhook secret must be set in both Strapi (as a custom header) and
  Next.js (as `REVALIDATE_SECRET`). A mismatch silently rejects all
  webhooks — the ISR fallback covers it.
- The endpoint is scoped to Pathway content types only — it is not a
  generic "revalidate any path" endpoint.
- No external queue, cron service, database, or cache provider is added.
- No Expo/mobile code is modified.

## Related milestone
M3 — Next.js Public Web Experience (Milestone 3.6.2)
