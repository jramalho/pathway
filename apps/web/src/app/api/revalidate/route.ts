import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { parseWebhookPayload, routesToRevalidate } from "@/lib/revalidation";

/**
 * On-demand revalidation endpoint — `POST /api/revalidate`.
 *
 * Called by Strapi webhooks when content is published, updated, or
 * unpublished. Revalidates only the affected public routes so the
 * Next.js ISR cache refreshes immediately instead of waiting for the
 * 5-minute `revalidate` window.
 *
 * Security:
 *   - POST only (GET and other methods are rejected with 405).
 *   - Requires `REVALIDATE_SECRET` environment variable.
 *   - Expects `Authorization: Bearer <secret>` header (configured as a
 *     custom header in Strapi Admin → Settings → Webhooks).
 *   - Secret comparison uses a constant-time-ish length check + timing-safe
 *     equality to resist timing attacks. Node's `crypto.timingSafeEqual`
 *     is the right primitive; we use it when both lengths match and fall
 *     back to a simple mismatch otherwise.
 *   - No raw error messages, secrets, or internal cache details are
 *     exposed in responses. Errors are logged safely server-side.
 *
 * Fallback: if the webhook is not configured or fails, the existing
 * `revalidate = 300` (5-minute ISR) on each public route still keeps
 * content fresh — on-demand revalidation is an optimization, not a
 * dependency.
 */

/** Safe, non-sensitive success response body. */
const OK_BODY = { revalidated: true } as const;

/** Safe, non-sensitive error response body. */
const ERROR_BODY = { revalidated: false } as const;

/**
 * Timing-safe string comparison to resist timing attacks on the secret.
 * Returns true only when both strings have the same length and the same
 * bytes. Uses `crypto.timingSafeEqual` under the hood.
 */
function safeEqual(a: string, b: string): boolean {
  // ponytail: timing-safe comparison. Ceiling: when lengths differ, we
  // return false immediately — a length leak is acceptable for a bearer
  // token (secrets are expected to be fixed-length). Upgrade path: hash
  // both sides before comparing to eliminate the length leak entirely.
  if (a.length !== b.length) return false;
  const encoder = new TextEncoder();
  return timingSafeEqual(encoder.encode(a), encoder.encode(b));
}

/**
 * Extract and validate the bearer token from the Authorization header.
 * Returns true when the token matches the configured secret.
 */
function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;

  if (!authHeader) return false;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) return false;

  return safeEqual(match[1], secret);
}

export async function POST(request: Request): Promise<Response> {
  // 1. Authorization check — reject before parsing the body.
  const authHeader = request.headers.get("authorization");
  if (!isAuthorized(authHeader)) {
    // ponytail: 401 for missing/invalid auth. No body details leaked.
    // Ceiling: a brute-force attacker learns nothing but the status code.
    return NextResponse.json(ERROR_BODY, { status: 401 });
  }

  // 2. Parse and validate the payload.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    // Malformed JSON body.
    return NextResponse.json(ERROR_BODY, { status: 400 });
  }

  const result = parseWebhookPayload(raw);
  if (!result.ok) {
    // Unsupported content type, missing slug, or malformed payload.
    // 400 for malformed/missing-slug, 404 for unsupported content type
    // (not a Pathway content type — nothing to revalidate).
    const status = result.reason === "unsupported-uid" ? 404 : 400;
    return NextResponse.json(ERROR_BODY, { status });
  }

  // 3. Revalidate the affected routes.
  const routes = routesToRevalidate(result.payload);
  for (const route of routes) {
    try {
      revalidatePath(route);
    } catch (err) {
      // Log safely — no secrets, no full payload. The route path is not
      // sensitive (it's a public URL path, not an internal identifier).
      console.error(
        `[Pathway] revalidatePath failed for "${route}" (event: ${result.payload.event}, uid: ${result.payload.uid}):`,
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  return NextResponse.json(OK_BODY, { status: 200 });
}

/**
 * Reject all non-POST methods. Next.js route handlers export per-method
 * functions; not exporting GET/PUT/etc. means they 405 automatically,
 * but we export an explicit handler to be unambiguous.
 */
export function GET(): Response {
  return NextResponse.json(ERROR_BODY, { status: 405 });
}
