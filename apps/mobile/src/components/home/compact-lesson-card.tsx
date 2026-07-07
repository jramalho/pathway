import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { DurationLabel } from "@/components/ui/duration-label";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type CompactLessonCardProps = {
  lesson: LessonPreview;
  /** Learning path title for context, when available. */
  pathTitle?: string;
};

/**
 * Compact lesson card — small card with a black icon block (play icon
 * in acid green), lesson title, path context, duration/difficulty, and
 * an arrow. Entire card is pressable, navigates to /lessons/[slug].
 */
export function CompactLessonCard({ lesson, pathTitle }: CompactLessonCardProps) {
  const router = useRouter();
  const a11yLabel = `Open lesson ${lesson.title}${pathTitle ? ` from ${pathTitle}` : ""}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.card}>
        {/* Icon block */}
        <View style={styles.iconBlock} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
            size={18}
            tintColor={tokens.color.accentGreen}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText style={styles.title} numberOfLines={2}>{lesson.title}</ThemedText>
          {pathTitle && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.context} numberOfLines={1}>
              {pathTitle}
            </ThemedText>
          )}
          <View style={styles.metaRow}>
            <DurationLabel minutes={lesson.estimatedDuration} />
            <ThemedText type="small" themeColor="textSecondary"> · </ThemedText>
            <DifficultyBadge level={lesson.difficulty} />
          </View>
        </View>

        {/* Arrow */}
        <View style={styles.arrow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
            size={16}
            tintColor={tokens.color.black}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    backgroundColor: tokens.color.surface,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    padding: Spacing.three,
  },
  iconBlock: {
    width: 40,
    height: 40,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    fontWeight: String(Typography.bodyWeightSemibold) as "600",
    lineHeight: 22,
    color: tokens.color.black,
  },
  context: {
    fontFamily: Typography.bodyFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    flexWrap: "wrap",
  },
  arrow: {
    flexShrink: 0,
    padding: Spacing.one,
  },
});
