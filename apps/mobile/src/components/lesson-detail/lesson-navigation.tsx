import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LessonNavigationProps = {
  previousLesson: LessonPreview | null;
  nextLesson: LessonPreview | null;
  pathSlug: string;
  /** Whether all lessons in the path are completed. */
  isPathComplete: boolean;
};

/**
 * Keep Learning navigation — previous/next lesson buttons or
 * back-to-path / path-complete state.
 *
 * Navigation uses the real CMS order (previousLesson/nextLesson come from
 * resolveLessonPosition which preserves module and lesson order). When
 * there is no next lesson, shows a "BACK TO PATH" or "PATH COMPLETE" CTA.
 */
export function LessonNavigation({ previousLesson, nextLesson, pathSlug, isPathComplete }: LessonNavigationProps) {
  const router = useRouter();

  if (!previousLesson && !nextLesson) return null;

  const goToLesson = (slug: string) => {
    // expo-router replaces the current route so the new lesson screen
    // mounts fresh and scrolls to the top automatically.
    router.replace(`/lessons/${slug}`);
  };

  return (
    <View style={styles.container}>
      {previousLesson && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Go to previous lesson ${previousLesson.title}`}
          onPress={() => goToLesson(previousLesson.slug)}
          style={({ pressed }) => [styles.prevButton, pressed && styles.buttonPressed]}
        >
          <View style={styles.prevIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
              size={18}
              tintColor={tokens.color.black}
            />
          </View>
          <View style={styles.navContent}>
            <Text style={styles.navLabel}>PREVIOUS LESSON</Text>
            <Text style={styles.navTitle} numberOfLines={1}>{previousLesson.title}</Text>
          </View>
        </Pressable>
      )}

      {nextLesson ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Go to next lesson ${nextLesson.title}`}
          onPress={() => goToLesson(nextLesson.slug)}
          style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
        >
          <View style={styles.nextContent}>
            <Text style={styles.nextLabel}>NEXT LESSON</Text>
            <Text style={styles.nextTitle} numberOfLines={1}>{nextLesson.title}</Text>
          </View>
          <View style={styles.nextIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
              size={18}
              tintColor={tokens.color.black}
            />
          </View>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to learning path"
          onPress={() => router.navigate(`/paths/${pathSlug}`)}
          style={({ pressed }) => [styles.pathButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.pathLabel}>
            {isPathComplete ? "PATH COMPLETE — REVIEW" : "BACK TO PATH"}
          </Text>
          <View style={styles.pathIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
              size={18}
              tintColor={tokens.color.black}
            />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: 48,
    backgroundColor: tokens.color.surface,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    minHeight: 48,
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pathButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: 48,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  buttonPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  prevIcon: {
    width: 36,
    height: 36,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  navContent: { flex: 1, gap: 2 },
  navLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeXs,
    color: tokens.color.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  navTitle: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    fontWeight: String(Typography.bodyWeightSemibold) as "600",
    color: tokens.color.black,
  },
  nextContent: { flex: 1, gap: 2 },
  nextLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeXs,
    color: tokens.color.black,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nextTitle: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    color: tokens.color.black,
  },
  nextIcon: {
    width: 36,
    height: 36,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pathLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeSm,
    color: tokens.color.black,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pathIcon: { alignItems: "center", justifyContent: "center" },
});
