import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import type { LearningPath } from "@pathway/api";

import { CompactLessonCard } from "@/components/home/compact-lesson-card";
import { CompactPathCard } from "@/components/home/compact-path-card";
import { FeaturedPathCard } from "@/components/home/featured-path-card";
import { SectionHeader } from "@/components/home/section-header";
import { ExploreSearchInput } from "@/components/explore/explore-search-input";
import { ExploreSkeleton } from "@/components/explore/explore-skeleton";
import { NoResultsState } from "@/components/explore/no-results-state";
import { TopicFilterChips } from "@/components/explore/topic-filter-chips";
import {
  TOPICS,
  flattenLessons,
  filterLessonsByTopic,
  filterPathsByTopic,
  searchLessons,
  searchPaths,
  type Topic,
} from "@/components/explore/explore-filters";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
import { usePublishedLearningPathsQuery } from "@/hooks/use-learning-paths";

const MAX_FEATURED_PATHS = 3;
const MAX_LESSONS_TO_EXPLORE = 4;

/**
 * Explore screen — discovery, local search, and topic filters.
 * Loads all published learning paths from Strapi via @pathway/api,
 * derives lessons from the path tree, and filters/searches locally.
 */
export default function ExploreScreen() {
  const { data: paths, isLoading, isError, errorMessage, refetch } = usePublishedLearningPathsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic>("All");

  // Derive all lessons from the path tree
  const allLessons = useMemo(() => {
    if (!paths) return [];
    return flattenLessons(paths);
  }, [paths]);

  // Check if we're in "results mode" (search or non-All filter active)
  const isResultsMode = searchQuery.trim().length > 0 || selectedTopic !== "All";

  // Filtered results
  const filteredPaths = useMemo(() => {
    if (!paths) return [];
    const byTopic = filterPathsByTopic(paths, selectedTopic);
    return searchPaths(byTopic, searchQuery);
  }, [paths, selectedTopic, searchQuery]);

  const filteredLessons = useMemo(() => {
    const byTopic = filterLessonsByTopic(allLessons, selectedTopic);
    return searchLessons(byTopic, searchQuery);
  }, [allLessons, selectedTopic, searchQuery]);

  // Default mode data (no search, All filter)
  const featuredPaths = useMemo(() => {
    if (!paths) return [];
    const featured = paths.filter((p) => p.featured);
    const source = featured.length > 0 ? featured : paths;
    return source.slice(0, MAX_FEATURED_PATHS);
  }, [paths]);

  const firstFeatured = featuredPaths[0] ?? null;
  const remainingPaths = featuredPaths.slice(1);

  const lessonsToExplore = useMemo(() => {
    // Prioritize lessons from featured paths
    const featuredPathTitles = new Set(
      paths?.filter((p) => p.featured).map((p) => p.title) ?? [],
    );
    const fromFeatured = allLessons.filter((l) => featuredPathTitles.has(l.pathTitle));
    const source = fromFeatured.length > 0 ? fromFeatured : allLessons;
    return source.slice(0, MAX_LESSONS_TO_EXPLORE);
  }, [paths, allLessons]);

  // --- Loading ---
  if (isLoading) {
    return (
      <Screen>
        <ExploreSkeleton />
      </Screen>
    );
  }

  // --- Error ---
  if (isError) {
    return (
      <Screen>
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>DISCOVERY</ThemedText>
          <View style={styles.titleDivider} />
        </View>
        <ErrorState
          message={errorMessage ?? "We couldn't load the learning catalog right now."}
          retryLabel="Try again"
          onRetry={refetch}
        />
      </Screen>
    );
  }

  // --- Empty (API returned no paths) ---
  if (!paths || paths.length === 0) {
    return (
      <Screen>
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>DISCOVERY</ThemedText>
          <View style={styles.titleDivider} />
        </View>
        <EmptyState
          title="NO CONTENT PUBLISHED YET"
          description="The learning catalog will be available here when content is published."
          icon="grid"
        />
      </Screen>
    );
  }

  // --- Results mode ---
  if (isResultsMode) {
    const hasResults = filteredPaths.length > 0 || filteredLessons.length > 0;
    const resultSummary = buildResultSummary(searchQuery, selectedTopic, filteredPaths.length, filteredLessons.length);

    return (
      <Screen>
        {/* Title */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>DISCOVERY</ThemedText>
          <View style={styles.titleDivider} />
        </View>

        {/* Search */}
        <ExploreSearchInput value={searchQuery} onChangeText={setSearchQuery} />

        {/* Chips */}
        <TopicFilterChips topics={TOPICS} selected={selectedTopic} onSelect={setSelectedTopic} />

        {/* Results heading */}
        <View style={styles.resultsHeader}>
          <ThemedText style={styles.resultsTitle}>RESULTS</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.resultSummary}>
            {resultSummary}
          </ThemedText>
        </View>

        {hasResults ? (
          <View style={styles.resultsContainer}>
            {filteredPaths.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Learning Paths" />
                <View style={styles.pathList}>
                  {filteredPaths.map((path: LearningPath) => (
                    <CompactPathCard key={path.id} path={path} />
                  ))}
                </View>
              </View>
            )}
            {filteredLessons.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Lessons" />
                <View style={styles.lessonList}>
                  {filteredLessons.map(({ lesson, pathTitle }) => (
                    <CompactLessonCard key={lesson.id} lesson={lesson} pathTitle={pathTitle} />
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <NoResultsState
            onReset={() => {
              setSearchQuery("");
              setSelectedTopic("All");
            }}
          />
        )}
      </Screen>
    );
  }

  // --- Default mode (no search, All filter) ---
  return (
    <Screen>
      {/* Title */}
      <View style={styles.titleSection}>
        <ThemedText style={styles.title}>DISCOVERY</ThemedText>
        <View style={styles.titleDivider} />
      </View>

      {/* Search */}
      <ExploreSearchInput value={searchQuery} onChangeText={setSearchQuery} />

      {/* Chips */}
      <TopicFilterChips topics={TOPICS} selected={selectedTopic} onSelect={setSelectedTopic} />

      {/* Featured Paths */}
      <View style={styles.section}>
        <SectionHeader title="Featured Paths" />
        <View style={styles.pathList}>
          {firstFeatured && <FeaturedPathCard path={firstFeatured} />}
          {remainingPaths.map((path) => (
            <CompactPathCard key={path.id} path={path} />
          ))}
        </View>
      </View>

      {/* Lessons to Explore */}
      {lessonsToExplore.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Lessons to Explore" />
          <View style={styles.lessonList}>
            {lessonsToExplore.map(({ lesson, pathTitle }) => (
              <CompactLessonCard key={lesson.id} lesson={lesson} pathTitle={pathTitle} />
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

/** Build the results summary text based on active query and filter. */
function buildResultSummary(query: string, topic: Topic, pathCount: number, lessonCount: number): string {
  const hasQuery = query.trim().length > 0;
  const hasFilter = topic !== "All";
  const total = pathCount + lessonCount;

  if (hasQuery && hasFilter) {
    return `Showing results for "${query.trim()}" in ${topic}. ${total} found.`;
  }
  if (hasQuery) {
    return `Showing results for "${query.trim()}". ${total} found.`;
  }
  if (hasFilter) {
    return `Showing ${topic} content. ${total} found.`;
  }
  return `${total} found.`;
}

const styles = StyleSheet.create({
  titleSection: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  title: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSize2xl,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 38,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: tokens.color.black,
  },
  titleDivider: {
    height: Border.primary,
    backgroundColor: tokens.color.black,
    width: "100%",
  },
  resultsHeader: {
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  resultsTitle: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeXl,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: tokens.color.black,
  },
  resultSummary: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    lineHeight: 20,
  },
  resultsContainer: {
    gap: Spacing.four,
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
