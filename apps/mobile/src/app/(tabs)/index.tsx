import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
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
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";
import { useLearningActivity } from "@/features/learning-activity/use-learning-activity";
import { useFeaturedLearningPathsQuery } from "@/hooks/use-learning-paths";
import { getRecentlySaved } from "@/lib/saved-content";
import { calculatePathProgress } from "@/components/lesson-detail/lesson-detail-utils";

// ponytail: display name until authentication exists (Part 2.7).
const DISPLAY_NAME = "Jonathan";

/** Maximum number of featured paths to show on Home. */
const MAX_FEATURED_PATHS = 3;
/** Maximum number of recommended lessons to show on Home. */
const MAX_RECOMMENDED_LESSONS = 3;
/** Maximum number of recently saved items to show on Home. */
const MAX_RECENTLY_SAVED = 3;

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
  const { savedLessonOrder, savedPathOrder, completedLessonSlugs, isHydrated } = useLearningActivity();

  // Derive data for sections from the real API response
  const allPaths = paths ?? [];
  const continuePath = allPaths[0] ?? null;
  const continueLesson = continuePath ? getFirstLesson(continuePath) : null;
  const featuredPaths = allPaths.slice(0, MAX_FEATURED_PATHS);
  const firstFeatured = featuredPaths[0] ?? null;
  const remainingPaths = featuredPaths.slice(1);
  const recommendedLessons = flattenLessons(allPaths, MAX_RECOMMENDED_LESSONS);

  // Calculate real progress for the continue-learning path.
  const continueProgress = useMemo(() => {
    if (!continuePath) return null;
    return calculatePathProgress(continuePath, completedLessonSlugs);
  }, [continuePath, completedLessonSlugs]);

  // Resolve recently saved items from persisted slugs + real API data.
  const recentlySaved = useMemo(() => {
    if (!paths || !isHydrated) return [];
    return getRecentlySaved(savedLessonOrder, savedPathOrder, paths, MAX_RECENTLY_SAVED);
  }, [paths, isHydrated, savedLessonOrder, savedPathOrder]);

  const hasSavedItems = savedLessonOrder.length > 0 || savedPathOrder.length > 0;

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
          secondaryLabel="Back to Explore"
          onSecondary={() => router.navigate("/explore")}
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
        <ContinueLearningCard
          path={continuePath}
          lesson={continueLesson}
          progressPercentage={continueProgress?.percentage ?? 0}
          restoringProgress={!isHydrated}
        />
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

      {/* 5. Recently Saved — uses persisted state */}
      <View style={styles.section}>
        <SectionHeader title="Recently Saved" />
        {!isHydrated ? (
          // Skeleton while hydrating — no empty state yet.
          <View style={styles.recentlySavedSkeleton} accessibilityRole="alert" accessibilityLabel="Loading">
            <View style={styles.recentlySavedSkeletonCard} />
            <View style={styles.recentlySavedSkeletonCard} />
          </View>
        ) : recentlySaved.length > 0 ? (
          <View style={styles.recentlySavedList}>
            {recentlySaved.map((item) =>
              item.type === "lesson" ? (
                <RecentlySavedLessonCard
                  key={`lesson-${item.lesson.slug}`}
                  lesson={item.lesson}
                  pathTitle={item.pathTitle}
                />
              ) : (
                <RecentlySavedPathCard
                  key={`path-${item.path.slug}`}
                  path={item.path}
                />
              ),
            )}
          </View>
        ) : hasSavedItems ? (
          // Saved slugs exist but none are currently available.
          <EmptyState
            title="SAVED CONTENT UNAVAILABLE"
            description="Your saved items are not currently published or available."
            actionLabel="EXPLORE CONTENT"
            onAction={() => router.navigate("/explore")}
            icon="warning"
          />
        ) : (
          <EmptyState
            title="NOTHING SAVED YET"
            description="Save a path or lesson to return to it later."
            actionLabel="EXPLORE CONTENT"
            onAction={() => router.navigate("/explore")}
          />
        )}
      </View>
    </Screen>
  );
}

/** Compact recently-saved lesson card for Home. */
function RecentlySavedLessonCard({ lesson, pathTitle }: { lesson: LessonPreview; pathTitle: string }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title} from ${pathTitle}. Opens lesson.`}
      onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
      style={({ pressed }) => [styles.recentCard, pressed && styles.recentCardPressed]}
    >
      <View style={styles.recentCardTop}>
        <Tag backgroundColor="#79FF5B">LESSON</Tag>
        <View style={styles.recentCardArrow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
            size={14}
            tintColor="#000000"
          />
        </View>
      </View>
      <ThemedText style={styles.recentCardTitle} numberOfLines={2}>{lesson.title}</ThemedText>
      {pathTitle ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.recentCardContext} numberOfLines={1}>
          {pathTitle}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

/** Compact recently-saved path card for Home. */
function RecentlySavedPathCard({ path }: { path: LearningPath }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${path.title}. Opens learning path details.`}
      onPress={() => router.navigate(`/paths/${path.slug}`)}
      style={({ pressed }) => [styles.recentCard, pressed && styles.recentCardPressed]}
    >
      <View style={styles.recentCardTop}>
        <Tag backgroundColor="#D4E7DD">PATH</Tag>
        <View style={styles.recentCardArrow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
            size={14}
            tintColor="#000000"
          />
        </View>
      </View>
      <ThemedText style={styles.recentCardTitle} numberOfLines={2}>{path.title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.recentCardContext} numberOfLines={1}>
        {path.lessonCount} lessons
      </ThemedText>
    </Pressable>
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
  recentlySavedList: {
    gap: Spacing.two,
  },
  recentlySavedSkeleton: {
    gap: Spacing.two,
  },
  recentlySavedSkeletonCard: {
    height: 80,
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  recentCard: {
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
    gap: Spacing.one,
  },
  recentCardPressed: {
    opacity: 0.7,
  },
  recentCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentCardArrow: {
    width: 28,
    height: 28,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  recentCardTitle: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    color: "#000000",
  },
  recentCardContext: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
});
