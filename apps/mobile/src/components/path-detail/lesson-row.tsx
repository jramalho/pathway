import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

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
 * Play icon, title, summary, duration, arrow. Navigates to /lessons/[slug].
 * Shows COMPLETED tag when completed, START HERE or CONTINUE HERE for the active lesson.
 */
export function LessonRow({ lesson, isStartHere, isCompleted, isContinueHere }: LessonRowProps) {
  const router = useRouter();
  const a11yLabel = `Open lesson ${lesson.title}${isCompleted ? `, completed` : ""}${lesson.estimatedDuration ? `, ${lesson.estimatedDuration} minutes` : ""}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      {/* Icon */}
      <View style={styles.iconBlock} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <SymbolView
          name={
            isCompleted
              ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
              : { ios: "play.circle", android: "play_circle", web: "play_circle" }
          }
          size={22}
          tintColor={isCompleted ? "#38FE13" : "#79FF5B"}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.tagRow}>
          {isCompleted && <Tag backgroundColor="#38FE13">COMPLETED</Tag>}
          {isStartHere && !isCompleted && <Tag backgroundColor="#79FF5B">START HERE</Tag>}
          {isContinueHere && !isCompleted && !isStartHere && <Tag backgroundColor="#D4E7DD">CONTINUE HERE</Tag>}
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
            tintColor="#000000"
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
    backgroundColor: "#FAF9F5",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: Border.thin,
    borderBottomColor: "#000000",
  },
  rowPressed: {
    backgroundColor: "#EFEEEA",
  },
  iconBlock: {
    width: 36,
    height: 36,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  tagRow: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    color: "#000000",
  },
  summary: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  duration: {
    fontFamily: "Inter",
    fontSize: 13,
  },
  arrow: {
    alignItems: "center",
    justifyContent: "center",
  },
});
