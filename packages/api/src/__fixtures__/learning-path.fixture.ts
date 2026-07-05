/**
 * Fixture mirroring the REAL Strapi 5 REST response for a published LearningPath.
 *
 * Based on apps/cms content-type schemas and the seed (React Native Performance path).
 * Strapi 5 flat format: fields direct on `data`, oneToMany as bare array `[...]`,
 * media as bare object or null, documentId + id on every document.
 *
 * Internal use (tests only) — not exported from the package entrypoint.
 */

export const publishedLearningPathFixture = {
  data: {
    id: 1,
    documentId: "lp-rn-perf-001",
    title: "React Native Performance",
    slug: "react-native-performance",
    description:
      "Identify, diagnose, and fix performance bottlenecks in React Native apps.",
    coverImage: null,
    difficulty: "intermediate",
    estimatedDurationMinutes: 180,
    featured: true,
    createdAt: "2026-06-30T10:00:00.000Z",
    updatedAt: "2026-06-30T10:00:00.000Z",
    publishedAt: "2026-06-30T10:00:00.000Z",
    locale: null,
    category: {
      id: 30,
      documentId: "cat-mobile-001",
      name: "Mobile",
      slug: "mobile",
      description: "Mobile engineering learning content.",
      createdAt: "2026-06-30T10:00:00.000Z",
      updatedAt: "2026-06-30T10:00:00.000Z",
      publishedAt: null,
      locale: null,
    },
    modules: [
      {
        id: 10,
        documentId: "mod-renders-001",
        title: "Understanding Re-renders",
        description: "How React Native decides to re-render and how to control it.",
        order: 1,
        createdAt: "2026-06-30T10:00:00.000Z",
        updatedAt: "2026-06-30T10:00:00.000Z",
        publishedAt: null,
        lessons: [
          {
            id: 20,
            documentId: "les-renders-001",
            title: "Understanding React Native Re-renders",
            slug: "understanding-react-native-re-renders",
            summary: "Learn what triggers a re-render in React Native.",
            estimatedDurationMinutes: 15,
            difficulty: "intermediate",
            createdAt: "2026-06-30T10:00:00.000Z",
            updatedAt: "2026-06-30T10:00:00.000Z",
            publishedAt: "2026-06-30T10:00:00.000Z",
            locale: null,
          },
          {
            id: 21,
            documentId: "les-memo-001",
            title: "Memoization Done Right",
            slug: "memoization-done-right",
            summary: "When to use React.memo, useCallback, and useMemo.",
            estimatedDurationMinutes: 12,
            difficulty: "intermediate",
            createdAt: "2026-06-30T10:00:00.000Z",
            updatedAt: "2026-06-30T10:00:00.000Z",
            publishedAt: "2026-06-30T10:00:00.000Z",
            locale: null,
          },
        ],
      },
      {
        id: 11,
        documentId: "mod-lists-001",
        title: "Lists and Virtualization",
        description: "Render long lists without dropping frames.",
        order: 2,
        createdAt: "2026-06-30T10:00:00.000Z",
        updatedAt: "2026-06-30T10:00:00.000Z",
        publishedAt: null,
        lessons: [
          {
            id: 22,
            documentId: "les-flashlist-001",
            title: "Optimizing Long Lists with FlashList",
            slug: "optimizing-long-lists-with-flashlist",
            summary: "Replace FlatList with FlashList for recycling.",
            estimatedDurationMinutes: 15,
            difficulty: "intermediate",
            createdAt: "2026-06-30T10:00:00.000Z",
            updatedAt: "2026-06-30T10:00:00.000Z",
            publishedAt: "2026-06-30T10:00:00.000Z",
            locale: null,
          },
        ],
      },
    ],
  },
  meta: {},
};

/** List envelope with one published path. */
export const publishedLearningPathListFixture = {
  data: [publishedLearningPathFixture.data],
  meta: {
    pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 },
  },
};

/**
 * Fixture mirroring the REAL Strapi 5 REST response for a published Lesson.
 *
 * Strapi 5 flat format: fields direct on `data`, manyToOne relations as
 * bare object or null, media as bare object or null, documentId + id on
 * every document. The `body` field is a richtext field configured with
 * the default Markdown editor — Strapi returns it as a plain Markdown
 * string (not a JSON array of blocks).
 *
 * Internal use (tests only) — not exported from the package entrypoint.
 */
export const publishedLessonFixture = {
  data: [
    {
      id: 2,
      documentId: "les-renders-001",
      title: "Understanding React Native Re-renders",
      slug: "understanding-react-native-re-renders",
      summary:
        "Learn what triggers a re-render in React Native and why unnecessary re-renders slow down your app.",
      body: "## Why re-renders matter\n\nEvery re-render runs your component function and reconciles the virtual tree.\n\n## Common triggers\n\n- Parent re-renders without memoized children\n- New object/array literals in props",
      videoUrl: null,
      estimatedDurationMinutes: 15,
      difficulty: "intermediate",
      createdAt: "2026-06-30T10:00:00.000Z",
      updatedAt: "2026-06-30T10:00:00.000Z",
      publishedAt: "2026-06-30T10:00:00.000Z",
      videoThumbnail: null,
      category: {
        id: 1,
        documentId: "cat-mobile-001",
        name: "Mobile",
        slug: "mobile",
        description: null,
        createdAt: "2026-06-30T10:00:00.000Z",
        updatedAt: "2026-06-30T10:00:00.000Z",
        publishedAt: "2026-06-30T10:00:00.000Z",
      },
      learningPath: {
        id: 2,
        documentId: "lp-rn-perf-001",
        title: "React Native Performance",
        slug: "react-native-performance",
        description:
          "Identify, diagnose, and fix performance bottlenecks in React Native apps.",
        createdAt: "2026-06-30T10:00:00.000Z",
        updatedAt: "2026-06-30T10:00:00.000Z",
        publishedAt: "2026-06-30T10:00:00.000Z",
      },
      module: {
        id: 1,
        documentId: "mod-renders-001",
        title: "Understanding Re-renders",
        description: "How React Native decides to re-render and how to control it.",
        order: 1,
        createdAt: "2026-06-30T10:00:00.000Z",
        updatedAt: "2026-06-30T10:00:00.000Z",
        publishedAt: "2026-06-30T10:00:00.000Z",
      },
      author: {
        id: 1,
        documentId: "auth-001",
        name: "Jonathan Ramalho",
        shortBio:
          "React Native and Expo engineer focused on production mobile apps.",
        email: null,
        createdAt: "2026-06-30T10:00:00.000Z",
        updatedAt: "2026-06-30T10:00:00.000Z",
        publishedAt: "2026-06-30T10:00:00.000Z",
        avatar: null,
      },
    },
  ],
  meta: {
    pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 },
  },
};

/** List envelope with no published lessons (missing slug). */
export const emptyLessonListFixture = {
  data: [],
  meta: {
    pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
  },
};
