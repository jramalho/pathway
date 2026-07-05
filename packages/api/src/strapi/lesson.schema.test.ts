/**
 * Contract tests for the Lesson schema and mapper.
 *
 * Verifies the Zod schema matches the REAL Strapi 5 REST response for a
 * published Lesson (Markdown body string, learningPath/module relations)
 * and that the mapper produces a clean LessonDetail domain model.
 *
 * Uses Node's built-in test runner (node:test) — no Jest/Vitest added.
 * Run: pnpm --filter @pathway/api test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { lessonListResponseSchema } from "./lesson.schema.ts";
import { mapLessonDetail } from "./lesson.mapper.ts";
import {
  publishedLessonFixture,
  emptyLessonListFixture,
} from "../__fixtures__/learning-path.fixture.ts";

test("lesson list schema accepts a real Strapi response with Markdown body", () => {
  const result = lessonListResponseSchema.safeParse(publishedLessonFixture);
  assert.ok(result.success, `Schema rejected valid payload: ${JSON.stringify(result.error?.issues)}`);
  assert.equal(result.data.data.length, 1);
  const doc = result.data.data[0];
  assert.equal(doc.documentId, "les-renders-001");
  assert.equal(doc.slug, "understanding-react-native-re-renders");
  assert.equal(typeof doc.body, "string");
  assert.ok(doc.body.startsWith("## Why re-renders matter"));
});

test("mapLessonDetail maps a validated document to a clean LessonDetail", () => {
  const parsed = lessonListResponseSchema.safeParse(publishedLessonFixture);
  assert.ok(parsed.success);
  const lesson = mapLessonDetail(parsed.data.data[0]);

  assert.equal(lesson.id, "les-renders-001");
  assert.equal(lesson.slug, "understanding-react-native-re-renders");
  assert.equal(lesson.title, "Understanding React Native Re-renders");
  assert.equal(lesson.summary, "Learn what triggers a re-render in React Native and why unnecessary re-renders slow down your app.");
  assert.equal(typeof lesson.body, "string");
  assert.equal(lesson.estimatedDuration, 15);
  assert.equal(lesson.difficulty, "intermediate");
  assert.equal(lesson.videoUrl, null);
  assert.equal(lesson.videoThumbnail, null);
  assert.equal(lesson.publishedAt, "2026-06-30T10:00:00.000Z");

  // Author
  assert.equal(lesson.author?.id, "auth-001");
  assert.equal(lesson.author?.name, "Jonathan Ramalho");
  assert.equal(lesson.author?.shortBio, "React Native and Expo engineer focused on production mobile apps.");
  assert.equal(lesson.author?.avatar, null);

  // Category
  assert.equal(lesson.category?.id, "cat-mobile-001");
  assert.equal(lesson.category?.name, "Mobile");
  assert.equal(lesson.category?.slug, "mobile");

  // Learning path context
  assert.equal(lesson.learningPath?.id, "lp-rn-perf-001");
  assert.equal(lesson.learningPath?.title, "React Native Performance");
  assert.equal(lesson.learningPath?.slug, "react-native-performance");
  assert.equal(lesson.learningPath?.description, "Identify, diagnose, and fix performance bottlenecks in React Native apps.");

  // Module context
  assert.equal(lesson.module?.id, "mod-renders-001");
  assert.equal(lesson.module?.title, "Understanding Re-renders");
  assert.equal(lesson.module?.order, 1);
});

test("lesson list schema accepts an empty list (missing slug)", () => {
  const result = lessonListResponseSchema.safeParse(emptyLessonListFixture);
  assert.ok(result.success);
  assert.equal(result.data.data.length, 0);
});

test("lesson schema rejects a non-string body (Blocks format is not used)", () => {
  const invalidBody = {
    data: [
      {
        documentId: "les-bad-001",
        title: "Bad Lesson",
        slug: "bad-lesson",
        summary: "Summary.",
        body: [{ type: "paragraph", children: [{ type: "text", text: "no" }] }],
        estimatedDurationMinutes: 10,
        difficulty: "beginner",
      },
    ],
    meta: {},
  };
  const result = lessonListResponseSchema.safeParse(invalidBody);
  assert.equal(result.success, false);
});

test("mapLessonDetail maps null relations to null", () => {
  const minimal = {
    documentId: "les-min-001",
    title: "Minimal Lesson",
    slug: "minimal-lesson",
    summary: "No relations populated.",
    body: "## Minimal\n\nBody text.",
    estimatedDurationMinutes: 5,
    difficulty: "beginner" as const,
    publishedAt: "2026-06-30T10:00:00.000Z",
  };
  const lesson = mapLessonDetail(minimal);
  assert.equal(lesson.author, null);
  assert.equal(lesson.category, null);
  assert.equal(lesson.learningPath, null);
  assert.equal(lesson.module, null);
  assert.equal(lesson.videoUrl, null);
  assert.equal(lesson.videoThumbnail, null);
  assert.equal(lesson.body, "## Minimal\n\nBody text.");
});
