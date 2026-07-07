import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { LessonStatusIndicator } from "@/components/lesson-detail/lesson-status-indicator";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LessonRowProps = {
  lesson: LessonPreview;
  /** Show "START HERE" tag for the first navigable lesson. */
  isStartHere: boolean;
  /** Whether this lesson is completed (in-memory state). */
  isCompleted?: boolean;
  /** Show "CONTINUE HERE" instead of "START HERE". */
  isContinueHere?: boolean;
};

/**
 * Lesson row — pressable row inside a module accordion.
 * Icon + status indicator + title + duration + arrow. Navigates to
 * /lessons/[slug].
 *
 * State is communicated with BOTH a status pill (icon + text) and a
 * background tint, so the state never relies on color alone:
 *   - completed: checkmark icon + "DONE" pill + mint tint
 *   - current (continue here): play icon + "NOW" pill + accent tint
 *   - start here: play icon + "NOW" pill + accent tint
 *   - default: play icon, neutral surface
 */
export function LessonRow({ lesson, isStartHere, isCompleted, isContinueHere }: LessonRowProps) {
  const router = useRouter();
  const isCurrent = isStartHere || isContinueHere;
  const status = isCompleted ? "completed" : isCurrent ? "current" : "default";
  const a11yLabel = `Open lesson ${lesson.title}${isCompleted ? ", completed" : ""}${isCurrent ? ", current lesson" : ""}${lesson.estimatedDuration ? `, ${lesson.estimatedDuration} minutes` : ""}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
      style={({ pressed }) => [
        styles.row,
        isCompleted && styles.rowCompleted,
        isCurrent && styles.rowCurrent,
        pressed && styles.rowPressed,
      ]}
    >
      {/* Icon block */}
      <View
        style={[styles.iconBlock, isCompleted && styles.iconBlockCompleted, isCurrent && styles.iconBlockCurrent]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SymbolView
          name={
            isCompleted
              ? { ios: "checkmark", android: "check", web: "check" }
              : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
          }
          size={18}
          tintColor={tokens.color.black}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <LessonStatusIndicator status={status} />
        </View>
        <ThemedText style={styles.title} numberOfLines={2}>{lesson.title}</ThemedText>
        {lesson.summary ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.summary} numberOfLines={2}>
            {lesson.summary}
          </ThemedText>
        ) : null}
      </View>

      {/* Duration + arrow */}
      <View style={styles.right}>
        {lesson.estimatedDuration > 0 && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.duration}>
            {lesson.estimatedDuration}m
          </ThemedText>
        )}
        <View style={styles.arrow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
            size={16}
            tintColor={tokens.color.black}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    backgroundColor: tokens.color.surface,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: Border.thin,
    borderBottomColor: tokens.color.black,
    minHeight: 44,
  },
  rowCompleted: {
    backgroundColor: tokens.color.mint,
  },
  rowCurrent: {
    backgroundColor: tokens.color.surfaceAccent,
  },
  rowPressed: {
    opacity: 0.7,
  },
  iconBlock: {
    width: 36,
    height: 36,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconBlockCompleted: {
    backgroundColor: tokens.color.activeGreen,
  },
  iconBlockCurrent: {
    backgroundColor: tokens.color.accentGreen,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  statusRow: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  title: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    fontWeight: String(Typography.bodyWeightSemibold) as "600",
    lineHeight: 21,
    color: tokens.color.black,
  },
  summary: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeXs,
    lineHeight: 18,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  duration: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeXs,
  },
  arrow: { alignItems: "center", justifyContent: "center" },
});
