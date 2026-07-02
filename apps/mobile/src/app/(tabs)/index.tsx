import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import type { LearningPath, LessonPreview } from "@pathway/api";

import { CompactLessonCard } from "@/components/home/compact-lesson-card";
import { CompactPathCard } from "@/components/home/compact-path-card";
import { ContinueLearningCard } from "@/components/home/continue-learning-card";
import { FeaturedPathCard } from "@/components/home/featured-path-card";
import { HomeSkeleton } from "@/components/home/home-skeleton";
import { SectionHeader } from "@/components/home/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useFeaturedLearningPathsQuery } from "@/hooks/use-learning-paths";

// ponytail: display name until authentication exists (Part 2.7).
const DISPLAY_NAME = "Jonathan";

/** Maximum number of featured paths to show on Home. */
const MAX_FEATURED_PATHS = 3;
/** Maximum number of recommended lessons to show on Home. */
const MAX_RECOMMENDED_LESSONS = 3;

/** Time-based greeting based on local hour. */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}

/** Extract the first navigable lesson from a learning path's module tree. */
function getFirstLesson(path: LearningPath): LessonPreview | null {
  for (const module of path.modules) {
    if (module.lessons.length > 0) {
      return module.lessons[0];
    }
  }
  return null;
}

/** Flatten all lessons from all paths, limited to maxCount. */
function flattenLessons(paths: LearningPath[], maxCount: number): { lesson: LessonPreview; pathTitle: string }[] {
  const results: { lesson: LessonPreview; pathTitle: string }[] = [];
  for (const path of paths) {
    for (const module of path.modules) {
      for (const lesson of module.lessons) {
        results.push({ lesson, pathTitle: path.title });
        if (results.length >= maxCount) return results;
      }
    }
  }
  return results;
}

/**
 * Home screen — loads real published content from Strapi via @pathway/api.
 * Shows greeting, continue learning card, featured paths, recommended
 * lessons, and recently saved (empty state). No hardcoded content.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { data: paths, isLoading, isError, errorMessage, refetch } = useFeaturedLearningPathsQuery();

  // Derive data for sections from the real API response
  const allPaths = paths ?? [];
  const continuePath = allPaths[0] ?? null;
  const continueLesson = continuePath ? getFirstLesson(continuePath) : null;
  const featuredPaths = allPaths.slice(0, MAX_FEATURED_PATHS);
  const firstFeatured = featuredPaths[0] ?? null;
  const remainingPaths = featuredPaths.slice(1);
  const recommendedLessons = flattenLessons(allPaths, MAX_RECOMMENDED_LESSONS);

  // --- Loading ---
  if (isLoading) {
    return (
      <Screen>
        <HomeSkeleton />
      </Screen>
    );
  }

  // --- Error ---
  if (isError) {
    return (
      <Screen>
        <View style={styles.greeting}>
          <ThemedText style={styles.greetingLine}>{getGreeting()}</ThemedText>
          <ThemedText style={styles.greetingName}>{DISPLAY_NAME}.</ThemedText>
        </View>
        <ErrorState
          message={errorMessage ?? "We couldn't load the learning paths right now."}
          retryLabel="Try again"
          onRetry={refetch}
        />
      </Screen>
    );
  }

  // --- Empty ---
  if (allPaths.length === 0) {
    return (
      <Screen>
        <View style={styles.greeting}>
          <ThemedText style={styles.greetingLine}>{getGreeting()}</ThemedText>
          <ThemedText style={styles.greetingName}>{DISPLAY_NAME}.</ThemedText>
        </View>
        <EmptyState
          title="No learning content published yet"
          description="The catalog will be available here when content is published."
        />
      </Screen>
    );
  }

  // --- Content ---
  return (
    <Screen>
      {/* 1. Greeting */}
      <View style={styles.greeting}>
        <ThemedText style={styles.greetingLine}>{getGreeting()}</ThemedText>
        <ThemedText style={styles.greetingName}>{DISPLAY_NAME}.</ThemedText>
      </View>

      {/* 2. Continue Learning */}
      {continuePath && continueLesson ? (
        <ContinueLearningCard path={continuePath} lesson={continueLesson} />
      ) : (
        <EmptyState
          title="No learning content published yet"
          description="The catalog will be available here when content is published."
          actionLabel="Explore content"
          onAction={() => router.navigate("/explore")}
        />
      )}

      {/* 3. Featured Paths */}
      <View style={styles.section}>
        <SectionHeader title="Featured Paths" />
        <View style={styles.pathList}>
          {firstFeatured && <FeaturedPathCard path={firstFeatured} />}
          {remainingPaths.map((path) => (
            <CompactPathCard key={path.id} path={path} />
          ))}
        </View>
      </View>

      {/* 4. Recommended Lessons */}
      {recommendedLessons.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recommended Lessons" />
          <View style={styles.lessonList}>
            {recommendedLessons.map(({ lesson, pathTitle }) => (
              <CompactLessonCard key={lesson.id} lesson={lesson} pathTitle={pathTitle} />
            ))}
          </View>
        </View>
      )}

      {/* 5. Recently Saved — empty state (save/persistence arrives in Part 2.6) */}
      <View style={styles.section}>
        <SectionHeader title="Recently Saved" />
        <EmptyState
          title="Nothing saved yet"
          description="Save a path or lesson to return to it later."
          actionLabel="Explore content"
          onAction={() => router.navigate("/explore")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    gap: 0,
  },
  greetingLine: {
    fontFamily: "Epilogue",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    color: "#000000",
  },
  greetingName: {
    fontFamily: "Epilogue",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    color: "#000000",
  },
  section: {
    gap: Spacing.three,
  },
  pathList: {
    gap: Spacing.three,
  },
  lessonList: {
    gap: Spacing.two,
  },
});
