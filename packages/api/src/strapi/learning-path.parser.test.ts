/**
 * Contract tests for the LearningPath parser/mapper.
 *
 * Uses Node's built-in test runner (node:test) — no Jest/Vitest added.
 * Run: pnpm --filter @pathway/api test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { PathwayApiValidationError } from "../errors/pathway-api-validation-error.ts";
import {
  parseLearningPathResponse,
  parseLearningPathListResponse,
} from "./learning-path.parser.ts";
import {
  publishedLearningPathFixture,
  publishedLearningPathListFixture,
} from "../__fixtures__/learning-path.fixture.ts";

test("valid single payload maps to a clean LearningPath", () => {
  const lp = parseLearningPathResponse(publishedLearningPathFixture);

  assert.equal(lp.id, "lp-rn-perf-001");
  assert.equal(lp.slug, "react-native-performance");
  assert.equal(lp.title, "React Native Performance");
  assert.equal(lp.featured, true);
  assert.equal(lp.difficulty, "intermediate");
  assert.equal(lp.estimatedDuration, 180);
  assert.equal(lp.coverImage, null);
  assert.equal(lp.modules.length, 2);

  const firstModule = lp.modules[0];
  assert.equal(firstModule.id, "mod-renders-001");
  assert.equal(firstModule.order, 1);
  assert.equal(firstModule.lessons.length, 2);

  const firstLesson = firstModule.lessons[0];
  assert.equal(firstLesson.id, "les-renders-001");
  assert.equal(firstLesson.slug, "understanding-react-native-re-renders");
  assert.equal(firstLesson.estimatedDuration, 15);
  assert.equal(firstLesson.difficulty, "intermediate");
});

test("lessonCount is the sum of lessons across modules", () => {
  const lp = parseLearningPathResponse(publishedLearningPathFixture);
  // 2 lessons in module 1 + 1 lesson in module 2 = 3
  assert.equal(lp.lessonCount, 3);
});

test("valid list payload maps to an array of LearningPath", () => {
  const list = parseLearningPathListResponse(publishedLearningPathListFixture);
  assert.equal(list.length, 1);
  assert.equal(list[0].slug, "react-native-performance");
  assert.equal(list[0].lessonCount, 3);
});

test("invalid payload throws PathwayApiValidationError", () => {
  assert.throws(
    () => parseLearningPathResponse({ wrong: true }),
    (err: unknown) => err instanceof PathwayApiValidationError,
  );
});

test("invalid list payload throws PathwayApiValidationError", () => {
  assert.throws(
    () => parseLearningPathListResponse({ data: "not-an-array" }),
    (err: unknown) => err instanceof PathwayApiValidationError,
  );
});

test("missing optional relations do not break the parser", () => {
  // modules omitted entirely (populate not requested) -> empty array, count 0.
  const minimal = {
    data: {
      documentId: "lp-min-001",
      title: "Minimal Path",
      slug: "minimal-path",
      description: "No modules populated.",
      difficulty: "beginner",
      estimatedDurationMinutes: 30,
      featured: false,
    },
    meta: {},
  };
  const lp = parseLearningPathResponse(minimal);
  assert.deepEqual(lp.modules, []);
  assert.equal(lp.lessonCount, 0);
  assert.equal(lp.coverImage, null);
});

test("module with no lessons populated yields empty lessons array", () => {
  const withEmptyModule = {
    data: {
      documentId: "lp-empty-001",
      title: "Empty Module Path",
      slug: "empty-module-path",
      description: "Module exists but lessons not populated.",
      difficulty: "beginner",
      estimatedDurationMinutes: 10,
      featured: false,
      modules: [
        {
          documentId: "mod-empty-001",
          title: "Empty Module",
          order: 1,
          // lessons omitted
        },
      ],
    },
    meta: {},
  };
  const lp = parseLearningPathResponse(withEmptyModule);
  assert.equal(lp.modules.length, 1);
  assert.deepEqual(lp.modules[0].lessons, []);
  assert.equal(lp.lessonCount, 0);
});

test("populated cover image maps to ContentImage", () => {
  const withCover = {
    data: {
      documentId: "lp-cover-001",
      title: "Covered Path",
      slug: "covered-path",
      description: "Has a cover image.",
      difficulty: "advanced",
      estimatedDurationMinutes: 60,
      featured: false,
      coverImage: {
        url: "/uploads/cover.jpg",
        alternativeText: "Cover art",
        width: 1200,
        height: 630,
      },
    },
    meta: {},
  };
  const lp = parseLearningPathResponse(withCover);
  assert.notEqual(lp.coverImage, null);
  assert.equal(lp.coverImage!.url, "/uploads/cover.jpg");
  assert.equal(lp.coverImage!.alternativeText, "Cover art");
  assert.equal(lp.coverImage!.width, 1200);
  assert.equal(lp.coverImage!.height, 630);
});
