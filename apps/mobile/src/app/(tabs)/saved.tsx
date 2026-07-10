import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { SavedSegmentedControl, type SavedTab } from "@/components/saved/saved-segmented-control";
import { SavedLessonCard } from "@/components/saved/saved-lesson-card";
import { SavedPathCard } from "@/components/saved/saved-path-card";
import { SavedContentSkeleton } from "@/components/saved/saved-content-skeleton";
import { SavedEmptyState } from "@/components/saved/saved-empty-state";
import { UnavailableSavedContentNotice } from "@/components/saved/unavailable-notice";
import { ErrorState } from "@/components/ui/error-state";
import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
import { useLearningActivity } from "@/features/learning-activity/use-learning-activity";
import { usePublishedLearningPathsQuery } from "@/hooks/use-learning-paths";
import { getSavedLessons, getSavedPaths } from "@/lib/saved-content";

/**
 * Saved screen — shows persisted saved lessons and learning paths.
 * Segmented control switches between LESSONS and PATHS. Content is
 * resolved from real API data via @pathway/api; slugs that no longer
 * match published content are hidden but not deleted.
 */
export default function SavedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SavedTab>("lessons");

  const {
    savedLessonOrder,
    savedPathOrder,
    completedLessonSlugs,
    isHydrated,
    storageStatus,
    toggleLessonSaved,
    togglePathSaved,
  } = useLearningActivity();

  const { data: paths, isLoading, isFetching, isError, errorMessage, refetch } = usePublishedLearningPathsQuery();

  // Resolve saved lessons against the published path tree.
  const savedLessons = useMemo(() => {
    if (!paths) return { available: [], unavailableCount: 0 };
    return getSavedLessons(savedLessonOrder, paths);
  }, [savedLessonOrder, paths]);

  // Resolve saved paths against published paths.
  const savedPaths = useMemo(() => {
    if (!paths) return { available: [], unavailableCount: 0 };
    return getSavedPaths(savedPathOrder, paths);
  }, [savedPathOrder, paths]);

  const hasSavedLessons = savedLessonOrder.length > 0;
  const hasSavedPaths = savedPathOrder.length > 0;
  const hasAnySaved = hasSavedLessons || hasSavedPaths;

  // --- Hydration loading ---
  if (!isHydrated) {
    return (
      <Screen>
        <SavedHeader />
        <SavedSegmentedControl activeTab={activeTab} onSelect={setActiveTab} disabled />
        <SavedContentSkeleton />
      </Screen>
    );
  }

  // --- API error (only relevant if user has saved items) ---
  if (isError && hasAnySaved) {
    return (
      <Screen>
        <SavedHeader />
        <SavedSegmentedControl activeTab={activeTab} onSelect={setActiveTab} />
        <ErrorState
          message={errorMessage ?? "We couldn't load your saved content right now."}
          retryLabel="TRY AGAIN"
          onRetry={refetch}
          retryLoading={isFetching}
          secondaryLabel="BACK TO EXPLORE"
          onSecondary={() => router.navigate("/explore")}
        />
      </Screen>
    );
  }

  // --- API loading (has saved items, details still loading) ---
  if (isLoading && hasAnySaved) {
    return (
      <Screen>
        <SavedHeader />
        <SavedSegmentedControl activeTab={activeTab} onSelect={setActiveTab} />
        <SavedContentSkeleton />
      </Screen>
    );
  }

  return (
    <Screen>
      <SavedHeader />

      {/* Storage error notice — discrete, no modal. */}
      {storageStatus === "error" && (
        <View style={styles.storageNotice}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.storageText}>
            Local saved data could not be restored. Changes may only last for this session.
          </ThemedText>
        </View>
      )}

      <SavedSegmentedControl activeTab={activeTab} onSelect={setActiveTab} />

      {/* --- LESSONS tab --- */}
      {activeTab === "lessons" && (
        <View style={styles.content}>
          {savedLessons.available.length > 0 ? (
            <>
              {savedLessons.unavailableCount > 0 && (
                <UnavailableSavedContentNotice message="Some saved content is no longer available." />
              )}
              {savedLessons.available.map(({ lesson, pathTitle, pathSlug }) => (
                <SavedLessonCard
                  key={lesson.slug}
                  lesson={lesson}
                  pathTitle={pathTitle}
                  pathSlug={pathSlug}
                  isCompleted={!!completedLessonSlugs[lesson.slug]}
                  onRemove={() => toggleLessonSaved(lesson.slug)}
                />
              ))}
            </>
          ) : hasSavedLessons && savedLessons.unavailableCount > 0 ? (
            // All saved lessons are unavailable.
            <SavedEmptyState
              title="SAVED CONTENT UNAVAILABLE"
              description="Your saved items are not currently published or available."
              actionLabel="EXPLORE CONTENT"
              onAction={() => router.navigate("/explore")}
              icon="warning"
            />
          ) : (
            <SavedEmptyState
              title="NOTHING SAVED YET"
              description="Save lessons to return to them later."
              actionLabel="EXPLORE CONTENT"
              onAction={() => router.navigate("/explore")}
            />
          )}
        </View>
      )}

      {/* --- PATHS tab --- */}
      {activeTab === "paths" && (
        <View style={styles.content}>
          {savedPaths.available.length > 0 ? (
            <>
              {savedPaths.unavailableCount > 0 && (
                <UnavailableSavedContentNotice message="Some saved content is no longer available." />
              )}
              {savedPaths.available.map((path) => (
                <SavedPathCard
                  key={path.slug}
                  path={path}
                  completedLessonSlugs={completedLessonSlugs}
                  onRemove={() => togglePathSaved(path.slug)}
                />
              ))}
            </>
          ) : hasSavedPaths && savedPaths.unavailableCount > 0 ? (
            <SavedEmptyState
              title="SAVED CONTENT UNAVAILABLE"
              description="Your saved items are not currently published or available."
              actionLabel="EXPLORE CONTENT"
              onAction={() => router.navigate("/explore")}
              icon="warning"
            />
          ) : (
            <SavedEmptyState
              title="NO SAVED PATHS"
              description="Save a learning path to keep it close while you learn."
              actionLabel="EXPLORE CONTENT"
              onAction={() => router.navigate("/explore")}
            />
          )}
        </View>
      )}
    </Screen>
  );
}

/** Saved page header — title, divider, description. */
function SavedHeader() {
  return (
    <View style={styles.header}>
      <ThemedText style={styles.title}>SAVED CONTENT</ThemedText>
      <View style={styles.divider} />
      <ThemedText themeColor="textSecondary" style={styles.description}>
        Review and resume your saved lessons and learning paths.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
    paddingTop: Spacing.four,
  },
  title: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSize2xl,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 38,
    textTransform: "uppercase",
    color: tokens.color.black,
  },
  divider: {
    height: Border.primary,
    backgroundColor: tokens.color.black,
    width: "100%",
  },
  description: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 24,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  storageNotice: {
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    padding: Spacing.two,
    marginBottom: Spacing.two,
  },
  storageText: {
    fontFamily: Typography.bodyFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
});
