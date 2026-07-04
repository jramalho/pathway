# ADR-003 — Local Persistence Strategy for Saved Items and Lesson Progress

## Status
Accepted

## Context

Milestone 2 requires that saved lessons, saved learning paths, and completed lessons persist across app restarts on the Expo mobile app. The project explicitly excludes authentication, cross-device sync, and backend storage of user activity in version 1. A persistence strategy was needed that:

- Survives app restarts without a backend.
- Does not introduce a new heavy dependency.
- Preserves data integrity when the app is killed mid-write.
- Does not delete user data when saved slugs no longer match published content (unpublishing is a CMS action, not a user action).
- Keeps the UI responsive — writes should never block the main thread or the user.

The choice was between AsyncStorage (already a standard Expo dependency), SecureStore (encrypted but slower and size-limited), SQLite (heavier, more powerful than needed), and a custom file-based store.

## Decision

Use AsyncStorage with a versioned, single-key, JSON-serializable payload for all local learning activity state.

- **Storage key:** `@pathway/learning-activity:v1` — a single key holding one JSON object.
- **Payload shape:** `{ version: 1, completedLessonSlugs: string[], savedLessonSlugs: string[], savedPathSlugs: string[] }` — ordered arrays of slugs, no nested objects.
- **In-memory state:** `Record<string, true>` for O(1) lookups + ordered arrays for recency. The persisted payload uses only arrays (simpler, smaller, forward-compatible).
- **Hydration:** read once on mount before any writes are allowed. A type guard validates the payload shape and sanitizes duplicates/empty strings. Corrupt JSON is ignored and starts fresh.
- **Write strategy:** single-flight queue — if a write is in-flight, the next state change marks a pending write; when the in-flight write completes, the pending write writes the latest state from a ref. This prevents race conditions from rapid taps without blocking the UI.
- **Storage failure:** sets `storageStatus: "error"` in state. The UI shows a discrete notice in Saved and Profile. User data is never silently deleted. The app continues working with in-memory state for the session.
- **Unpublished content:** slugs that no longer match published CMS content are filtered from display but NOT removed from persisted state. The UI distinguishes "empty" (never saved) from "unavailable" (saved but no longer published).

## Consequences

- Saved items and progress are device-local only. Clearing app data or uninstalling loses them. This is documented honestly in the Profile screen.
- No cross-device sync is possible without a future backend — intentionally out of scope for v1.
- The versioned payload allows future schema migrations (e.g., adding `savedAt` timestamps) by bumping the version and writing a migration in the read path.
- The single-key approach means all activity state is read and written atomically — no partial state corruption from multi-key races.
- AsyncStorage has a ~6MB practical limit on Android; for slug arrays this is more than sufficient (thousands of slugs fit in a few KB).
- The type guard (not Zod) is used at the storage boundary because Zod is not a mobile dependency and the payload shape is simple enough to validate by hand.

## Related milestone
M2 — Expo Mobile Core Journey
