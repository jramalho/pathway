# Pathway — Delivery Milestones

> **Portfolio proof project:** CMS-driven learning platform built with Expo, Next.js, Strapi and TypeScript.  
> **Goal:** Ship one small, polished, explainable product—not a full LMS.

---

## Delivery principles

1. **Build vertical slices early.** Do not finish three separate apps and integrate later.
2. **Strapi is the source of truth.** It owns content, media, publishing state, and CMS admin.
3. **Expo owns iOS and Android.** It is the end-user learning app.
4. **Next.js owns public web.** It provides discovery, direct URLs, SEO, metadata, sharing, and long-form reading.
5. **Do not add V2 features before the previous milestone is demonstrably complete.**
6. **Every milestone must leave behind something visible, testable, or shareable.**

---

# Milestone 0 — Foundation and Seeded Content

## Goal

Create a stable monorepo, running local environments, and enough realistic CMS content to build against.

## Deliverables

- `pnpm` workspace with:
  - `apps/mobile` — Expo Router app
  - `apps/web` — Next.js App Router app
  - `apps/cms` — Strapi
  - `packages/api` — shared API client, schemas, and types
  - `packages/ui-tokens` — shared design tokens
- Base TypeScript, linting, formatting, environment variable setup.
- Strapi content types:
  - Learning Path
  - Module
  - Lesson
  - Category
  - Author
- Seed content:
  - 4 learning paths
  - 3 modules per path
  - 3–4 lessons per module
  - At least one complete published path: **React Native Performance**
- Initial architecture note in `docs/architecture.md`.

## Done when

- Expo, Next.js, and Strapi all run locally.
- Strapi exposes published content through its API.
- A seeded lesson can be opened and edited in Strapi Admin.
- The repository has a clean setup path in the README.

## Explicitly out of scope

- Authentication
- Saved items
- Final UI
- Deployment
- Analytics
- Video pipeline

---

# Milestone 1 — Shared CMS-to-Client Vertical Slice

## Goal

Prove that Strapi is the single content source used by both the mobile app and public web.

## Deliverables

- `packages/api` with:
  - fetch client
  - Zod schemas
  - response mapping for Strapi’s API shape
  - typed `LearningPath` and `Lesson` models
- Expo:
  - simple Home screen with one featured learning path card
- Next.js:
  - simple homepage
  - one path page or lesson page
- Both clients consume the same published content from Strapi.

## Demo test

1. Change a lesson or learning-path title in Strapi.
2. Refresh Expo.
3. Refresh Next.js.
4. Confirm the same content update appears in both clients.

## Done when

- There is no hardcoded production content in the mobile or web clients.
- Both applications use the shared typed API package.
- Invalid/unexpected external data is handled at the API boundary, not scattered across UI components.

## Explicitly out of scope

- Full app navigation
- Search
- Saved content
- Final SEO work
- Full visual design system

---

# Milestone 2 — Expo Mobile Core Journey

## Goal

Deliver a complete mobile experience from discovery to lesson completion and saved content.

## Screens and features

### Home

- Personalized greeting
- Continue learning card
- Featured learning paths
- Recommended lessons
- Recently saved content
- Bottom navigation: Home, Explore, Saved, Profile

### Explore

- Search input
- Topic filters: All, Mobile, Accessibility, Product, AI
- Learning path cards
- Lesson cards
- Difficulty and duration labels
- Loading, error, and empty states

### Learning Path Detail

- Cover visual
- Title, description, difficulty, duration, lesson count
- Progress indicator
- Continue learning action
- Module and lesson list
- Complete/current/upcoming lesson states
- Save learning path action

### Lesson Detail

- Back navigation
- Learning-path context
- Video thumbnail or media area
- Article/lesson content
- Key takeaway callout
- Save action
- Mark as complete
- Previous/next lesson navigation

### Saved

- Saved lessons
- Saved paths
- Lessons/Paths segmented control
- Empty state

### Persistence

- Saved content persists locally with SecureStore or AsyncStorage.
- Local lesson completion/progress persists across app restarts.

## Done when

A user can:

1. Open the app.
2. Search for “FlashList”.
3. Open the React Native Performance learning path.
4. Open “Optimizing Long Lists with FlashList”.
5. Save it.
6. Mark it complete.
7. Close and reopen the app.
8. See both saved state and progress retained.

## Explicitly out of scope

- Real account creation
- Cross-device sync
- Offline video downloads
- Push notifications
- Payments
- Complex gamification

---

# Milestone 3 — Next.js Public Web Experience

## Goal

Turn the same Strapi content into a discoverable, shareable, SEO-friendly public website.

## Pages

### Homepage

- Hero
- Featured paths
- Popular lessons
- Topic sections
- Public navigation and footer

### Explore

- Search
- Topic and difficulty filters
- Learning path and lesson results
- Empty state

### Learning Path Route

- `/paths/[slug]`
- Hero visual
- Description, difficulty, duration, lesson count
- Module list
- Related learning paths

### Lesson Route

- `/lessons/[slug]`
- Breadcrumbs
- Title, summary, author, updated date
- Video/media area
- Reading content
- Key takeaway
- Table of contents on desktop
- Related lessons
- Sharing controls

### Optional signed-in web page

- Continue learning
- Saved lessons
- Recent activity

Only implement this if it reuses enough of the mobile data model without increasing scope meaningfully.

## Technical signals

- App Router
- Dynamic routes with slugs
- Server-side content loading
- Static generation or revalidation where appropriate
- Page-level metadata
- Open Graph image support
- Canonical URLs
- Responsive behavior

## Done when

- A public lesson has a stable, direct URL.
- Its browser title and description reflect Strapi content.
- The lesson page is readable on desktop and mobile web.
- The learning path and lesson content are not duplicated manually in Next.js.

## Explicitly out of scope

- A custom CMS dashboard
- Rebuilding Strapi Admin
- Full user login
- Full-text search infrastructure

---

# Milestone 4 — Product Polish and Engineering Signals

## Goal

Make the project look intentional, complete, and credible as a senior portfolio piece.

## Visual and product polish

- Apply the refined green neo-brutalist visual system consistently.
- Use clear borders, controlled offset shadows, high contrast, and editorial readability.
- Build reusable primitives:
  - Buttons
  - Search input
  - Filter chips
  - Learning path card
  - Lesson card
  - Progress bar
  - Bookmark control
  - Difficulty badge
  - Module row
  - Empty state
  - Error state
  - Skeleton cards
- Improve mobile and web responsiveness.
- Add one restrained interaction, such as progress animation or card transition.

## Quality signals

- Accessible labels on interactive controls.
- Reasonable touch targets on mobile.
- Keyboard focus states on web.
- Color contrast checked manually.
- One meaningful automated test:
  - saving/removing a lesson; or
  - lesson completion; or
  - filtering content.
- GitHub Actions for:
  - lint
  - typecheck
  - test

## Done when

- There are no obvious broken states in the primary demo flow.
- The visual language is coherent across Expo and Next.
- The repository passes lint, typecheck, and the selected test in CI.
- You can demo the product without saying “this part is not ready yet.”

---

# Milestone 5 — Deployment and Portfolio Packaging

## Goal

Convert the codebase into something recruiters can evaluate in under one minute.

## Deliverables

- Deploy the public Next.js site.
- Deploy Strapi or provide a reliable local/demo setup path.
- Configure an Expo preview build or a credible mobile demo path.
- Final README:
  - overview
  - architecture diagram
  - stack
  - screenshots
  - setup instructions
  - technical decisions
  - known limitations
  - deployment/demo links
- Capture screenshots:
  1. Mobile Home
  2. Mobile Explore
  3. Mobile Learning Path
  4. Mobile Lesson
  5. Mobile Saved
  6. Web Homepage
  7. Web Learning Path
  8. Web Lesson
  9. Strapi publishing/editing screen
- Record a 60–90 second demo video.
- Add the project to LinkedIn Featured.

## Done when

A recruiter can answer these questions in under one minute:

1. What is Pathway?
2. Why are Expo, Next.js, and Strapi all in this project?
3. What does the mobile app do?
4. What does the website do?
5. Where does the content come from?
6. Where can I see it running?

---

# Recommended build order

| Focused time | Milestone | Visible result |
|---:|---|---|
| Day 1 | Milestone 0 | Running monorepo, CMS and seeded content |
| Day 2 | Milestone 1 | Strapi content visible in Expo and Next |
| Days 3–4 | Milestone 2 | Complete mobile discovery-to-learning flow |
| Days 5–6 | Milestone 3 | Public web pages and direct lesson URLs |
| Day 7 | Milestone 4 | Visual polish, accessibility, test and CI |
| Day 8 | Milestone 5 | Deployments, README, screenshots and demo video |

This is a suggested pace, not a requirement. Do not sacrifice completion quality to hit an arbitrary day count.

---

# Version 2 parking lot

Do not start these until Milestone 5 is finished:

- Real authentication
- Cross-device sync for saved items and progress
- Deep linking from Next.js pages into the Expo app
- EAS Build and distribution improvements
- Video/media pipeline
- Full-text search
- Analytics
- Multilingual content
- Accessibility audit automation
- Offline downloads
- Push notifications

---

# Project definition of done

Pathway is ready to showcase when:

- [ ] The core mobile journey works: discover → path → lesson → save/complete.
- [ ] Strapi supplies published content to both mobile and web.
- [ ] The public web has homepage, path, and lesson pages.
- [ ] A direct lesson URL has SEO metadata and readable layout.
- [ ] Saved content persists locally in the mobile app.
- [ ] The UI is consistently green and refined neo-brutalist.
- [ ] Loading, error, and empty states exist.
- [ ] API data is typed and runtime-validated.
- [ ] At least one valuable test and CI workflow exist.
- [ ] README, screenshots, demo, and deployment links are complete.
- [ ] Every major decision can be explained clearly in an interview.

---

# Guardrail

**Build one polished, working platform. Do not turn this into three disconnected applications or a full LMS.**
