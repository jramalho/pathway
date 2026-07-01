# ADR-001 — Strapi as Content Source of Truth

## Status
Accepted

## Context

Pathway is a CMS-driven learning platform with three surfaces: a Strapi CMS, an Expo mobile app, and a Next.js public website. Content (learning paths, modules, lessons, categories, authors), media, and publishing state must have a single owner to avoid duplication, drift, and inconsistency across surfaces.

Without a single content source, mobile and web would each need their own content storage, leading to duplicated data, manual sync, and unclear ownership of publishing state.

## Decision

Strapi is the single source of truth for structured content, media, and publishing state.

- Strapi owns content administration (CRUD for learning paths, modules, lessons, categories, authors).
- Strapi owns media management (cover images, author avatars, lesson media).
- Strapi owns publishing state (draft/published, `publishedAt`).
- Expo and Next.js consume only published content from Strapi's REST API.
- Next.js does not recreate CMS admin or content CRUD.

## Consequences

- Both clients remain consumers of published content; they do not own or mutate content.
- Content changes happen in Strapi and propagate to both clients through the shared API package.
- There is no custom CMS dashboard in Next.js; Strapi's admin UI is the only content management surface.
- Clients must handle cases where content is unpublished or not yet available.

## Related milestone
M0 — Foundation and Seeded Content
