import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { ProgressBar } from "@/components/ui/progress-bar";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";
import { getStrapiUrl } from "@/lib/env";
import { calculateLearningPathProgress } from "@/lib/profile-learning.utils";

export type ActivePathCardProps = {
  path: LearningPath;
  completedLessonSlugs: Record<string, true>;
};

/**
 * Active path card — compact horizontal card with cover thumbnail,
 * title, progress text, progress bar, and arrow. Navigates to
 * /paths/[slug]. Only shown for paths with partial completion.
 */
export function ActivePathCard({ path, completedLessonSlugs }: ActivePathCardProps) {
  const router = useRouter();
  const baseUrl = getStrapiUrl();
  const coverUrl = path.coverImage
    ? resolveStrapiMediaUrl(path.coverImage.url, baseUrl)
    : null;
  const alt = path.coverImage?.alternativeText ?? path.title;

  const { completed, total, percentage } = calculateLearningPathProgress(path, completedLessonSlugs);

  const a11yLabel = `Open active learning path ${path.title}, ${completed} of ${total} lessons completed`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/paths/${path.slug}`)}
      style={styles.pressable}
    >
      {({ pressed }) => (
        <View style={styles.wrapper}>
          {/* Hard shadow */}
          <View
            style={[
              styles.shadow,
              {
                right: -(pressed ? Shadow.offsetPressed : Shadow.offset),
                bottom: -(pressed ? Shadow.offsetPressed : Shadow.offset),
              },
            ]}
          />
          <View
            style={[
              styles.card,
              { transform: pressed ? [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }] : [{ translateX: 0 }, { translateY: 0 }] },
            ]}
          >
            {/* Cover thumbnail */}
            <View style={styles.thumbnailContainer}>
              {coverUrl ? (
                <Image
                  source={coverUrl}
                  style={styles.thumbnail}
                  contentFit="cover"
                  accessibilityLabel={alt}
                  transition={200}
                />
              ) : (
                <View style={styles.thumbnailFallback} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <View style={styles.fallbackBase} />
                  <View style={styles.fallbackBlock} />
                  <View style={styles.fallbackAccent} />
                </View>
              )}
            </View>

            {/* Content */}
            <View style={styles.content}>
              <ThemedText style={styles.title} numberOfLines={2}>{path.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.progressText}>
                {completed} OF {total} LESSONS COMPLETED
              </ThemedText>
              <ProgressBar value={percentage} />
            </View>

            {/* Arrow */}
            <View style={styles.arrow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                size={16}
                tintColor="#000000"
              />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
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
  },
  card: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
  },
  thumbnailContainer: {
    width: 72,
    height: 72,
    borderWidth: Border.primary,
    borderColor: "#000000",
    overflow: "hidden",
    flexShrink: 0,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailFallback: {
    flex: 1,
    position: "relative",
    backgroundColor: "#D4E7DD",
    overflow: "hidden",
  },
  fallbackBase: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#D4E7DD",
  },
  fallbackBlock: {
    position: "absolute",
    bottom: Spacing.one,
    right: Spacing.one,
    width: 20,
    height: 20,
    backgroundColor: "#000000",
  },
  fallbackAccent: {
    position: "absolute",
    top: Spacing.one,
    right: Spacing.one,
    width: 14,
    height: 14,
    backgroundColor: "#79FF5B",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: "#000000",
  },
  progressText: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  arrow: {
    width: 32,
    height: 32,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
