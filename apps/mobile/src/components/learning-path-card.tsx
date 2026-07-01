import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import type { LearningPath } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { Spacing } from "@/constants/theme";
import { getStrapiUrl } from "@/lib/env";

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function LearningPathCard({ path }: { path: LearningPath }) {
  const theme = useTheme();
  const baseUrl = getStrapiUrl();
  const coverUrl = path.coverImage
    ? resolveStrapiMediaUrl(path.coverImage.url, baseUrl)
    : null;
  const alt = path.coverImage?.alternativeText ?? path.title;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      {coverUrl ? (
        <Image
          source={coverUrl}
          style={styles.cover}
          contentFit="cover"
          accessibilityLabel={alt}
          transition={200}
        />
      ) : (
        <View
          style={[styles.cover, styles.coverFallback, { backgroundColor: theme.backgroundSelected }]}
          accessibilityLabel="No cover image"
        />
      )}
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {difficultyLabels[path.difficulty] ?? path.difficulty}
          </ThemedText>
          {path.featured && (
            <ThemedText type="smallBold" style={styles.featuredBadge}>
              ★ Featured
            </ThemedText>
          )}
        </View>
        <ThemedText type="subtitle" style={styles.title}>
          {path.title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.description}>
          {path.description}
        </ThemedText>
        <View style={styles.statsRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {path.lessonCount} lessons
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            · {path.estimatedDuration} min
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 160,
  },
  coverFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  featuredBadge: {
    color: "#b45309",
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.one,
  },
});
