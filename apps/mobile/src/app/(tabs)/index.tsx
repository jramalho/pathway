import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { LearningPath } from "@pathway/api";

import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { LearningPathCard } from "@/components/learning-path-card";
import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { getPathwayApiClient } from "@/lib/pathway-api";

type LoadState =
  | { status: "loading" }
  | { status: "success"; paths: LearningPath[] }
  | { status: "error" };

async function loadLearningPaths(signal: AbortSignal): Promise<LearningPath[]> {
  const api = getPathwayApiClient();

  // Try featured first; fall back to all published if none are featured.
  const featured = await api.getFeaturedLearningPaths({ signal });
  if (featured.length > 0) return featured;

  return api.getPublishedLearningPaths({ signal });
}

/**
 * Home screen — preserves the M1 vertical slice: fetches featured learning
 * paths from Strapi via @pathway/api, with fallback to all published.
 * Layout will be refined in Part 2.2.
 */
export default function HomeScreen() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const fetchPaths = useCallback(async (signal: AbortSignal) => {
    try {
      const paths = await loadLearningPaths(signal);
      if (!signal.aborted) {
        setState({ status: "success", paths });
      }
    } catch (err) {
      // AbortError = request was cancelled (e.g. unmount or refresh).
      if (err instanceof Error && err.name === "AbortError") return;
      if (!signal.aborted) {
        setState({ status: "error" });
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      await fetchPaths(signal);
    })();
    return () => controller.abort();
  }, [fetchPaths]);

  const handleRetry = useCallback(() => {
    setState({ status: "loading" });
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      await fetchPaths(signal);
    })();
    return () => controller.abort();
  }, [fetchPaths]);

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

      {state.status === "loading" && <LoadingState count={3} />}

      {state.status === "error" && (
        <ErrorState
          message="Couldn't load learning paths."
          retryLabel="Try again"
          onRetry={handleRetry}
        />
      )}

      {state.status === "success" && state.paths.length === 0 && (
        <ThemedText themeColor="textSecondary" style={styles.emptyText}>
          No learning paths have been published yet.
        </ThemedText>
      )}

      {state.status === "success" && state.paths.length > 0 && (
        <View style={styles.list}>
          {state.paths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
          <Pressable
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Refresh learning paths"
            style={styles.refreshButton}
          >
            <ThemedText type="smallBold">Refresh</ThemedText>
          </Pressable>
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
  refreshButton: {
    alignSelf: "center",
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderWidth: 2,
    borderColor: "#000000",
  },
});
