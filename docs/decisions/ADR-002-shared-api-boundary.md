# ADR-002 — Shared Typed API Boundary

## Status
Accepted

## Context

Both Expo and Next.js need to consume published content from Strapi. Strapi's REST API returns a specific JSON shape with metadata wrappers, relation stubs, and field naming conventions that are not the domain model the clients want to work with.

If each client fetches and interprets Strapi responses directly inside components, the same parsing and validation logic is duplicated in two places. Changes to the Strapi response shape (field renames, new metadata, relation population changes) would require updates scattered across mobile and web components. There is also no runtime validation of external data, making it easy for unexpected CMS payloads to cause silent runtime errors in the UI.

## Decision

`packages/api` (`@pathway/api`) is the single shared API boundary between Strapi and both clients.

- `packages/api` owns the fetch client for Strapi's REST API.
- `packages/api` owns Zod schemas that validate Strapi responses at runtime.
- `packages/api` owns mappers that transform Strapi response shapes into typed domain models.
- `packages/api` owns the typed domain models (e.g., `LearningPath`, `Lesson`) consumed by both clients.
- Expo and Next.js must not parse or interpret raw Strapi formats directly inside components. They consume the typed models exported by `@pathway/api`.

## Consequences

- Changes to Strapi's response payload are isolated in `packages/api` mappers and schemas; clients are shielded.
- Runtime validation of external data happens once at the boundary, not in every component.
- Both clients share the same types and validation logic, reducing drift.
- Adding a new content type requires work in `packages/api` before clients can consume it.

## Related milestone
M1 — Shared CMS-to-Client Vertical Slice
