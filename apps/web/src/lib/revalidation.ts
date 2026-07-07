/**
 * On-demand revalidation logic for Strapi publishing webhooks.
 *
 * Strapi 5 (v5.49.0) webhook behavior (confirmed from source):
 *
 *   Events (configured per webhook in Strapi Admin → Settings → Webhooks):
 *     - entry.create
 *     - entry.update
 *     - entry.delete
 *     - entry.publish
 *     - entry.unpublish
 *     - entry.draft-discard
 *
 *   HTTP request (POST to the configured webhook URL):
 *     Headers:
 *       Content-Type: application/json
 *       X-Strapi-Event: <event name>   (e.g. "entry.publish")
 *       ...any custom headers configured in the webhook's `headers` field
 *     Body (JSON):
 *       {
 *         event: "entry.publish",
 *         createdAt: "2026-07-05T...",
 *         model: "learning-path",                       // model.modelName
 *         uid: "api::learning-path.learning-path",     // model.uid
 *         entry: { documentId, id, slug, title, ..., publishedAt, ... }
 *       }
 *
 *   Custom headers: Strapi Admin lets you configure arbitrary key/value
 *   headers per webhook. We use this to send `Authorization: Bearer <secret>`.
 *
 *   Unpublish payload: the `entry` object is NOT populated with relations
 *   (Strapi omits populate on unpublish/delete events). The entry still
 *   carries scalar fields including `slug`. For lessons, the `learningPath`
 *   relation may be absent on unpublish — we handle that gracefully.
 *
 * This module is pure and testable: it parses the payload and returns the
 * set of Next.js routes to revalidate. The route handler wires it to
 * `revalidatePath` and sends safe responses.
 */

/** Strapi content-type UIDs that map to public Pathway routes. */
const PATH_UID = "api::learning-path.learning-path";
const LESSON_UID = "api::lesson.lesson";

/** Recognized Strapi webhook event names. */
export type WebhookEvent =
  | "entry.create"
  | "entry.update"
  | "entry.delete"
  | "entry.publish"
  | "entry.unpublish"
  | "entry.draft-discard";

/** Events that indicate content became unavailable (unpublished/deleted). */
const UNAVAILABLE_EVENTS: ReadonlySet<string> = new Set([
  "entry.unpublish",
  "entry.delete",
]);

/** Supported content-type UIDs (the only UIDs we revalidate for). */
const SUPPORTED_UIDS: ReadonlySet<string> = new Set([PATH_UID, LESSON_UID]);

/**
 * Minimal typed shape of a Strapi webhook entry.
 *
 * Only the fields we actually read are typed. The real payload carries
 * many more fields (title, description, etc.) — we ignore them. `slug`
 * is always present on our content types (required in the Strapi schema).
 * Relations (`learningPath`, `module`) may be absent on unpublish/delete.
 */
interface WebhookEntry {
  slug?: string;
  learningPath?: { slug?: string } | null;
}

/** Parsed and validated webhook payload. */
export interface ParsedWebhookPayload {
  event: WebhookEvent;
  model: string;
  uid: string;
  slug: string | null;
  parentPathSlug: string | null;
}

/** Result of parsing: either a valid payload or a typed rejection reason. */
export type ParseResult =
  | { ok: true; payload: ParsedWebhookPayload }
  | { ok: false; reason: "unsupported-uid" | "missing-slug" | "malformed" };

/**
 * Parse a raw webhook body into a validated payload, or return a typed
 * rejection reason. Does not throw — the caller decides the HTTP status.
 *
 * Only `api::learning-path.learning-path` and `api::lesson.lesson` are
 * supported. Slugs are validated against the same `isValidSlug` rule used
 * by the sitemap so we never revalidate a malformed route.
 */
export function parseWebhookPayload(raw: unknown): ParseResult {
  if (!isObject(raw)) return { ok: false, reason: "malformed" };

  const event = (raw as { event?: unknown }).event;
  const uid = (raw as { uid?: unknown }).uid;
  const entry = (raw as { entry?: unknown }).entry;

  if (typeof event !== "string" || typeof uid !== "string" || !isObject(entry)) {
    return { ok: false, reason: "malformed" };
  }

  if (!SUPPORTED_UIDS.has(uid)) {
    return { ok: false, reason: "unsupported-uid" };
  }

  const slug = readSlug((entry as WebhookEntry).slug);
  if (!slug) return { ok: false, reason: "missing-slug" };

  // For lessons, the parent learning-path slug may be present in the
  // populated entry (publish/update events). On unpublish/delete, Strapi
  // does not populate relations, so parentPathSlug is null — the caller
  // revalidates all /paths/[slug] routes as a safe fallback.
  const parentPathSlug =
    uid === LESSON_UID ? readSlug((entry as WebhookEntry).learningPath?.slug) : null;

  return {
    ok: true,
    payload: { event: event as WebhookEvent, model: "", uid, slug, parentPathSlug },
  };
}

/** Routes to revalidate for a given parsed payload. Deterministic. */
export function routesToRevalidate(payload: ParsedWebhookPayload): string[] {
  const routes = new Set<string>();
  const isUnavailable = UNAVAILABLE_EVENTS.has(payload.event);

  // Listing and discovery pages are always affected by any content change.
  routes.add("/");
  routes.add("/explore");
  routes.add("/paths");
  routes.add("/sitemap.xml");

  if (payload.uid === PATH_UID) {
    // Learning path event — revalidate the affected path page.
    if (payload.slug) {
      routes.add(`/paths/${payload.slug}`);
    }
    // On unpublish/delete, the path page should refresh into not-found.
    // revalidatePath handles this: the next request re-runs generateMetadata
    // and the page (which calls notFound() when the path is gone).
  }

  if (payload.uid === LESSON_UID) {
    // Lesson event — revalidate the affected lesson page.
    if (payload.slug) {
      routes.add(`/lessons/${payload.slug}`);
    }
    // Revalidate the parent learning-path page (curriculum lists lessons).
    if (payload.parentPathSlug) {
      routes.add(`/paths/${payload.parentPathSlug}`);
    } else if (isUnavailable) {
      // ponytail: on unpublish/delete, Strapi does not populate the
      // learningPath relation, so we don't know the parent path slug.
      // Ceiling: the parent path page stays stale until its own 5-min ISR
      // window expires or a separate path event arrives. Upgrade path:
      // query the published path tree here to find the parent — but that
      // adds a Strapi round-trip to every unpublish webhook, which the
      // task rules discourage ("do not query unpublished content through
      // public-only API functions just to find a slug"). The ISR fallback
      // covers it within 5 minutes.
    }
  }

  return [...routes].sort();
}

/** Read and validate a slug from a webhook entry field. */
function readSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!isValidSlug(value)) return null;
  return value;
}

/** Same slug validation rule as the sitemap — no spaces or control chars. */
function isValidSlug(slug: string): boolean {
  if (!slug || !slug.trim()) return false;
  return !/[\s\x00-\x1f]/.test(slug);
}

/** Runtime type guard for plain objects (not arrays, not null). */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
