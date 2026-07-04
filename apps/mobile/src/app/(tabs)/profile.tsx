import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { ActivePathCard } from "@/components/profile/active-path-card";
import { CompletedLessonRow } from "@/components/profile/completed-lesson-row";
import { CompletedPathCard } from "@/components/profile/completed-path-card";
import { LearningOverviewGrid } from "@/components/profile/learning-overview-grid";
import { LocalLearningDataNotice } from "@/components/profile/local-learning-data-notice";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";
import { useLearningActivity } from "@/features/learning-activity/use-learning-activity";
import { usePublishedLearningPathsQuery } from "@/hooks/use-learning-paths";
import {
  buildLearningOverview,
  getActiveLearningPaths,
  getAvailableCompletedLessons,
  getCompletedLearningPaths,
} from "@/lib/profile-learning.utils";

/** Maximum active/completed paths to show. */
const MAX_ACTIVE_PATHS = 3;
const MAX_COMPLETED_PATHS = 3;
/** Maximum completed lessons to show. */
const MAX_COMPLETED_LESSONS = 4;

/**
 * Profile screen — demo learning profile with real metrics derived
 * from published CMS content and local persisted activity state.
 *
 * No authentication, no fake stats, no streaks, no certificates.
 * The profile is transparent about being a local-only demo.
 */
export default function ProfileScreen() {
  const router = useRouter();

  const {
    completedLessonSlugs,
    completedLessonOrder,
    savedLessonOrder,
    savedPathOrder,
    isHydrated,
    storageStatus,
  } = useLearningActivity();

  const { data: paths, isLoading: pathsLoading, isError: pathsError, errorMessage, refetch } = usePublishedLearningPathsQuery();

  // --- Derive all metrics from real API data + local state ---
  const overview = useMemo(() => {
    if (!paths) return null;
    return buildLearningOverview(
      paths,
      completedLessonSlugs,
      completedLessonOrder,
      savedLessonOrder,
      savedPathOrder,
    );
  }, [paths, completedLessonSlugs, completedLessonOrder, savedLessonOrder, savedPathOrder]);

  const activePaths = useMemo(() => {
    if (!paths) return [];
    return getActiveLearningPaths(paths, completedLessonSlugs).slice(0, MAX_ACTIVE_PATHS);
  }, [paths, completedLessonSlugs]);

  const completedPaths = useMemo(() => {
    if (!paths) return [];
    return getCompletedLearningPaths(paths, completedLessonSlugs).slice(0, MAX_COMPLETED_PATHS);
  }, [paths, completedLessonSlugs]);

  const completedLessons = useMemo(() => {
    if (!paths) return { available: [], unavailableCount: 0 };
    return getAvailableCompletedLessons(completedLessonOrder, paths);
  }, [paths, completedLessonOrder]);

  const hasAnyLocalActivity =
    completedLessonOrder.length > 0 || savedLessonOrder.length > 0 || savedPathOrder.length > 0;

  // --- Hydration loading: skeleton, no empty states, no 0 values ---
  if (!isHydrated) {
    return (
      <Screen>
        <ProfileSkeleton />
      </Screen>
    );
  }

  return (
    <Screen>
      {/* 1. Profile hero */}
      <ProfileHero />

      {/* Storage warning — discrete, only when storage failed */}
      {storageStatus === "error" && (
        <View style={styles.storageWarning}>
          <ThemedText type="small" style={styles.storageWarningText}>
            Local learning data could not be fully restored. Recent changes may only last for this session.
          </ThemedText>
        </View>
      )}

      {/* 2. Activity overview — depends on CMS data */}
      {pathsLoading && !paths ? (
        <View style={styles.section}>
          <SectionHeader title="LEARNING OVERVIEW" />
          <View style={styles.overviewSkeleton}>
            <View style={styles.overviewSkeletonCard} />
            <View style={styles.overviewSkeletonCard} />
            <View style={styles.overviewSkeletonCard} />
            <View style={styles.overviewSkeletonCard} />
          </View>
        </View>
      ) : pathsError ? (
        <View style={styles.section}>
          <SectionHeader title="LEARNING OVERVIEW" />
          <ErrorState
            message={errorMessage ?? "We couldn't load your learning activity right now."}
            retryLabel="TRY AGAIN"
            onRetry={refetch}
          />
        </View>
      ) : overview ? (
        <View style={styles.section}>
          <SectionHeader title="LEARNING OVERVIEW" />
          <LearningOverviewGrid overview={overview} />
          {overview.unavailableActivityCount > 0 && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.unavailableNotice}>
              Some local learning activity is linked to content that is no longer available.
            </ThemedText>
          )}
        </View>
      ) : null}

      {/* 3. Active paths */}
      {pathsError ? null : pathsLoading && !paths ? (
        <View style={styles.section}>
          <SectionHeader title="ACTIVE PATHS" />
          <View style={styles.pathSkeleton} />
          <View style={styles.pathSkeleton} />
        </View>
      ) : (
        <View style={styles.section}>
          <SectionHeader title="ACTIVE PATHS" />
          {activePaths.length > 0 ? (
            <View style={styles.cardList}>
              {activePaths.map((path) => (
                <ActivePathCard
                  key={path.slug}
                  path={path}
                  completedLessonSlugs={completedLessonSlugs}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              title="NO ACTIVE PATHS"
              description="Complete a lesson to start tracking progress here."
              actionLabel="EXPLORE CONTENT"
              onAction={() => router.navigate("/explore")}
            />
          )}
        </View>
      )}

      {/* 4. Completed paths */}
      {pathsError ? null : pathsLoading && !paths ? null : (
        <View style={styles.section}>
          <SectionHeader title="COMPLETED PATHS" />
          {completedPaths.length > 0 ? (
            <View style={styles.cardList}>
              {completedPaths.map((path) => (
                <CompletedPathCard key={path.slug} path={path} />
              ))}
            </View>
          ) : (
            <EmptyState
              title="NO COMPLETED PATHS YET"
              description="Finish every lesson in a path to see it here."
              actionLabel={activePaths.length === 0 && completedLessons.available.length === 0 ? "EXPLORE CONTENT" : undefined}
              onAction={activePaths.length === 0 && completedLessons.available.length === 0 ? () => router.navigate("/explore") : undefined}
            />
          )}
        </View>
      )}

      {/* 5. Completed lessons */}
      {pathsError ? null : pathsLoading && !paths ? null : (
        <View style={styles.section}>
          <SectionHeader title="RECENTLY COMPLETED LESSONS" />
          {completedLessons.available.length > 0 ? (
            <View style={styles.cardList}>
              {completedLessons.available.slice(0, MAX_COMPLETED_LESSONS).map(({ lesson, pathTitle }) => (
                <CompletedLessonRow
                  key={lesson.slug}
                  lesson={lesson}
                  pathTitle={pathTitle}
                />
              ))}
            </View>
          ) : hasAnyLocalActivity && completedLessons.unavailableCount > 0 ? (
            // Had completed lessons but none are published anymore.
            <EmptyState
              title="NO COMPLETED LESSONS"
              description="Your completed lessons are not currently published or available."
              actionLabel="EXPLORE CONTENT"
              onAction={() => router.navigate("/explore")}
            />
          ) : (
            <EmptyState
              title="NO COMPLETED LESSONS"
              description="Finish a lesson to build your learning history."
              actionLabel="EXPLORE CONTENT"
              onAction={() => router.navigate("/explore")}
            />
          )}
        </View>
      )}

      {/* 6. Local progress notice */}
      <LocalLearningDataNotice />
    </Screen>
  );
}

/** Section header — Epilogue uppercase title with 3px black divider. */
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.sectionDivider} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  sectionHeader: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontFamily: "Epilogue",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#000000",
  },
  sectionDivider: {
    height: Border.primary,
    backgroundColor: "#000000",
    width: "100%",
  },
  cardList: {
    gap: Spacing.three,
  },
  storageWarning: {
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
  },
  storageWarningText: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "#000000",
  },
  unavailableNotice: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  overviewSkeleton: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  overviewSkeletonCard: {
    width: "48%",
    flexGrow: 1,
    height: 100,
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  pathSkeleton: {
    height: 90,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
});
