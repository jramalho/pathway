import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";

import { PathCover } from "@/components/ui/path-cover";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";
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
              <PathCover
                coverImage={path.coverImage}
                fallbackTitle={path.title}
                fallbackVariant="thumbnail"
                decorative
              />
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
