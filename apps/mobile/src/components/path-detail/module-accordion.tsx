import { useState, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";

import type { LearningPathModule } from "@pathway/api";

import { LessonRow } from "./lesson-row";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
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
 * Header shows module number, title, description, lesson count, and a
 * completion summary when lessons are completed. Multiple modules can
 * be open simultaneously.
 */
export function ModuleAccordion({ module, index, startExpanded, isFirstWithLessons, completedLessonSlugs, continueHereSlug }: ModuleAccordionProps) {
  const [expanded, setExpanded] = useState(startExpanded);
  const toggle = useCallback(() => setExpanded((v) => !v), []);

  const moduleNum = formatModuleNumber(module, index);
  const a11yLabel = `${expanded ? "Collapse" : "Expand"} module ${module.title}`;
  const lessonCount = module.lessons.length;
  const completedCount = module.lessons.filter((l) => completedLessonSlugs?.[l.slug]).length;
  const isModuleComplete = lessonCount > 0 && completedCount === lessonCount;

  return (
    <View style={styles.wrapper}>
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
          <View
            style={[styles.numberBlock, isFirstWithLessons && styles.numberBlockActive, isModuleComplete && styles.numberBlockComplete]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {isModuleComplete ? (
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={20}
                tintColor={tokens.color.black}
              />
            ) : (
              <ThemedText style={styles.numberText}>{moduleNum}</ThemedText>
            )}
          </View>

          <View style={styles.headerContent}>
            <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
            {module.description ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.moduleDesc} numberOfLines={2}>
                {module.description}
              </ThemedText>
            ) : null}
            <View style={styles.metaRow}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.metaText}>
                {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
              </ThemedText>
              {completedCount > 0 && (
                <>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.metaDot}>·</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.metaText}>
                    {completedCount} done
                  </ThemedText>
                </>
              )}
            </View>
          </View>

          <View style={styles.chevron} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={
                expanded
                  ? { ios: "chevron.up", android: "expand_less", web: "expand_less" }
                  : { ios: "chevron.down", android: "expand_more", web: "expand_more" }
              }
              size={20}
              tintColor={tokens.color.black}
            />
          </View>
        </Pressable>

        {/* Lessons */}
        {expanded && lessonCount > 0 && (
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

        {expanded && lessonCount === 0 && (
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
  wrapper: { position: "relative" },
  shadow: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: tokens.color.surface,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    minHeight: 44,
  },
  headerPressed: { backgroundColor: tokens.color.surfaceContainer },
  numberBlock: {
    width: 44,
    height: 44,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  numberBlockActive: { backgroundColor: tokens.color.accentGreen },
  numberBlockComplete: { backgroundColor: tokens.color.activeGreen },
  numberText: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeLg,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    color: tokens.color.black,
  },
  headerContent: { flex: 1, gap: Spacing.one },
  moduleTitle: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeMd,
    fontWeight: String(Typography.headingWeightBold) as "700",
    lineHeight: 24,
    color: tokens.color.black,
  },
  moduleDesc: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeXs,
    lineHeight: 18,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  metaText: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeXs,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  metaDot: { fontSize: Typography.fontSizeXs },
  chevron: { flexShrink: 0, padding: Spacing.one },
  lessonsContainer: {},
  lessonsBorder: { height: Border.primary, backgroundColor: tokens.color.black },
  noLessons: { padding: Spacing.three },
});
