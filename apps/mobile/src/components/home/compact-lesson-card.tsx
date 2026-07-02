import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

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
  const a11yLabel = `${lesson.title}${pathTitle ? ` from ${pathTitle}` : ""}. Opens lesson.`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
      style={styles.pressable}
    >
      <View style={styles.card}>
        {/* Icon block */}
        <View style={styles.iconBlock} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
            size={18}
            tintColor="#79FF5B"
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
            <ThemedText type="small" themeColor="textSecondary">
              {lesson.estimatedDuration} min
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              · {difficultyLabels[lesson.difficulty] ?? lesson.difficulty}
            </ThemedText>
          </View>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
  },
  iconBlock: {
    width: 40,
    height: 40,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
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
  context: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  arrow: {
    flexShrink: 0,
    padding: Spacing.one,
  },
});
