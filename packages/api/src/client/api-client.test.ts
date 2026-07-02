/**
 * Tests for the ApiClient — timeout, retry, abort, validation, error normalization.
 *
 * Uses node:test with mock fetch — no real Strapi calls.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { ApiClient } from "./api-client.ts";
import { ApiError, isApiError, toUserFacingError, serializeApiError } from "./api-error.ts";
import {
  learningPathListResponseSchema,
} from "../strapi/learning-path.schema.ts";
import { mapLearningPath } from "../strapi/learning-path.mapper.ts";
import {
  publishedLearningPathListFixture,
} from "../__fixtures__/learning-path.fixture.ts";

const BASE_URL = "http://localhost:1337";

// ---------------------------------------------------------------------------
// Mock fetch helpers
// ---------------------------------------------------------------------------

type FetchMock = typeof fetch;

function mockFetchOk(body: unknown): FetchMock {
  const fn = (): Promise<Response> =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(undefined),
      text: () => Promise.resolve(JSON.stringify(body)),
      json: () => Promise.resolve(body),
    } as Response);
  return fn as FetchMock;
}

function mockFetchStatus(status: number, statusText: string, headers?: Record<string, string>): FetchMock {
  const fn = (): Promise<Response> =>
    Promise.resolve({
      ok: false,
      status,
      statusText,
      headers: new Headers(headers ?? undefined),
      text: () => Promise.resolve(""),
      json: () => Promise.resolve({}),
    } as Response);
  return fn as FetchMock;
}

function mockFetchNetworkError(message: string): FetchMock {
  const fn = (): Promise<Response> => Promise.reject(new TypeError(message));
  return fn as FetchMock;
}

function mockFetchAbort(): FetchMock {
  const fn = (): Promise<Response> => {
    const err = new Error("aborted");
    err.name = "AbortError";
    return Promise.reject(err);
  };
  return fn as FetchMock;
}

function mockFetchSequence(...mocks: FetchMock[]): FetchMock {
  let index = 0;
  const fn = (_input?: unknown): Promise<Response> => {
    const mock = mocks[index] ?? mocks[mocks.length - 1];
    index++;
    return (mock as (url: string) => Promise<Response>)("http://localhost");
  };
  return fn as FetchMock;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test("ApiClient: valid response with schema → validated domain model", async () => {
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk(publishedLearningPathListFixture) });
  const data = await client.request({
    method: "GET",
    path: "/api/learning-paths",
    schema: learningPathListResponseSchema,
  });
  const paths = data.data.map(mapLearningPath);
  assert.equal(paths.length, 1);
  assert.equal(paths[0].slug, "react-native-performance");
  assert.equal(paths[0].lessonCount, 3);
});

test("ApiClient: HTTP 500 → ApiError kind=http, retriable=true", async () => {
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: mockFetchStatus(500, "Internal Server Error") });
  await assert.rejects(
    () => client.request({ method: "GET", path: "/api/learning-paths", noRetry: true }),
    (err: unknown) => isApiError(err) && err.kind === "http" && err.status === 500 && err.retriable === true,
  );
});

test("ApiClient: HTTP 404 → ApiError kind=http, retriable=false", async () => {
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: mockFetchStatus(404, "Not Found") });
  await assert.rejects(
    () => client.request({ method: "GET", path: "/api/learning-paths", noRetry: true }),
    (err: unknown) => isApiError(err) && err.kind === "http" && err.status === 404 && err.retriable === false,
  );
});

test("ApiClient: network error → ApiError kind=network, retriable=true", async () => {
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: mockFetchNetworkError("ECONNREFUSED"), defaultTimeoutMs: 100 });
  await assert.rejects(
    () => client.request({ method: "GET", path: "/api/learning-paths", noRetry: true }),
    (err: unknown) => isApiError(err) && err.kind === "network" && err.retriable === true,
  );
});

test("ApiClient: manual abort → ApiError kind=aborted, retriable=false", async () => {
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: mockFetchAbort() });
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    () => client.request({ method: "GET", path: "/api/learning-paths", signal: controller.signal, noRetry: true }),
    (err: unknown) => isApiError(err) && err.kind === "aborted" && err.retriable === false,
  );
});

test("ApiClient: invalid payload → ApiError kind=validation", async () => {
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: mockFetchOk({ wrong: true }) });
  await assert.rejects(
    () => client.request({
      method: "GET",
      path: "/api/learning-paths",
      schema: learningPathListResponseSchema,
      noRetry: true,
    }),
    (err: unknown) => isApiError(err) && err.kind === "validation",
  );
});

test("ApiClient: retry on 503 then success", async () => {
  const fetchMock = mockFetchSequence(
    mockFetchStatus(503, "Service Unavailable"),
    mockFetchOk(publishedLearningPathListFixture),
  );
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: fetchMock, defaultTimeoutMs: 1000 });

  const data = await client.request({
    method: "GET",
    path: "/api/learning-paths",
    schema: learningPathListResponseSchema,
  });
  assert.equal(data.data.length, 1);
});

test("ApiClient: retry on network error then success", async () => {
  const fetchMock = mockFetchSequence(
    mockFetchNetworkError("ECONNREFUSED"),
    mockFetchOk(publishedLearningPathListFixture),
  );
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: fetchMock, defaultTimeoutMs: 1000 });

  const data = await client.request({
    method: "GET",
    path: "/api/learning-paths",
    schema: learningPathListResponseSchema,
  });
  assert.equal(data.data.length, 1);
});

test("ApiClient: no retry for POST on network error", async () => {
  let callCount = 0;
  const fetchMock = (() => {
    callCount++;
    return Promise.reject(new TypeError("ECONNREFUSED"));
  }) as FetchMock;
  const client = new ApiClient({ baseUrl: BASE_URL, fetch: fetchMock, defaultTimeoutMs: 100 });

  await assert.rejects(
    () => client.request({ method: "POST", path: "/api/test", body: { foo: 1 } }),
    (err: unknown) => isApiError(err) && err.kind === "network",
  );
  // POST should not retry — only 1 call.
  assert.equal(callCount, 1);
});

test("ApiClient: query params serialized correctly", async () => {
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
  }) as FetchMock;

  const client = new ApiClient({ baseUrl: BASE_URL, fetch: fetchMock });
  await client.request({
    method: "GET",
    path: "/api/learning-paths",
    query: { "filters[featured][$eq]": "true", "pagination[pageSize]": 10 },
    schema: learningPathListResponseSchema,
  });
  // URLSearchParams encodes [ ] as %5B %5D — check decoded form.
  assert.ok(capturedUrl.includes("filters%5Bfeatured%5D%5B%24eq%5D=true") || capturedUrl.includes("filters[featured][$eq]=true"));
  assert.ok(capturedUrl.includes("pagination%5BpageSize%5D=10") || capturedUrl.includes("pagination[pageSize]=10"));
});

test("ApiClient: baseUrl trailing slash normalized", async () => {
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
  }) as FetchMock;

  const client = new ApiClient({ baseUrl: "http://localhost:1337/", fetch: fetchMock });
  await client.request({ method: "GET", path: "/api/learning-paths", schema: learningPathListResponseSchema });
  assert.ok(capturedUrl.startsWith("http://localhost:1337/api/"));
  assert.ok(!capturedUrl.includes("//api/"));
});

test("ApiClient: request-id header is set", async () => {
  let capturedHeaders: Headers | undefined;
  const fetchMock = ((_url: string, init: RequestInit) => {
    capturedHeaders = init.headers as Headers;
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      text: () => Promise.resolve(JSON.stringify(publishedLearningPathListFixture)),
      json: () => Promise.resolve(publishedLearningPathListFixture),
    }) as Promise<Response>;
  }) as FetchMock;

  const client = new ApiClient({ baseUrl: BASE_URL, fetch: fetchMock });
  await client.request({ method: "GET", path: "/api/learning-paths", schema: learningPathListResponseSchema });
  assert.ok(capturedHeaders);
  // Headers may be a plain object or a Headers instance.
  const requestId = capturedHeaders instanceof Headers
    ? capturedHeaders.get("X-Request-Id")
    : (capturedHeaders as Record<string, string>)["X-Request-Id"];
  assert.ok(requestId?.startsWith("pw_"));
});

// ---------------------------------------------------------------------------
// ApiError utility tests
// ---------------------------------------------------------------------------

test("toUserFacingError: 404 → not-found", () => {
  const err = new ApiError({ kind: "http", message: "test", status: 404, retriable: false });
  assert.equal(toUserFacingError(err), "not-found");
});

test("toUserFacingError: 429 → rate-limited", () => {
  const err = new ApiError({ kind: "http", message: "test", status: 429, retriable: true });
  assert.equal(toUserFacingError(err), "rate-limited");
});

test("toUserFacingError: network → network-unavailable", () => {
  const err = new ApiError({ kind: "network", message: "test", retriable: true });
  assert.equal(toUserFacingError(err), "network-unavailable");
});

test("toUserFacingError: non-ApiError → generic-error", () => {
  assert.equal(toUserFacingError(new Error("random")), "generic-error");
});

test("serializeApiError: produces plain object", () => {
  const err = new ApiError({
    kind: "http",
    message: "test",
    status: 500,
    method: "GET",
    url: "http://example.com",
    requestId: "pw_123",
    retriable: true,
  });
  const serialized = serializeApiError(err);
  assert.equal(serialized.kind, "http");
  assert.equal(serialized.status, 500);
  assert.equal(serialized.retriable, true);
  assert.equal(serialized.requestId, "pw_123");
});

test("serializeApiError: non-ApiError → fallback", () => {
  const serialized = serializeApiError(new Error("random"));
  assert.equal(serialized.kind, "network");
  assert.equal(serialized.retriable, false);
});

test("isApiError: true for ApiError, false for others", () => {
  assert.ok(isApiError(new ApiError({ kind: "network", message: "x", retriable: false })));
  assert.ok(!isApiError(new Error("x")));
  assert.ok(!isApiError("string"));
});
