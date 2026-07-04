import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { KeyTakeawayCard } from "@/components/lesson-detail/key-takeaway-card";
import { LessonBodyRenderer } from "@/components/lesson-detail/lesson-body-renderer";
import { LessonCompletionCard } from "@/components/lesson-detail/lesson-completion-card";
import { LessonContextLink } from "@/components/lesson-detail/lesson-context-link";
import { LessonDetailHeader } from "@/components/lesson-detail/lesson-detail-header";
import { LessonDetailSkeleton } from "@/components/lesson-detail/lesson-detail-skeleton";
import { LessonMediaPreview } from "@/components/lesson-detail/lesson-media-preview";
import { LessonNavigation } from "@/components/lesson-detail/lesson-navigation";
import {
  calculatePathProgress,
  resolveLessonPosition,
} from "@/components/lesson-detail/lesson-detail-utils";
import { getDifficultyLabel } from "@/components/path-detail/learning-path-detail-utils";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Screen } from "@/components/ui/screen";
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";
import { useLearningActivity } from "@/features/learning-activity/use-learning-activity";
import { useLessonBySlugQuery, usePublishedLearningPathsQuery } from "@/hooks/use-learning-paths";

/**
 * Lesson Detail screen.
 *
 * Loads a real published lesson by slug via @pathway/api, shows
 * context, media, body, key takeaway, completion, and navigation.
 * Save and completion are in-memory only (no persistence yet).
 */
export default function LessonDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug.trim() : "";

  const { isLessonSaved, isLessonCompleted, toggleLessonSaved, markLessonCompleted, markLessonIncomplete, completedLessonSlugs, isHydrated } = useLearningActivity();

  const { data: lesson, isLoading, isError, errorMessage, refetch } = useLessonBySlugQuery(slug || undefined);

  // Load all paths to find which path this lesson belongs to
  const { data: allPaths } = usePublishedLearningPathsQuery();

  // Find the parent learning path for this lesson
  const parentPath = useMemo(() => {
    if (!allPaths || !lesson) return null;
    for (const path of allPaths) {
      for (const module of path.modules) {
        if (module.lessons.some((l) => l.slug === lesson.slug)) {
          return path;
        }
      }
    }
    return null;
  }, [allPaths, lesson]);

  // Resolve lesson position within the path
  const lessonPosition = useMemo(() => {
    if (!parentPath || !slug) return null;
    return resolveLessonPosition(parentPath, slug);
  }, [parentPath, slug]);

  // Calculate path progress
  const pathProgress = useMemo(() => {
    if (!parentPath) return null;
    return calculatePathProgress(parentPath, completedLessonSlugs);
  }, [parentPath, completedLessonSlugs]);

  const saved = slug ? isLessonSaved(slug) : false;
  const completed = slug ? isLessonCompleted(slug) : false;

  // --- Invalid slug ---
  if (!slug) {
    return (
      <LessonShell>
        <EmptyState
          title="LESSON NOT FOUND"
          description="This lesson is unavailable or may no longer be published."
          actionLabel="BACK TO EXPLORE"
          onAction={() => router.navigate("/explore")}
        />
      </LessonShell>
    );
  }

  // --- Loading ---
  if (isLoading) {
    return (
      <LessonShell>
        <LessonDetailSkeleton />
      </LessonShell>
    );
  }

  // --- Error ---
  if (isError) {
    return (
      <LessonShell>
        <ErrorState
          message={errorMessage ?? "We couldn't load this lesson right now."}
          retryLabel="TRY AGAIN"
          onRetry={refetch}
        />
        <BackToExploreLink />
      </LessonShell>
    );
  }

  // --- Lesson not found ---
  if (!lesson) {
    return (
      <LessonShell>
        <EmptyState
          title="LESSON NOT FOUND"
          description="This lesson is unavailable or may no longer be published."
          actionLabel="BACK TO EXPLORE"
          onAction={() => router.navigate("/explore")}
        />
      </LessonShell>
    );
  }

  const difficultyLabel = getDifficultyLabel(lesson.difficulty);
  const hasBody = lesson.body && lesson.body.length > 0;
  const isPathComplete = pathProgress !== null && pathProgress.completed === pathProgress.total && pathProgress.total > 0;

  return (
    <LessonShell
      header={
        <LessonDetailHeader
          lessonTitle={lesson.title}
          isSaved={saved}
          onToggleSave={() => toggleLessonSaved(slug)}
          pathSlug={parentPath?.slug}
          disabled={!isHydrated}
        />
      }
    >
      {/* 1. Context */}
      {parentPath ? (
        <LessonContextLink pathTitle={parentPath.title} pathSlug={parentPath.slug} />
      ) : (
        <View style={styles.neutralContext}>
          <ThemedText type="smallBold" style={styles.neutralContextLabel}>LEARNING LESSON</ThemedText>
        </View>
      )}

      {/* 2. Metadata tags */}
      <View style={styles.tagsRow}>
        {difficultyLabel && <Tag backgroundColor="#D4E7DD">{difficultyLabel}</Tag>}
        {lesson.estimatedDuration > 0 && (
          <Tag backgroundColor="#FAF9F5">{lesson.estimatedDuration} min</Tag>
        )}
        {lesson.category && (
          <Tag backgroundColor="#E9E8E4">{lesson.category.name}</Tag>
        )}
      </View>

      {/* 3. Title */}
      <ThemedText style={styles.title}>{lesson.title}</ThemedText>

      {/* 4. Summary */}
      {lesson.summary ? (
        <ThemedText themeColor="textSecondary" style={styles.summary}>
          {lesson.summary}
        </ThemedText>
      ) : null}

      {/* 5. Author */}
      {lesson.author && (
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
          <ThemedText type="small" themeColor="textSecondary" style={styles.authorName}>
            {lesson.author.name}
          </ThemedText>
        </View>
      )}

      {/* 6. Media preview */}
      <LessonMediaPreview videoThumbnail={lesson.videoThumbnail} videoUrl={lesson.videoUrl} />

      {/* 7. Path progress */}
      {pathProgress && pathProgress.total > 0 && (
        <View style={styles.progressCard}>
          <View style={styles.progressLabelRow}>
            <ThemedText type="smallBold" style={styles.progressLabel}>
              {isHydrated ? "PATH PROGRESS" : "RESTORING PROGRESS"}
            </ThemedText>
            {isHydrated && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.progressValue}>
                {pathProgress.percentage}%
              </ThemedText>
            )}
          </View>
          {isHydrated ? (
            <ProgressBar value={pathProgress.percentage} />
          ) : (
            <View style={styles.progressSkeleton} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
          )}
          {isHydrated && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.progressDetail}>
              {pathProgress.completed} OF {pathProgress.total} LESSONS COMPLETED
            </ThemedText>
          )}
        </View>
      )}

      {/* 8. Body */}
      {hasBody ? (
        <LessonBodyRenderer body={lesson.body} />
      ) : (
        <EmptyState
          title="LESSON CONTENT UNAVAILABLE"
          description="The lesson is published, but its reading content is not available yet."
        />
      )}

      {/* 9. Key takeaway */}
      {lesson.summary && hasBody && (
        <KeyTakeawayCard takeaway={lesson.summary} />
      )}

      {/* 10. Completion */}
      <LessonCompletionCard
        lessonTitle={lesson.title}
        isCompleted={completed}
        onMarkComplete={() => markLessonCompleted(slug)}
        onMarkIncomplete={() => markLessonIncomplete(slug)}
        restoring={!isHydrated}
      />

      {/* 11. Navigation */}
      {lessonPosition && parentPath && (
        <View style={styles.navSection}>
          <SectionTitle title="KEEP LEARNING" />
          <LessonNavigation
            previousLesson={lessonPosition.previous}
            nextLesson={lessonPosition.next}
            pathSlug={parentPath.slug}
            isPathComplete={isPathComplete}
          />
        </View>
      )}
    </LessonShell>
  );
}

// --- Helper components ---

function LessonShell({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
  return (
    <>
      {header ?? <LessonDetailHeader lessonTitle="" isSaved={false} onToggleSave={() => {}} />}
      <Screen bottomInset={Spacing.five}>{children}</Screen>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.sectionDivider} />
    </View>
  );
}

function BackToExploreLink() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to Explore"
      onPress={() => router.navigate("/explore")}
      style={({ pressed }) => [styles.backLink, pressed && styles.backLinkPressed]}
    >
      <ThemedText type="smallBold" style={styles.backLinkText}>BACK TO EXPLORE</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  neutralContext: {
    paddingVertical: Spacing.three,
    borderBottomWidth: Border.primary,
    borderBottomColor: "#000000",
  },
  neutralContextLabel: {
    fontFamily: "Inter",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#424845",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    color: "#000000",
  },
  summary: {
    fontFamily: "Inter",
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "500",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  authorName: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "600",
  },
  progressCard: {
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
    gap: Spacing.two,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: "#000000",
  },
  progressValue: {
    color: "#424845",
  },
  progressDetail: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressSkeleton: {
    height: 16,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  navSection: {
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
  backLink: {
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  backLinkPressed: {
    opacity: 0.6,
  },
  backLinkText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
});
