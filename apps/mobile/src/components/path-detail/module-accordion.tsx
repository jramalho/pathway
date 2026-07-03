import { useState, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";

import type { LearningPathModule } from "@pathway/api";

import { LessonRow } from "./lesson-row";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";
import { formatModuleNumber } from "./learning-path-detail-utils";

export type ModuleAccordionProps = {
  module: LearningPathModule;
  index: number;
  /** Whether this is the first module with lessons (starts expanded). */
  startExpanded: boolean;
  /** Whether this module contains the first navigable lesson. */
  isFirstWithLessons: boolean;
  /** Slugs of completed lessons (in-memory state). */
  completedLessonSlugs?: Record<string, true>;
  /** Slug of the first incomplete lesson (for CONTINUE HERE tag). */
  continueHereSlug?: string | null;
};

/**
 * Module accordion — expandable card with module header and lesson rows.
 * Header is pressable to toggle expansion. Multiple modules can be open.
 */
export function ModuleAccordion({ module, index, startExpanded, isFirstWithLessons, completedLessonSlugs, continueHereSlug }: ModuleAccordionProps) {
  const [expanded, setExpanded] = useState(startExpanded);

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  const moduleNum = formatModuleNumber(module, index);
  const a11yLabel = `${expanded ? "Collapse" : "Expand"} module ${module.title}`;

  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.card}>
        {/* Header */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          accessibilityState={{ expanded }}
          onPress={toggle}
          style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        >
          {/* Module number block */}
          <View
            style={[
              styles.numberBlock,
              isFirstWithLessons && styles.numberBlockActive,
            ]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <ThemedText style={styles.numberText}>{moduleNum}</ThemedText>
          </View>

          {/* Title + description */}
          <View style={styles.headerContent}>
            <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
            {module.description ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.moduleDesc} numberOfLines={2}>
                {module.description}
              </ThemedText>
            ) : null}
          </View>

          {/* Chevron */}
          <View style={styles.chevron} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={
                expanded
                  ? { ios: "chevron.up", android: "expand_less", web: "expand_less" }
                  : { ios: "chevron.down", android: "expand_more", web: "expand_more" }
              }
              size={20}
              tintColor="#000000"
            />
          </View>
        </Pressable>

        {/* Lessons */}
        {expanded && module.lessons.length > 0 && (
          <View style={styles.lessonsContainer}>
            <View style={styles.lessonsBorder} />
            {module.lessons.map((lesson, lessonIndex) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                isStartHere={isFirstWithLessons && lessonIndex === 0}
                isCompleted={!!completedLessonSlugs?.[lesson.slug]}
                isContinueHere={continueHereSlug === lesson.slug}
              />
            ))}
          </View>
        )}

        {/* Expanded but no lessons */}
        {expanded && module.lessons.length === 0 && (
          <View style={styles.lessonsContainer}>
            <View style={styles.lessonsBorder} />
            <View style={styles.noLessons}>
              <ThemedText type="small" themeColor="textSecondary">
                No lessons in this module yet.
              </ThemedText>
            </View>
          </View>
        )}
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
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    minHeight: 44,
  },
  headerPressed: {
    backgroundColor: "#EFEEEA",
  },
  numberBlock: {
    width: 44,
    height: 44,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.thin,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  numberBlockActive: {
    backgroundColor: "#79FF5B",
  },
  numberText: {
    fontFamily: "Epilogue",
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
  },
  headerContent: {
    flex: 1,
    gap: Spacing.one,
  },
  moduleTitle: {
    fontFamily: "Epilogue",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    color: "#000000",
  },
  moduleDesc: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  chevron: {
    flexShrink: 0,
    padding: Spacing.one,
  },
  lessonsContainer: {
    // No gap — border separates header from lessons
  },
  lessonsBorder: {
    height: Border.primary,
    backgroundColor: "#000000",
  },
  noLessons: {
    padding: Spacing.three,
  },
});
