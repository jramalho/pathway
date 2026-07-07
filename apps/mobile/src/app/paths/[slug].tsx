import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useLocalSearchParams, useRouter } from "expo-router";

import { DetailHeader } from "@/components/path-detail/detail-header";
import { LearningPathDetailSkeleton } from "@/components/path-detail/learning-path-detail-skeleton";
import { LearningPathHero } from "@/components/path-detail/learning-path-hero";
import { ModuleAccordion } from "@/components/path-detail/module-accordion";
import {
  getFirstModuleWithLessonsIndex,
  getFirstNavigableLesson,
  sortModules,
} from "@/components/path-detail/learning-path-detail-utils";
import { calculatePathProgress, getFirstIncompleteLesson } from "@/components/lesson-detail/lesson-detail-utils";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
import { useLearningActivity } from "@/features/learning-activity/use-learning-activity";
import { useLearningPathBySlugQuery } from "@/hooks/use-learning-paths";

/**
 * Learning Path Detail screen.
 *
 * Loads a real published LearningPath by slug via @pathway/api,
 * shows hero with cover/metadata/progress/CTA, and curriculum
 * modules as expandable accordions with lesson rows.
 */
export default function PathDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug.trim() : "";

  const { data: path, isLoading, isError, errorMessage, refetch } = useLearningPathBySlugQuery(slug || undefined);
  const { completedLessonSlugs, isPathSaved, togglePathSaved, isHydrated } = useLearningActivity();

  // Derive sorted modules and first lesson
  const sortedModules = useMemo(() => {
    if (!path) return [];
    return sortModules(path.modules);
  }, [path]);

  const firstLesson = useMemo(() => {
    if (!path) return null;
    return getFirstNavigableLesson(path);
  }, [path]);

  const firstModuleWithLessonsIdx = useMemo(() => {
    if (!path) return -1;
    return getFirstModuleWithLessonsIndex(path.modules);
  }, [path]);

  // Calculate real progress from in-memory completion state
  const pathProgress = useMemo(() => {
    if (!path) return null;
    return calculatePathProgress(path, completedLessonSlugs);
  }, [path, completedLessonSlugs]);

  // Find the first incomplete lesson for CONTINUE HERE
  const continueLesson = useMemo(() => {
    if (!path) return null;
    return getFirstIncompleteLesson(path, completedLessonSlugs);
  }, [path, completedLessonSlugs]);

  const hasLessons = firstLesson !== null;

  // --- Invalid slug ---
  if (!slug) {
    return (
      <DetailScreenShell>
        <EmptyState
          title="PATH NOT FOUND"
          description="This learning path is unavailable or may no longer be published."
          actionLabel="BACK TO EXPLORE"
          onAction={() => router.navigate("/explore")}
        />
      </DetailScreenShell>
    );
  }

  // --- Loading ---
  if (isLoading) {
    return (
      <DetailScreenShell>
        <LearningPathDetailSkeleton />
      </DetailScreenShell>
    );
  }

  // --- Error ---
  if (isError) {
    return (
      <DetailScreenShell>
        <ErrorState
          message={errorMessage ?? "We couldn't load this learning path right now."}
          retryLabel="TRY AGAIN"
          onRetry={refetch}
        />
        <BackToExploreLink />
      </DetailScreenShell>
    );
  }

  // --- Path not found ---
  if (!path) {
    return (
      <DetailScreenShell>
        <EmptyState
          title="PATH NOT FOUND"
          description="This learning path is unavailable or may no longer be published."
          actionLabel="BACK TO EXPLORE"
          onAction={() => router.navigate("/explore")}
        />
      </DetailScreenShell>
    );
  }

  // --- Path without lessons ---
  if (!hasLessons) {
    return (
      <DetailScreenShell bookmark={<PathDetailHeader pathTitle={path.title} pathSlug={path.slug} isSaved={isPathSaved(path.slug)} isHydrated={isHydrated} onToggleSave={() => togglePathSaved(path.slug)} />}>
        <LearningPathHero
          path={path}
          firstLesson={firstLesson}
          continueLesson={continueLesson}
          progressPercentage={isHydrated ? (pathProgress?.percentage ?? 0) : 0}
          completedCount={isHydrated ? (pathProgress?.completed ?? 0) : 0}
          totalCount={isHydrated ? (pathProgress?.total ?? 0) : 0}
          restoringProgress={!isHydrated}
        />
        <View style={styles.section}>
          <SectionTitle title="CURRICULUM MODULES" />
          <EmptyState
            title="CURRICULUM COMING SOON"
            description="This learning path is published, but its lessons are not available yet."
            actionLabel="EXPLORE OTHER PATHS"
            onAction={() => router.navigate("/explore")}
          />
        </View>
      </DetailScreenShell>
    );
  }

  // --- Full content ---
  return (
    <DetailScreenShell bookmark={<PathDetailHeader pathTitle={path.title} pathSlug={path.slug} isSaved={isPathSaved(path.slug)} isHydrated={isHydrated} onToggleSave={() => togglePathSaved(path.slug)} />}>
      {/* Back link */}
      <BackLink />

      {/* Hero */}
        <LearningPathHero
          path={path}
          firstLesson={firstLesson}
          continueLesson={continueLesson}
          progressPercentage={isHydrated ? (pathProgress?.percentage ?? 0) : 0}
          completedCount={isHydrated ? (pathProgress?.completed ?? 0) : 0}
          totalCount={isHydrated ? (pathProgress?.total ?? 0) : 0}
          restoringProgress={!isHydrated}
        />

      {/* Curriculum */}
      <View style={styles.section}>
        <SectionTitle title="CURRICULUM MODULES" />
        <View style={styles.moduleList}>
          {sortedModules.map((module, index) => (
            <ModuleAccordion
              key={module.id}
              module={module}
              index={index}
              startExpanded={index === firstModuleWithLessonsIdx}
              isFirstWithLessons={index === firstModuleWithLessonsIdx}
              completedLessonSlugs={completedLessonSlugs}
              continueHereSlug={continueLesson?.slug}
            />
          ))}
        </View>
      </View>
    </DetailScreenShell>
  );
}

// --- Helper components ---

function DetailScreenShell({ children, bookmark }: { children: React.ReactNode; bookmark?: React.ReactNode }) {
  return (
    <>
      {bookmark ?? <DetailHeader />}
      <Screen bottomInset={Spacing.five}>{children}</Screen>
    </>
  );
}

/** Detail header with path bookmark button. */
function PathDetailHeader({
  pathTitle,
  pathSlug,
  isSaved,
  isHydrated,
  onToggleSave,
}: {
  pathTitle: string;
  pathSlug: string;
  isSaved: boolean;
  isHydrated: boolean;
  onToggleSave: () => void;
}) {
  const bookmarkLabel = isSaved
    ? `Remove learning path ${pathTitle} from saved items`
    : `Save learning path ${pathTitle}`;

  return (
    <DetailHeader
      showBookmark
      isSaved={isSaved}
      bookmarkDisabled={!isHydrated}
      bookmarkLabel={bookmarkLabel}
      onToggleBookmark={onToggleSave}
    />
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

function BackLink() {
  const router = useRouter();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/explore");
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to learning paths"
      onPress={handleBack}
      style={({ pressed }) => [styles.backLink, pressed && styles.backLinkPressed]}
    >
      <SymbolView
        name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
        size={16}
        tintColor={tokens.color.black}
      />
      <ThemedText type="smallBold" style={styles.backLinkText}>Back to learning paths</ThemedText>
    </Pressable>
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
      <SymbolView
        name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
        size={16}
        tintColor={tokens.color.black}
      />
      <ThemedText type="smallBold" style={styles.backLinkText}>BACK TO EXPLORE</ThemedText>
    </Pressable>
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
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeXl,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: tokens.color.black,
  },
  sectionDivider: {
    height: Border.primary,
    backgroundColor: tokens.color.black,
    width: "100%",
  },
  moduleList: {
    gap: Spacing.three,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  backLinkPressed: {
    opacity: 0.6,
  },
  backLinkText: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    color: tokens.color.black,
  },
});
