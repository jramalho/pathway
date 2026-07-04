# Pathway — Milestone 2 Smoke Test

## Preconditions

- CMS running or accessible (`pnpm dev:cms` → http://localhost:1337/admin).
- Published content available (at least one learning path with lessons).
- Expo app running (`pnpm dev:mobile`).
- Local state optionally cleared for the first run (uninstall or reset AsyncStorage).

## Main Flow

1. Open Home.
2. Confirm real CMS content renders (greeting, continue learning, featured paths, recommended lessons).
3. Open Explore.
4. Search for "FlashList" or another real lesson title from the seeded content.
5. Open a path from the search results or default listing.
6. Open a lesson from the path curriculum.
7. Save the lesson (bookmark button in the lesson detail header).
8. Mark the lesson complete (MARK AS COMPLETE button at the bottom of the lesson).
9. Return to the path (BACK TO PATH or back navigation).
10. Confirm progress updates (progress bar percentage and completed count increase).
11. Close and reopen the app.
12. Confirm the saved lesson remains saved (bookmark icon is filled).
13. Confirm the completed lesson remains completed (completion card shows completed state).
14. Open Saved and find the lesson under the LESSONS tab.
15. Open Profile and confirm activity metrics reflect the real completed/saved counts.

## Additional Checks

- [ ] Home Recently Saved shows empty state before saving anything.
- [ ] Explore no-results state appears when searching for a non-existent term.
- [ ] Retry button on error states triggers a real refetch (simulate API failure by stopping CMS).
- [ ] Path without a cover image shows the geometric fallback (not a broken image).
- [ ] Lesson without media shows the abstract media fallback.
- [ ] Saved unavailable-content notice appears when a saved slug no longer matches published content.
- [ ] Text scaling: increase device font size and verify titles wrap without clipping.
- [ ] Screen reader: verify tab labels ("Home tab", "Explore tab", etc.), card labels, bookmark labels, and completion labels are announced correctly.
- [ ] Bottom navigation safe-area: verify last items in scrollable lists are not covered by the tab bar.
- [ ] Detail routes (paths/[slug], lessons/[slug]) do not show the bottom tab bar.
- [ ] Detail header back button works from both path and lesson detail.
- [ ] Bookmark and completion buttons are disabled during hydration (before isHydrated is true).

## Expected Result

The Milestone 2 definition of done is:

> discover → path → lesson → save/complete → restart → persisted state visible in Saved and Profile.

All loading, empty, error, and unavailable states are visually distinct and semantically correct. No screen shows an empty state or 0% progress before hydration completes. Retry buttons execute real refetches. Image fallbacks never break layout. Accessibility labels and roles are present on all interactive controls. Safe areas prevent content from being covered.
