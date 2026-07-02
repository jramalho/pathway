import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import type { LearningPath } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Border, Spacing } from "@/constants/theme";
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
    <View style={styles.wrapper}>
      {/* Hard shadow layer */}
      <View style={styles.shadow} />
      <View style={styles.card}>
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
            <Tag backgroundColor="#D4E7DD">
              {difficultyLabels[path.difficulty] ?? path.difficulty}
            </Tag>
            {path.featured && (
              <Tag backgroundColor="#FAF9F5">★ Featured</Tag>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    transform: [{ translateX: 6 }, { translateY: 6 }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
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
    flexWrap: "wrap",
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
  fontFamily: "Epilogue",
  color: "#1B1C1A",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#424845",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
