/**
 * Tests for the Pathway API client (Parte 4).
 *
 * Uses node:test with an injectable mock fetch — no real Strapi calls.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { createPathwayApiClient } from "./create-pathway-api-client.ts";
import { resolveStrapiMediaUrl } from "./resolve-strapi-media-url.ts";
import { PathwayApiHttpError } from "../errors/pathway-api-http-error.ts";
import { PathwayApiNetworkError } from "../errors/pathway-api-network-error.ts";
import { PathwayApiValidationError } from "../errors/pathway-api-validation-error.ts";
import {
  publishedLearningPathListFixture,
  publishedLearningPathFixture,
} from "../__fixtures__/learning-path.fixture.ts";

// ---------------------------------------------------------------------------
// Mock fetch helpers
// ---------------------------------------------------------------------------

function mockFetchOk(body: unknown): typeof fetch {
  return (() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve(body),
    }) as Promise<Response>) as typeof fetch;
}

function mockFetchStatus(status: number, statusText: string): typeof fetch {
  return (() =>
    Promise.resolve({
      ok: false,
      status,
      statusText,
      json: () => Promise.resolve({}),
    }) as Promise<Response>) as typeof fetch;
}

function mockFetchNetworkError(message: string): typeof fetch {
  return (() => Promise.reject(new TypeError(message))) as typeof fetch;
}

function mockFetchAbort(): typeof fetch {
  return (() => {
    const err = new Error("aborted");
    err.name = "AbortError";
    return Promise.reject(err);
  }) as typeof fetch;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const BASE_URL = "http://localhost:1337";

test("getPublishedLearningPaths: 200 valid response → LearningPath[]", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  const paths = await client.getPublishedLearningPaths({
    fetch: mockFetchOk(publishedLearningPathListFixture),
  });
  assert.equal(paths.length, 1);
  assert.equal(paths[0].slug, "react-native-performance");
  assert.equal(paths[0].lessonCount, 3);
});

test("getPublishedLearningPaths: non-2xx → PathwayApiHttpError", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  await assert.rejects(
    () => client.getPublishedLearningPaths({ fetch: mockFetchStatus(500, "Internal Server Error") }),
    (err: unknown) => err instanceof PathwayApiHttpError && err.status === 500,
  );
});

test("getPublishedLearningPaths: fetch failure → PathwayApiNetworkError", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  await assert.rejects(
    () => client.getPublishedLearningPaths({ fetch: mockFetchNetworkError("ECONNREFUSED") }),
    (err: unknown) => err instanceof PathwayApiNetworkError,
  );
});

test("getPublishedLearningPaths: AbortError propagates as-is (not wrapped)", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  await assert.rejects(
    () => client.getPublishedLearningPaths({ fetch: mockFetchAbort() }),
    (err: unknown) => err instanceof Error && err.name === "AbortError",
  );
});

test("getPublishedLearningPaths: 200 but invalid payload → PathwayApiValidationError", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  await assert.rejects(
    () => client.getPublishedLearningPaths({ fetch: mockFetchOk({ wrong: true }) }),
    (err: unknown) => err instanceof PathwayApiValidationError,
  );
});

test("getFeaturedLearningPaths: 200 valid response → LearningPath[]", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  const paths = await client.getFeaturedLearningPaths({
    fetch: mockFetchOk(publishedLearningPathListFixture),
  });
  assert.equal(paths.length, 1);
  assert.equal(paths[0].featured, true);
});

test("getLearningPathBySlug: 200 with one match → LearningPath", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  const lp = await client.getLearningPathBySlug("react-native-performance", {
    fetch: mockFetchOk(publishedLearningPathListFixture),
  });
  assert.notEqual(lp, null);
  assert.equal(lp!.slug, "react-native-performance");
});

test("getLearningPathBySlug: 200 with empty list → null", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  const lp = await client.getLearningPathBySlug("nonexistent-slug", {
    fetch: mockFetchOk({ data: [], meta: {} }),
  });
  assert.equal(lp, null);
});

test("getLearningPathBySlug: 200 with multiple matches → PathwayApiValidationError", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  const duplicateFixture = {
    data: [
      publishedLearningPathFixture.data,
      publishedLearningPathFixture.data,
    ],
    meta: {},
  };
  await assert.rejects(
    () => client.getLearningPathBySlug("react-native-performance", {
      fetch: mockFetchOk(duplicateFixture),
    }),
    (err: unknown) => err instanceof PathwayApiValidationError,
  );
});

test("getLearningPathBySlug: empty slug → PathwayApiValidationError", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL });
  await assert.rejects(
    () => client.getLearningPathBySlug("   ", { fetch: mockFetchOk({ data: [], meta: {} }) }),
    (err: unknown) => err instanceof PathwayApiValidationError,
  );
});

test("baseUrl trailing slash is normalized", async () => {
  let capturedUrl = "";
  const fetchMock = ((url: string) => {
    capturedUrl = url;
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve(publishedLearningPathListFixture),
    }) as Promise<Response>;
  }) as typeof fetch;

  const client = createPathwayApiClient({ baseUrl: "http://localhost:1337/" });
  await client.getPublishedLearningPaths({ fetch: fetchMock });
  assert.ok(capturedUrl.startsWith("http://localhost:1337/api/"), `URL was: ${capturedUrl}`);
  assert.ok(!capturedUrl.includes("//api/"), `double slash in: ${capturedUrl}`);
});

// ---------------------------------------------------------------------------
// resolveStrapiMediaUrl
// ---------------------------------------------------------------------------

test("resolveStrapiMediaUrl: relative URL resolved against baseUrl", () => {
  const result = resolveStrapiMediaUrl("/uploads/cover.jpg", "http://localhost:1337");
  assert.equal(result, "http://localhost:1337/uploads/cover.jpg");
});

test("resolveStrapiMediaUrl: absolute URL preserved", () => {
  const result = resolveStrapiMediaUrl("https://cdn.example.com/cover.jpg", "http://localhost:1337");
  assert.equal(result, "https://cdn.example.com/cover.jpg");
});

test("resolveStrapiMediaUrl: null stays null", () => {
  const result = resolveStrapiMediaUrl(null, "http://localhost:1337");
  assert.equal(result, null);
});

test("resolveStrapiMediaUrl: baseUrl trailing slash normalized", () => {
  const result = resolveStrapiMediaUrl("/uploads/cover.jpg", "http://localhost:1337/");
  assert.equal(result, "http://localhost:1337/uploads/cover.jpg");
});
