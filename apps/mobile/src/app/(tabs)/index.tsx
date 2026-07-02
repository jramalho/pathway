import { StyleSheet, View } from "react-native";

import type { LearningPath } from "@pathway/api";

import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { LearningPathCard } from "@/components/learning-path-card";
import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useFeaturedLearningPathsQuery } from "@/hooks/use-learning-paths";

/**
 * Home screen — fetches featured learning paths from Strapi via
 * @pathway/api using the useFeaturedLearningPathsQuery hook.
 * No useEffect + fetch + useState — the hook handles lifecycle.
 */
export default function HomeScreen() {
  const { data: paths, isLoading, isError, errorMessage, refetch } = useFeaturedLearningPathsQuery();

  return (
    <Screen>
      <ThemedText type="title" style={styles.title}>
        Pathway
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Short, structured learning for mobile engineers and product builders.
      </ThemedText>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Featured learning paths
      </ThemedText>

      {isLoading && <LoadingState count={3} />}

      {isError && (
        <ErrorState
          message={errorMessage ?? "Couldn't load learning paths."}
          retryLabel="Try again"
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && paths && paths.length === 0 && (
        <ThemedText themeColor="textSecondary" style={styles.emptyText}>
          No learning paths have been published yet.
        </ThemedText>
      )}

      {!isLoading && !isError && paths && paths.length > 0 && (
        <View style={styles.list}>
          {paths.map((path: LearningPath) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "800",
    fontFamily: "Epilogue",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    fontFamily: "Epilogue",
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: Spacing.five,
  },
  list: {
    gap: Spacing.three,
  },
});
