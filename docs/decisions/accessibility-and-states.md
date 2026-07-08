# Accessibility and Product States

## Status
Accepted

## Context

Marco 4.5 consolidates loading, error, empty, unavailable, and not-found
states across mobile and web, and applies a practical accessibility review
to the primary user flows. This document records the decisions that exist
in the repository after those changes — it is not generic guidance.

## 1. Product states standardized

| State | Mobile | Web |
| ----- | ------ | --- |
| Initial loading | Structural skeletons (`HomeSkeleton`, `ExploreSkeleton`, `LearningPathDetailSkeleton`, `LessonDetailSkeleton`, `SavedContentSkeleton`, `ProfileSkeleton`) — bordered blocks, no shimmer | `SkeletonPage` / `SkeletonCard` / `SkeletonText` / `SkeletonMedia` with a subtle pulse (disabled under `prefers-reduced-motion`) |
| Section loading | Inline skeleton blocks or `RESTORING PROGRESS` placeholders | Inline skeleton blocks |
| Action loading | `NeoButton` `loading` prop shows `···` and disables the press; `ErrorState` `retryLoading` shows the same on retry | `PrimaryButton` `loading` shows `···` and `aria-busy`; `LessonShare` copy button shows `Link copied` only after the clipboard resolves |
| Load error | `ErrorState` with specific user-facing message from `@pathway/api` `USER_FACING_MESSAGES`, retry, optional secondary action | `ContentState` variant `error` with retry + secondary; root `error.tsx` maps `toUserFacingError` |
| Action error | Revert local state; storage errors surface a discrete notice (`storageStatus === "error"`) | `LessonShare` catch blocks keep the URL visible |
| Empty | `EmptyState` with icon variants (`bookmark`, `warning`, `grid`), title, description, optional CTA | `ContentState` variant `empty`; inline `EmptyState` primitive |
| No search results | `NoResultsState` with reset action | `ContentState` variant `empty` with `Clear filters` action |
| Unavailable | `EmptyState` icon `warning` — "SAVED CONTENT UNAVAILABLE"; `UnavailableSavedContentNotice` for partial | `ContentState` variant `unavailable` |
| Not found | `EmptyState` — "PATH NOT FOUND" / "LESSON NOT FOUND" with back CTA | `notFound()` → `(public)/not-found.tsx` and root `not-found.tsx`, both `noindex` |
| Not published | API returns `null` for unpublished slugs → not-found / empty | `notFound()` for missing/unpublished; `generateStaticParams` only includes published slugs |
| Disabled | `accessibilityState={{ disabled: true }}` + opacity 0.5 | `:disabled` styles + `aria-disabled` where applicable |
| Selected | `accessibilityState={{ selected: true }}` on tabs, chips, bookmarks | `aria-pressed` on filter chips; `aria-current="page"` on active nav |
| Pressed/active | Pressable `pressed` style transforms (3px shift, shadow shrink) | `:active` transform + shadow shrink |
| Hover/focus | N/A (touch) | `:hover` transform; `:focus-visible` outline on every interactive element |
| Saving/saved | `BookmarkControl` `accessibilityState={{ selected }}` + acid-green fill | `BookmarkControl` `aria-pressed` + acid-green fill |
| Completing/completed | `LessonCompletionCard` — "LESSON COMPLETED" with `MARK AS INCOMPLETE`; path-complete banner | N/A (web has no local progress) |
| Retrying | `ErrorState` `retryLoading` → `NeoButton` shows `···` and is disabled | `ContentState` retry link reloads the route |

## 2. Loading, error, empty, and unavailable handling

### Loading

- **Mobile**: every primary screen has a structural skeleton that mirrors
  the real layout (greeting, cards, sections). Skeletons use bordered
  blocks with `tokens.color.surfaceContainer` — no shimmer, no gradient.
  `accessibilityRole="alert"` + `accessibilityLabel="Loading"` announces
  the state to screen readers.
- **Web**: `SkeletonPage` and the skeleton primitives use a subtle pulse
  animation (`.pathway-skeleton` class). The pulse is disabled under
  `@media (prefers-reduced-motion: reduce)`. All skeleton wrappers are
  `aria-hidden="true"` so they don't create screen-reader noise.

### Error

- Errors are mapped at the API boundary (`toUserFacingError`) into six
  user-facing kinds: `network-unavailable`, `content-unavailable`,
  `not-found`, `forbidden`, `rate-limited`, `generic-error`. Each has a
  specific, human-readable message in `USER_FACING_MESSAGES`.
- No raw error details, stack traces, or JSON are shown to the user.
- Mobile `ErrorState` is announced as `accessibilityLiveRegion="assertive"`
  so screen readers notify the user immediately.
- Web `ContentState` variant `error` uses `role="alert"` and
  `aria-live="assertive"`.
- Every recoverable error offers a Retry action. Retry buttons show a
  loading state (`retryLoading`) to prevent double-taps.
- Web route errors propagate to `error.tsx`, which maps the error again
  via `toUserFacingError` and offers `reset()` + back-to-home.

### Empty

- Empty states explain what is missing and offer a CTA only when a real
  route or action exists.
- Mobile `EmptyState` uses geometric icon variants (`bookmark`, `warning`,
  `grid`) to differentiate empty / unavailable / coming-soon without
  relying on color alone. Icons are decorative (`accessibilityElementsHidden`).
- Web `ContentState` uses inline-SVG `StateIcon` variants, also
  `aria-hidden`.
- No cartoon illustrations.

### Unavailable

- Distinct from empty: "SAVED CONTENT UNAVAILABLE" uses the `warning`
  icon and explains that the item is not currently published.
- Saved slugs are never deleted from persisted state when they become
  unavailable — they are hidden from the display and counted in a
  discrete notice.

### Not found

- Mobile: `EmptyState` with "PATH NOT FOUND" / "LESSON NOT FOUND" and a
  back-to-explore CTA.
- Web: `notFound()` triggers the public 404 boundary, which carries
  `noindex` and offers back-to-home + explore.
- Unpublished content maps to not-found (the API returns `null` for
  unpublished slugs).

## 3. Mobile accessibility decisions

- **Roles**: `accessibilityRole` is set on every interactive element —
  `button` (cards, CTAs, bookmarks, back links), `tab` (bottom tabs,
  segmented control, filter chips), `search` (search input wrapper),
  `header` (lesson body headings), `progressbar` (progress bars),
  `alert` (skeletons, error states), `summary` (empty states, overview
  cards).
- **Labels**: `accessibilityLabel` is provided when the visible text is
  insufficient. Cards announce their destination ("Open learning path
  {title}"). Bookmarks announce "Save / Remove {title}". Completion
  announces "Mark lesson {title} as complete / incomplete". Navigation
  announces "Go to previous / next lesson {title}".
- **States**: `accessibilityState` carries `selected` (tabs, chips,
  bookmarks), `disabled` (during hydration or action loading), `expanded`
  (module accordions), `checked` where applicable.
- **Touch targets**: all interactive elements meet or exceed 44px
  (`Layout.touchTarget`). `hitSlop` extends smaller visual targets
  (bookmark icons, back arrows) to the minimum.
- **Decorative elements**: icons that duplicate visible text are marked
  `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"`.
- **Reading order**: screens follow title → metadata → progress →
  actions → content → next-navigation, which is the natural DOM order.
- **Hydration**: bookmark and completion controls are disabled during
  hydration with `accessibilityState={{ disabled: true }}`; progress
  shows "RESTORING PROGRESS" instead of a misleading 0%.
- **Filter chips**: touch target raised from 36px to 44px to meet the
  minimum comfortably.

## 4. Web accessibility decisions

- **Semantic HTML**: `header`, `nav`, `main`, `section`, `article`,
  `aside`, `footer` are used throughout. One `h1` per page; heading
  order is logical (h1 → h2 → h3 → h4).
- **Skip link**: `PublicShell` renders a "Skip to content" link that
  becomes visible on `:focus-visible` and targets `#main-content`.
- **Focus visibility**: every interactive element has a `:focus-visible`
  outline (`2px solid accentFocus` with `2px` offset). `:focus` was
  converted to `:focus-visible` across all public components so focus
  rings don't appear on mouse click but are always visible on keyboard
  navigation.
- **Keyboard navigation**: tab order follows the visual order. The mobile
  menu (hamburger) is operable by keyboard — Escape closes it, focus
  moves to the first link on open and back to the trigger on close.
- **Search input**: has an `aria-label` ("Search learning paths and
  lessons") and a visible clear button with `aria-label="Clear search"`.
- **Filters**: filter chips use `aria-pressed` to communicate selected
  state. Topic and difficulty fieldsets use `<fieldset>` + `<legend>`.
- **Breadcrumbs**: `<nav aria-label="Breadcrumb">` with the current page
  marked `aria-current="page"`.
- **Table of contents**: `<aside aria-label="Table of contents">` with
  `<nav>` inside; entries link to real heading anchors.
- **Images**: cover images use `alt` from Strapi when available;
  decorative fallbacks are `aria-hidden="true"`.
- **Share controls**: `aria-label` on every button/link; copy button
  announces success via `aria-live="polite"`.
- **Progress bars**: `role="progressbar"` with `aria-valuenow`,
  `aria-valuemin`, `aria-valuemax`, and `aria-label`.
- **Error/empty states**: `ContentState` uses `role="alert"` (error,
  unavailable) or `role="status"` (loading, empty, not-found) with
  appropriate `aria-live` politeness.
- **Reduced motion**: `globals.css` disables animations and transitions
  under `@media (prefers-reduced-motion: reduce)`, including the
  skeleton pulse.

## 5. Known limitations

- **Mobile lesson body links**: external `http(s)` links in the lesson
  body render as styled text but do not navigate on native (Expo Router
  typed routes reject external URLs). The URL is exposed to assistive
  tech via `accessibilityLabel`. Wiring `expo-web-browser` is deferred.
- **Web ToC active-state tracking**: there is no scroll-spy or
  JavaScript active-heading tracking — the TOC links to real anchors but
  doesn't highlight the current section. Deferred.
- **Web on-demand revalidation end-to-end**: the webhook endpoint is
  implemented and unit-tested, but the end-to-end Strapi webhook trigger
  was not validated manually (documented in M3 evidence).
- **Mobile landscape**: not explicitly supported or tested in this
  milestone.
- **Web video player**: external (non-direct) video URLs are not
  embedded; only direct `.mp4`/`.webm`/`.ogg` URLs render a native
  `<video>`.
- **Dark mode**: the design is intentionally single-mode (light). No
  dark theme is planned for V1.
- **Automated tests for accessibility**: no automated a11y testing
  (axe, etc.) is wired — validation is manual. CI for lint/typecheck/
  tests belongs to Marco 4.6.

## 6. Manual validation checklist

Before screenshots, demo, or deploy:

### Mobile

- [ ] Home loads with skeleton, then real content.
- [ ] Explore: search "FlashList" returns results; a nonsense query shows
      the no-results state with a reset action.
- [ ] Explore: tapping a topic filter chip selects it (44px target).
- [ ] Saved: empty state with CTA; saved lesson card; saved path card;
      unavailable notice when slugs don't match.
- [ ] Save and remove a lesson — bookmark announces selected state.
- [ ] Open a path and a lesson — back navigation works.
- [ ] Mark a lesson complete — completion card announces state; path-
      complete banner appears on the last lesson.
- [ ] Retry an error — retry button shows loading and prevents double-tap.
- [ ] Verify no action is hidden by the bottom tab bar or safe area.

### Web

- [ ] Tab through Home, Explore, Path, Lesson — focus ring is visible on
      every interactive element.
- [ ] Search input has an accessible label; clear button works.
- [ ] Filter chips communicate selected state via `aria-pressed`.
- [ ] Open a valid path and lesson page.
- [ ] Open `/paths/slug-que-nao-existe` and `/lessons/slug-que-nao-existe`
      → 404 with noindex.
- [ ] Search with no results → empty state with clear-filters action.
- [ ] Test in mobile and desktop viewport widths — no horizontal overflow.
- [ ] Confirm header, cards, article, ToC, and footer don't overlap.
- [ ] Confirm unpublished content does not appear publicly.
- [ ] Activate `prefers-reduced-motion` — skeleton pulse and transitions
      stop.
