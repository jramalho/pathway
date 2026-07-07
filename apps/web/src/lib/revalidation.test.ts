/**
 * Runnable self-check for the webhook payload parser and route-target
 * selection logic.
 *
 * Uses Node's built-in `node:test` — no framework, no fixtures beyond
 * tiny inline payloads. Run with:
 *   node --experimental-strip-types --test apps/web/src/lib/revalidation.test.ts
 *
 * This is the smallest thing that fails if the parsing or route selection
 * breaks. It does not call revalidatePath or hit Strapi.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseWebhookPayload,
  routesToRevalidate,
  type ParsedWebhookPayload,
} from "./revalidation.ts";

test("parseWebhookPayload: valid learning-path publish event", () => {
  const result = parseWebhookPayload({
    event: "entry.publish",
    createdAt: "2026-07-05T01:00:00.000Z",
    model: "learning-path",
    uid: "api::learning-path.learning-path",
    entry: { documentId: "abc", id: 1, slug: "react-native-performance", title: "RN Performance" },
  });

  assert.ok(result.ok);
  assert.equal(result.payload.uid, "api::learning-path.learning-path");
  assert.equal(result.payload.slug, "react-native-performance");
  assert.equal(result.payload.parentPathSlug, null);
});

test("parseWebhookPayload: valid lesson publish event with parent path", () => {
  const result = parseWebhookPayload({
    event: "entry.publish",
    createdAt: "2026-07-05T01:00:00.000Z",
    model: "lesson",
    uid: "api::lesson.lesson",
    entry: {
      documentId: "def",
      id: 2,
      slug: "flashlist-rendering",
      title: "FlashList rendering",
      learningPath: { documentId: "abc", slug: "react-native-performance", title: "RN Performance" },
    },
  });

  assert.ok(result.ok);
  assert.equal(result.payload.slug, "flashlist-rendering");
  assert.equal(result.payload.parentPathSlug, "react-native-performance");
});

test("parseWebhookPayload: lesson unpublish event without populated relations", () => {
  const result = parseWebhookPayload({
    event: "entry.unpublish",
    createdAt: "2026-07-05T01:00:00.000Z",
    model: "lesson",
    uid: "api::lesson.lesson",
    entry: { documentId: "def", id: 2, slug: "flashlist-rendering", title: "FlashList rendering" },
  });

  assert.ok(result.ok);
  assert.equal(result.payload.slug, "flashlist-rendering");
  assert.equal(result.payload.parentPathSlug, null);
});

test("parseWebhookPayload: rejects unsupported content type", () => {
  const result = parseWebhookPayload({
    event: "entry.publish",
    uid: "api::category.category",
    entry: { slug: "mobile" },
  });

  assert.ok(!result.ok);
  assert.equal(result.reason, "unsupported-uid");
});

test("parseWebhookPayload: rejects missing slug", () => {
  const result = parseWebhookPayload({
    event: "entry.publish",
    uid: "api::learning-path.learning-path",
    entry: { documentId: "abc", title: "No slug here" },
  });

  assert.ok(!result.ok);
  assert.equal(result.reason, "missing-slug");
});

test("parseWebhookPayload: rejects malformed payload (entry not an object)", () => {
  const result = parseWebhookPayload({
    event: "entry.publish",
    uid: "api::learning-path.learning-path",
    entry: "not-an-object",
  });

  assert.ok(!result.ok);
  assert.equal(result.reason, "malformed");
});

test("parseWebhookPayload: rejects malformed payload (not an object)", () => {
  const result = parseWebhookPayload("just-a-string");

  assert.ok(!result.ok);
  assert.equal(result.reason, "malformed");
});

test("parseWebhookPayload: rejects malformed payload (missing event)", () => {
  const result = parseWebhookPayload({
    uid: "api::learning-path.learning-path",
    entry: { slug: "test" },
  });

  assert.ok(!result.ok);
  assert.equal(result.reason, "malformed");
});

test("routesToRevalidate: learning-path publish revalidates path page + listings + sitemap", () => {
  const payload: ParsedWebhookPayload = {
    event: "entry.publish",
    model: "",
    uid: "api::learning-path.learning-path",
    slug: "react-native-performance",
    parentPathSlug: null,
  };

  const routes = routesToRevalidate(payload);
  assert.ok(routes.includes("/"));
  assert.ok(routes.includes("/explore"));
  assert.ok(routes.includes("/paths"));
  assert.ok(routes.includes("/paths/react-native-performance"));
  assert.ok(routes.includes("/sitemap.xml"));
  // Should NOT include any lesson routes for a path event.
  assert.ok(!routes.some((r) => r.startsWith("/lessons/")));
});

test("routesToRevalidate: lesson publish revalidates lesson + parent path + listings + sitemap", () => {
  const payload: ParsedWebhookPayload = {
    event: "entry.publish",
    model: "",
    uid: "api::lesson.lesson",
    slug: "flashlist-rendering",
    parentPathSlug: "react-native-performance",
  };

  const routes = routesToRevalidate(payload);
  assert.ok(routes.includes("/"));
  assert.ok(routes.includes("/explore"));
  assert.ok(routes.includes("/paths"));
  assert.ok(routes.includes("/lessons/flashlist-rendering"));
  assert.ok(routes.includes("/paths/react-native-performance"));
  assert.ok(routes.includes("/sitemap.xml"));
});

test("routesToRevalidate: lesson unpublish without parent path slug still revalidates lesson + listings", () => {
  const payload: ParsedWebhookPayload = {
    event: "entry.unpublish",
    model: "",
    uid: "api::lesson.lesson",
    slug: "flashlist-rendering",
    parentPathSlug: null,
  };

  const routes = routesToRevalidate(payload);
  assert.ok(routes.includes("/lessons/flashlist-rendering"));
  assert.ok(routes.includes("/"));
  assert.ok(routes.includes("/explore"));
  assert.ok(routes.includes("/sitemap.xml"));
  // No parent path route when slug is unknown.
  assert.ok(!routes.some((r) => r.startsWith("/paths/") && r !== "/paths"));
});

test("routesToRevalidate: output is deterministic (sorted, no duplicates)", () => {
  const payload: ParsedWebhookPayload = {
    event: "entry.publish",
    model: "",
    uid: "api::learning-path.learning-path",
    slug: "react-native-performance",
    parentPathSlug: null,
  };

  const routes = routesToRevalidate(payload);
  const sorted = [...routes].sort();
  assert.deepEqual(routes, sorted);
  assert.equal(new Set(routes).size, routes.length);
});
