/**
 * Tests for the Pathway API client factory (backward-compatible interface).
 *
 * Uses node:test with an injectable mock fetch — no real Strapi calls.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { createPathwayApiClient } from "./create-pathway-api-client.ts";
import { resolveStrapiMediaUrl } from "./resolve-strapi-media-url.ts";
import { ApiError, isApiError } from "./api-error.ts";
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
      headers: new Headers(),
      text: () => Promise.resolve(JSON.stringify(body)),
      json: () => Promise.resolve(body),
    }) as Promise<Response>) as typeof fetch;
}

function mockFetchStatus(status: number, statusText: string): typeof fetch {
  return (() =>
    Promise.resolve({
      ok: false,
      status,
      statusText,
      headers: new Headers(),
      text: () => Promise.resolve(""),
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
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk(publishedLearningPathListFixture) });
  const paths = await client.getPublishedLearningPaths();
  assert.equal(paths.length, 1);
  assert.equal(paths[0].slug, "react-native-performance");
  assert.equal(paths[0].lessonCount, 3);
});

test("getPublishedLearningPaths: non-2xx → ApiError kind=http", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchStatus(500, "Internal Server Error") });
  await assert.rejects(
    () => client.getPublishedLearningPaths(),
    (err: unknown) => isApiError(err) && err.kind === "http" && err.status === 500,
  );
});

test("getPublishedLearningPaths: fetch failure → ApiError kind=network", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchNetworkError("ECONNREFUSED"), defaultTimeoutMs: 100 });
  await assert.rejects(
    () => client.getPublishedLearningPaths(),
    (err: unknown) => isApiError(err) && err.kind === "network",
  );
});

test("getPublishedLearningPaths: AbortError → ApiError kind=aborted", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchAbort() });
  await assert.rejects(
    () => client.getPublishedLearningPaths(),
    (err: unknown) => isApiError(err) && err.kind === "aborted",
  );
});

test("getPublishedLearningPaths: 200 but invalid payload → ApiError kind=validation", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk({ wrong: true }) });
  await assert.rejects(
    () => client.getPublishedLearningPaths(),
    (err: unknown) => isApiError(err) && err.kind === "validation",
  );
});

test("getFeaturedLearningPaths: 200 valid response → LearningPath[]", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk(publishedLearningPathListFixture) });
  const paths = await client.getFeaturedLearningPaths();
  assert.equal(paths.length, 1);
  assert.equal(paths[0].featured, true);
});

test("getLearningPathBySlug: 200 with one match → LearningPath", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk(publishedLearningPathListFixture) });
  const lp = await client.getLearningPathBySlug("react-native-performance");
  assert.notEqual(lp, null);
  assert.equal(lp!.slug, "react-native-performance");
});

test("getLearningPathBySlug: 200 with empty list → null", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk({ data: [], meta: {} }) });
  const lp = await client.getLearningPathBySlug("nonexistent-slug");
  assert.equal(lp, null);
});

test("getLearningPathBySlug: empty slug → throws Error", async () => {
  const client = createPathwayApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk({ data: [], meta: {} }) });
  await assert.rejects(
    () => client.getLearningPathBySlug("   "),
    (err: unknown) => err instanceof Error && err.message === "slug must not be empty",
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
      headers: new Headers(),
      text: () => Promise.resolve(JSON.stringify(publishedLearningPathListFixture)),
      json: () => Promise.resolve(publishedLearningPathListFixture),
    }) as Promise<Response>;
  }) as typeof fetch;

  const client = createPathwayApiClient({ baseUrl: "http://localhost:1337/", fetch: fetchMock });
  await client.getPublishedLearningPaths();
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
