# Pathway — Project Brief

> **Portfolio proof project for a Senior React Native / Expo / React / Next.js engineer**
>
> **Status:** Canonical project scope
> **Version:** 1.0

---

## 1. Project in one sentence

**Pathway is a CMS-driven professional learning platform where Strapi manages structured content, an Expo app delivers the iOS and Android experience, and a Next.js website provides fast, public, SEO-friendly learning pages.**

The project is not meant to imitate a real startup or become a full LMS. It is a polished, production-minded proof project that demonstrates cross-platform product delivery, content architecture, CMS integration, public web delivery, and clear engineering decisions.

---

## 2. Why this project exists

This is the main portfolio project, built instead of several unfinished demos.

It should make the following message obvious to recruiters and hiring managers:

> Jonathan can build a content-driven product across mobile and web, connect it to a CMS, make sensible architecture decisions, and ship a coherent experience instead of isolated screens.

The domain is intentionally close to prior professional experience: learning products, content systems, lesson flows, mobile delivery, dashboards/web surfaces, CMS workflows, and media-driven products.

---

## 3. Target roles

This project is designed to strengthen applications for:

- Senior React Native Engineer
- Expo / React Native Engineer
- Mobile Full-Stack Engineer
- Product Engineer
- Senior Frontend Engineer with React + mobile experience
- Startup engineer roles
- Content, education, SaaS, media, marketplace, and platform teams

It is less relevant for strictly native-only Android/iOS roles or backend-heavy roles.

---

## 4. Product concept

### Product name

**Pathway**

### Product positioning

A professional learning platform for short, structured technical lessons aimed at mobile engineers, product builders, and technical teams.

### Core content areas

- React Native Performance
- Production Mobile Engineering
- Accessible Product Design
- AI Tools for Product Teams

### Example learning content

**Learning paths**

- React Native Performance
- Production Mobile Engineering
- Accessible Product Design
- AI Tools for Product Teams

**Lessons**

- Understanding React Native Re-renders
- Optimizing Long Lists with FlashList
- Building Safe Refresh Token Flows
- Profiling Slow Mobile Screens
- Accessible Touch Targets
- Focus Management on Web
- Feature Flags and Release Safety
- Getting Started with Fabric and TurboModules

The content should use topics Jonathan can explain naturally in an interview. It should not be fake generic copy about random business topics.

---

## 5. Product architecture

```text
                         ┌─────────────────────────┐
                         │         Strapi          │
                         │ CMS Admin + REST API    │
                         │                         │
                         │ content, media, paths,  │
                         │ lessons, authors, tags, │
                         │ draft/published state   │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
         ┌───────────────────────┐          ┌───────────────────────┐
         │      Expo Mobile      │          │      Next.js Web      │
         │ iOS + Android product │          │ public discovery + SEO│
         │                       │          │                       │
         │ browse, learn, save,  │          │ landing pages, paths, │
         │ track progress        │          │ lessons, sharing      │
         └───────────────────────┘          └───────────────────────┘
```

### Why this split is intentional

- **Strapi** is the CMS, content admin, media manager, publishing workflow, and API source of truth.
- **Expo** is the native end-user product for iOS and Android.
- **Next.js** is the public web product for discovery, direct lesson URLs, SEO, metadata, sharing, and larger reading layouts.

### Important non-decision

There is **no custom Next.js CMS dashboard** in the core scope.

Strapi already provides an admin UI. Rebuilding content CRUD, media upload, or a basic publishing panel in Next.js would duplicate the CMS and weaken the architecture story.

A separate web operations dashboard would only make sense later if it served a genuinely different need, such as analytics, support operations, client reporting, or external data aggregation.

---

## 6. Monorepo structure

```text
pathway/
├── apps/
│   ├── mobile/                 # Expo Router — iOS and Android app
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   ├── assets/
│   │   ├── app.json
│   │   └── eas.json
│   │
│   ├── web/                    # Next.js App Router — public web experience
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── public/
│   │
│   └── cms/                    # Strapi — CMS/admin/API
│       ├── config/
│       └── src/
│
├── packages/
│   ├── api/                    # API client, Zod schemas, shared API types
│   ├── ui-tokens/              # spacing, typography, colors, component tokens
│   └── config/                 # shared TypeScript / lint configuration if useful
│
├── docs/
│   ├── architecture.md
│   ├── demo-script.md
│   ├── screenshots/
│   └── decisions.md
│
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json                  # optional: only add if it helps rather than for show
```

### Principle

Use a monorepo because it supports shared contracts and deliberate system design, not merely because it looks senior. Keep shared code limited to things that genuinely belong together.

---

## 7. Content model

Keep the content model structured enough to demonstrate real CMS relationships, but small enough to finish.

### Core types

```text
LearningPath
  ├── title
  ├── slug
  ├── description
  ├── coverImage
  ├── difficulty
  ├── estimatedDuration
  ├── featured
  ├── status
  ├── modules[]
  └── tags[]

Module
  ├── title
  ├── description
  ├── order
  └── lessons[]

Lesson
  ├── title
  ├── slug
  ├── summary
  ├── body
  ├── coverImage
  ├── videoUrl or videoThumbnail
  ├── estimatedDuration
  ├── difficulty
  ├── status
  ├── publishedAt
  ├── author
  ├── tags[]
  └── learningPath

Category
  ├── name
  └── slug

Author
  ├── name
  ├── avatar
  └── shortBio
```

### Publishing model

Use Strapi draft/publish behavior or an explicit content status. The public apps should only show published content.

Suggested states:

- Draft
- Review
- Published

The project can visually demonstrate this through seeded content. Do not build a custom workflow engine.

---

## 8. Core user journeys

### Journey 1 — Discover and start learning

1. User opens the mobile app or public website.
2. User sees featured learning paths and lessons.
3. User opens a learning path.
4. User sees modules, lessons, duration, level, and current progress.
5. User starts or resumes a lesson.

### Journey 2 — Consume a lesson

1. User opens a lesson.
2. User watches a short video area or sees a media thumbnail.
3. User reads structured content.
4. User sees key takeaways.
5. User marks the lesson as complete.
6. User moves to the next lesson.

### Journey 3 — Save content for later

1. User saves a learning path or lesson.
2. Saved state persists locally in the Expo app.
3. User can view saved lessons and paths in a dedicated screen.
4. User can remove items from saved content.

### Journey 4 — Public discovery and sharing

1. An editor publishes content in Strapi.
2. The public Next.js website renders a learning path or lesson at a stable URL.
3. The page has title, description, Open Graph metadata, and readable layout.
4. The page can be shared through LinkedIn, WhatsApp, or direct links.

---

## 9. Mobile app scope — Expo Router

### Core screens

1. **Home**
   - Personalized greeting
   - Continue learning card
   - Featured learning paths
   - Recommended lessons
   - Recently saved content
   - Bottom tabs: Home, Explore, Saved, Profile

2. **Explore**
   - Search input
   - Topic filters: All, Mobile, Accessibility, Product, AI
   - Learning path cards
   - Lesson cards
   - Difficulty and duration labels
   - Bookmark/save action
   - Loading, error, and no-results states

3. **Learning Path Detail**
   - Cover visual
   - Title, description, level, duration, lesson count
   - Progress indicator
   - Continue learning action
   - Modules with lesson states: complete, current, upcoming
   - Save learning path action

4. **Lesson Detail**
   - Back navigation
   - Learning path context
   - Lesson title and metadata
   - Video area or thumbnail
   - Reading body
   - Key takeaway callout
   - Save action
   - Mark as complete action
   - Previous/next lesson controls
   - Learning path progress

5. **Saved**
   - Saved lessons
   - Saved learning paths
   - Filter or segmented control: Lessons / Paths
   - Empty state

6. **Profile**
   - User header
   - Current paths
   - Completed lessons
   - Simple activity summary
   - Preferences
   - Sign out mock or action

7. **System states**
   - Skeleton loading
   - Content unavailable
   - No results
   - Empty saved content
   - Basic network/error recovery action

### Mobile technical signals to include

- Expo Router file-based navigation
- TypeScript with no `any`
- Typed API client
- Runtime validation using Zod
- Query caching and refetch behavior using RTK Query or TanStack Query
- Saved items persisted using SecureStore or AsyncStorage
- Accessible labels and viable touch targets
- Deliberate loading, empty, and error states

---

## 10. Public web scope — Next.js App Router

### Core pages

1. **Homepage**
   - Navigation: Pathway logo, Explore, Learning Paths, Topics, Sign in
   - Headline: “Build sharper product and engineering skills.”
   - Supporting copy: “Short, structured learning paths for mobile engineers, product builders, and modern technical teams.”
   - Primary CTA: Explore learning paths
   - Secondary CTA: Continue learning
   - Featured paths
   - Popular lessons
   - Topic sections
   - “Built for practical learning” section
   - Footer

2. **Explore page**
   - Search
   - Topic and difficulty filters
   - Learning paths grid
   - Lessons grid/list
   - Result count
   - Empty state

3. **Learning path page**
   - Hero visual
   - Path description
   - Difficulty, duration, lesson count
   - Main CTA
   - Structured module list
   - Sidebar or sticky summary
   - Related learning paths

4. **Lesson article page**
   - Breadcrumbs
   - Title and summary
   - Author and updated metadata
   - Video/media area
   - Reading content
   - Key takeaway
   - Desktop table of contents
   - Related lessons
   - CTA to continue the learning path
   - Sharing controls
   - SEO metadata and Open Graph image support

5. **Signed-in learning page**
   - Continue learning
   - Saved lessons
   - Recent activity
   - Learning path progress

### Web technical signals to include

- Next.js App Router
- Public dynamic routes with slugs
- Static generation or revalidation where appropriate
- Search metadata, Open Graph tags, and canonical URLs
- Server/client separation that is explainable
- Responsive layouts for desktop and mobile web
- CMS content loaded from Strapi

---

## 11. Design direction

### Design style

**Refined green neo-brutalism.**

The product should feel bold and memorable without becoming visually chaotic or childish.

### Visual principles

- Deep forest green / dark green foundation
- Warm off-white and pale neutral content surfaces
- Emerald, acid-green, or mint accent colors used with restraint
- Strong dark borders around cards, buttons, input fields, and chips
- Subtle offset shadows rather than soft floating shadows
- Clear block-based composition
- Large confident headings
- Strong grid and information hierarchy
- Rounded corners used sparingly, not overly soft or pill-heavy
- High contrast and accessible legibility
- Editorial reading layouts for long-form web lessons

### Avoid

- Glassmorphism
- Excessive gradients
- Blurry visuals
- Cartoon illustrations
- Generic SaaS landing-page aesthetic
- Crypto or fake AI visual language
- Overly playful gamification
- Decorative clutter that undermines usability

### Design goal

It should look like a real, visually distinct product built by an engineer with a strong product sensibility, not a generic UI kit demo.

---

## 12. Component system

Create a compact shared visual language, even if the actual UI code is not fully shared between React Native and Next.

### Components to design and implement

- Primary button
- Secondary button
- Ghost button
- Search input
- Filter chips
- Learning path card
- Lesson card
- Progress bar
- Bookmark/saved control
- Difficulty badge
- Duration label
- Module row
- Callout/key takeaway block
- Skeleton loading card
- Empty state
- Error state
- Mobile bottom navigation
- Web top navigation

### Token categories

- Color
- Typography
- Spacing
- Radius
- Border width
- Shadow offset
- Icon size
- Touch target size

Do not force a universal UI component package unless it actually speeds up delivery. Shared tokens and API contracts are enough for the first version.

---

## 13. Technical architecture decisions

### Expo Router

Use Expo Router for the mobile application because it provides a clear file-based navigation model and supports a modern Expo workflow for iOS and Android.

### Next.js

Use Next.js for the public web surface because the project needs SEO-friendly lesson pages, discoverable routes, shareable URLs, metadata, and larger content-reading layouts.

### Strapi

Use Strapi as the content source of truth, CMS admin, media manager, publication system, and REST API. Do not rebuild its admin functions elsewhere.

### API contracts

Use a shared API package containing:

- Fetch client
- Zod schemas
- Parsed API response types
- Mappers for Strapi response shape if needed
- Query key helpers if applicable

Avoid `any`. Validate external CMS data at the application boundary.

### Data fetching

Use one consistent approach in each client. A valid choice is:

- Expo: RTK Query or TanStack Query
- Next: server-side data loading for public pages plus client interaction only where necessary

The project should show loading, error, empty, and refresh states.

### Saved items

For the first version, saved items can be local-only in the mobile app. Do not add backend accounts or sync unless it is a deliberately scoped follow-up feature.

---

## 14. Non-goals for version 1

Do **not** build these unless they are explicitly added after the core is complete:

- Payments or paid course access
- Full authentication system
- Complex role-based permissions
- Rich-text editor built from scratch
- Custom CMS/admin dashboard
- Course authoring workflow outside Strapi
- Live streaming
- DRM video integration
- Full offline video downloads
- Push notifications
- Complex achievements, leaderboards, or gamification
- Full analytics pipeline
- Multi-tenant organizations
- A giant design system

The project wins by being complete, coherent, and easy to explain—not feature-heavy.

---

## 15. Delivery plan

### Milestone 0 — Foundation

- Create pnpm monorepo
- Add Expo mobile app, Next.js web app, and Strapi CMS
- Configure TypeScript, linting, formatting, and environment handling
- Add seed content to Strapi
- Write initial architecture note

**Done when:** all three apps run locally and seed content can be retrieved through an API endpoint.

### Milestone 1 — Shared API contract

- Create typed API client
- Add Zod schemas and response mapping
- Fetch published learning paths and lessons
- Confirm both Expo and Next consume the same content source

**Done when:** a changed title in Strapi appears in both mobile and web clients.

### Milestone 2 — Expo core journey

- Home
- Explore
- Learning path detail
- Lesson detail
- Saved content persistence
- Loading, error, and empty states

**Done when:** user can discover, open, save, complete, and resume content inside the mobile app.

### Milestone 3 — Next.js public web

- Homepage
- Explore page
- Path detail route
- Lesson article route
- SEO metadata
- Responsive layouts

**Done when:** a public lesson has a clean direct URL with metadata and readable content layout.

### Milestone 4 — Visual polish and proof

- Apply refined green neo-brutalist design system
- Improve responsive behavior
- Add one meaningful test
- Add CI for lint, typecheck, and tests
- Capture screenshots
- Record demo video
- Finish README

**Done when:** project is public, visually consistent, deployable, and understandable in under a minute.

---

## 16. AI-assisted implementation rules

Use AI for speed, but retain ownership of every architectural decision.

### Use AI for

- Boilerplate and scaffolding
- Screen components
- Strapi schemas and seed generation
- Type definitions
- API adapters
- Test scaffolding
- CSS/styling iteration
- README drafts
- CI setup
- Bug investigation

### Do not outsource blindly

- Product scope
- Folder boundaries
- Architecture decisions
- State ownership
- API contract decisions
- Expo vs Next responsibilities
- What is shared and what is not
- Final review of generated code

### Working rule

> AI can write most repetitive code. Jonathan owns the product decisions, code review, integration, and explanation of every important trade-off.

### Preferred AI workflow

Implement one milestone or feature at a time. Do not ask an agent to generate the entire monorepo in one prompt.

Example prompt pattern:

> Implement the Expo Learning Path detail screen using the existing typed Strapi API client. Include loading, error, empty, and accessibility states. Do not modify unrelated files. First inspect the repository and state exactly which files you will change.

---

## 17. Portfolio and LinkedIn positioning

### Featured project title

**Pathway — CMS-Driven Learning Platform | Expo, Next.js, Strapi, TypeScript**

### Featured project description

> A production-minded learning platform built around structured CMS content. Strapi manages learning paths and lessons, Expo delivers the iOS and Android experience, and Next.js provides public, SEO-friendly pages for discovery and sharing.

### Alternative shorter title

**Pathway | Expo, Next.js, Strapi, TypeScript**

### LinkedIn post / portfolio framing

Do not present this as a fake startup with fictional scale. Present it as a portfolio implementation built around real product constraints and the kind of content architecture Jonathan has worked with professionally.

Suggested framing:

> I built Pathway as a proof project for a CMS-driven learning product. The focus was not feature volume; it was showing how I approach content architecture, mobile delivery, public web discovery, typed API contracts, and a coherent product experience across platforms.

---

## 18. README structure

```text
# Pathway

## Overview

## Why I built this

## Tech stack

## Architecture

## What this demonstrates

## Product features

## Project structure

## Running locally

## Deployment

## Screenshots and video

## Technical decisions

## Known limitations

## What I would do next

## Contact
```

### README principles

Recruiters should understand the project in under one minute. The top of the README should include:

- What it is
- Architecture diagram
- Tech stack
- Screenshots
- Demo video link
- Demo/deployment link
- A concise explanation of why Expo, Next.js, and Strapi coexist

---

## 19. Demo video

### Length

60–90 seconds.

### Demo script

**0–10 seconds**

> This is Pathway, a CMS-driven learning platform built with Expo, Next.js, and Strapi. The product runs on iOS and Android, while Next.js powers its public web experience.

**10–25 seconds**

Show the Expo mobile app. Navigate Home → Learning Path → Lesson. Mention content discovery, lesson progression, saved items, and mobile-first learning.

**25–40 seconds**

Show the public Next.js site. Navigate through a learning path and a direct lesson URL. Mention SEO-friendly pages, shareable routes, and an editorial reading layout.

**40–55 seconds**

Show Strapi. Edit a lesson title or publishing state. Refresh the mobile or web client and demonstrate that published content is fed from the same source of truth.

**55–70 seconds**

Mention typed API contracts, loading/error states, persistence for saved content, and the deliberate separation between mobile, public web, and CMS responsibilities.

**70–85 seconds**

> This project reflects how I approach content-driven products: clear architecture, shared contracts, mobile-first delivery, and public web experiences that are easy to discover and share.

---

## 20. Screenshots to capture

At minimum, capture:

1. Mobile Home
2. Mobile Explore
3. Mobile Learning Path
4. Mobile Lesson
5. Mobile Saved content
6. Web Homepage
7. Web Learning Path
8. Web Lesson article
9. Strapi content editing/publishing view
10. Architecture diagram or monorepo overview

Use these in the README, LinkedIn Featured item, job applications, and a short post about the project.

---

## 21. Success criteria

The project is ready to showcase when all of the following are true:

- [ ] A recruiter can understand the product and architecture in under one minute.
- [ ] The mobile app has a complete discovery → path → lesson → saved flow.
- [ ] The website has a public homepage, path page, and SEO-friendly lesson page.
- [ ] Strapi actually supplies published content to both clients.
- [ ] The visual system is consistently green, bold, and refined neo-brutalist.
- [ ] Loading, error, and empty states exist.
- [ ] The API boundary is typed and validated.
- [ ] Saved content persists locally in the mobile app.
- [ ] The README has screenshots, setup instructions, architecture, and an honest limitations section.
- [ ] A 60–90 second demo video exists.
- [ ] The project has a public demo or a credible local setup path.
- [ ] Jonathan can explain every major decision without relying on generated text.

---

## 22. Known limitations for version 1

Be explicit about these in the README:

- Authentication may be mocked or omitted.
- Saved items may be stored locally and not synced across devices.
- Analytics cards or activity summaries may use seeded/demo data.
- Video may be represented by a thumbnail or external embed rather than a full media pipeline.
- Content search may be client-side or basic server filtering.
- There is no payment, enrollment, or course commerce flow.

Honesty strengthens the portfolio. The project should be presented as production-minded, not falsely production-deployed at scale.

---

## 23. Possible version 2 improvements

Only after version 1 is showcase-ready:

- Real sign-in and cross-device saved-item sync
- Lesson completion progress stored in backend
- Deep links from web lesson pages into the Expo app
- EAS Build configuration and mobile preview builds
- EAS Hosting or equivalent public deployment for the web surface where appropriate
- Full-text search via Strapi/plugin/provider
- Video/media pipeline
- Course-level progress analytics
- Accessibility audit and automated checks
- Multilingual content

---

## 24. Core interview story

> I built Pathway to demonstrate how I approach a CMS-driven product that has different user-facing surfaces. Strapi is the source of truth for structured content and publishing. Expo handles the mobile learning experience across iOS and Android, while Next.js is used for public web discovery, SEO, and shareable lesson pages. I deliberately avoided rebuilding CMS functionality in Next because Strapi already owns that concern. The focus was on a clear content model, typed API boundaries, realistic product states, and an experience I could explain end to end.

---

## 25. Canonical scope statement

**Build one polished, working learning platform—not three disconnected apps, not a full LMS, and not a generic technology demo.**

Pathway should be small enough to finish, coherent enough to defend in an interview, and polished enough to become the main proof item in LinkedIn Featured, job applications, and recruiter conversations.
