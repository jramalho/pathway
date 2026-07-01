import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { LearningPath } from '@pathway/api';

import { LearningPathCard } from '@/components/learning-path-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getPathwayApiClient } from '@/lib/pathway-api';

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; paths: LearningPath[] }
  | { status: 'error' };

async function loadLearningPaths(signal: AbortSignal): Promise<LearningPath[]> {
  const api = getPathwayApiClient();

  // Try featured first; fall back to all published if none are featured.
  const featured = await api.getFeaturedLearningPaths({ signal });
  if (featured.length > 0) return featured;

  return api.getPublishedLearningPaths({ signal });
}

export default function HomeScreen() {
  const theme = useTheme();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const fetchPaths = useCallback(async (signal: AbortSignal) => {
    try {
      const paths = await loadLearningPaths(signal);
      if (!signal.aborted) {
        setState({ status: 'success', paths });
      }
    } catch (err) {
      // AbortError = request was cancelled (e.g. unmount or refresh). Don't show as error.
      if (err instanceof Error && err.name === 'AbortError') return;
      if (!signal.aborted) {
        setState({ status: 'error' });
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    // IIFE keeps the async call out of the effect's synchronous body.
    (async () => {
      await fetchPaths(signal);
    })();
    return () => controller.abort();
  }, [fetchPaths]);

  const handleRetry = useCallback(() => {
    setState({ status: 'loading' });
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      await fetchPaths(signal);
    })();
    return () => controller.abort();
  }, [fetchPaths]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Pathway
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Short, structured learning for mobile engineers and product builders.
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Featured learning paths
          </ThemedText>

          {state.status === 'loading' && (
            <ThemedView style={styles.centerState}>
              <ActivityIndicator size="large" color={theme.text} />
              <ThemedText themeColor="textSecondary" style={styles.stateText}>
                Loading learning paths…
              </ThemedText>
            </ThemedView>
          )}

          {state.status === 'error' && (
            <ThemedView style={styles.centerState}>
              <ThemedText style={styles.stateText}>
                Couldn&apos;t load learning paths.
              </ThemedText>
              <Pressable
                onPress={handleRetry}
                accessibilityRole="button"
                accessibilityLabel="Try again"
                style={[styles.retryButton, { borderColor: theme.text }]}
              >
                <ThemedText type="smallBold">Try again</ThemedText>
              </Pressable>
            </ThemedView>
          )}

          {state.status === 'success' && state.paths.length === 0 && (
            <ThemedView style={styles.centerState}>
              <ThemedText themeColor="textSecondary" style={styles.stateText}>
                No learning paths have been published yet.
              </ThemedText>
            </ThemedView>
          )}

          {state.status === 'success' && state.paths.length > 0 && (
            <View style={styles.list}>
              {state.paths.map((path) => (
                <LearningPathCard key={path.id} path={path} />
              ))}
              <Pressable
                onPress={handleRetry}
                accessibilityRole="button"
                accessibilityLabel="Refresh learning paths"
                style={[styles.retryButton, { borderColor: theme.text }, styles.refreshButton]}
              >
                <ThemedText type="smallBold">Refresh</ThemedText>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.four,
    paddingVertical: Spacing.four,
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  centerState: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.six,
  },
  stateText: {
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 1,
  },
  list: {
    gap: Spacing.three,
  },
  refreshButton: {
    alignSelf: 'center',
    marginTop: Spacing.two,
  },
});
