import { StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath, LessonPreview } from "@pathway/api";

import { NeoButton } from "@/components/ui/neo-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type ContinueLearningCardProps = {
  path: LearningPath;
  lesson: LessonPreview;
  /** Progress percentage 0-100 from persisted completion state. */
  progressPercentage?: number;
  /** While local state is being restored from storage. */
  restoringProgress?: boolean;
};

/**
 * Continue Learning card — prominent card using a real LearningPath
 * and its first navigable Lesson. Shows real progress from persisted
 * completion state, or "RESTORING PROGRESS" during hydration.
 * CTA navigates to /lessons/[slug].
 */
export function ContinueLearningCard({ path, lesson, progressPercentage = 0, restoringProgress }: ContinueLearningCardProps) {
  const router = useRouter();

  const ctaLabel = `Start learning — ${lesson.title}`;

  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.card}>
        {/* Decorative mint block top-right */}
        <View style={styles.decorBlock} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />

        <View style={styles.content}>
          {/* Tag row */}
          <View style={styles.tagRow}>
            <View style={styles.tagWrapper}>
              <SymbolView
                name={{ ios: "bolt.fill", android: "bolt", web: "bolt" }}
                size={12}
                tintColor={tokens.color.black}
              />
              <Tag backgroundColor={tokens.color.surface}>START LEARNING</Tag>
            </View>
          </View>

          {/* Path title */}
          <ThemedText style={styles.pathTitle}>{path.title}</ThemedText>

          {/* Lesson title */}
          <ThemedText themeColor="textSecondary" style={styles.lessonTitle}>
            {lesson.title}
          </ThemedText>

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <ThemedText type="smallBold" style={styles.progressLabel}>
                {restoringProgress ? "RESTORING PROGRESS" : "PROGRESS"}
              </ThemedText>
              {!restoringProgress && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.progressValue}>{progressPercentage}%</ThemedText>
              )}
            </View>
            {restoringProgress ? (
              <View style={styles.progressSkeleton} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
            ) : (
              <ProgressBar value={progressPercentage} />
            )}
          </View>

          {/* CTA */}
          <NeoButton
            label="Start learning"
            variant="primary"
            accessibilityLabel={ctaLabel}
            onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
            style={styles.cta}
          />
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
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
  },
  decorBlock: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 64,
    height: 64,
    backgroundColor: tokens.color.mint,
    borderLeftWidth: Border.primary,
    borderLeftColor: tokens.color.black,
    borderBottomWidth: Border.primary,
    borderBottomColor: tokens.color.black,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  pathTitle: {
    fontFamily: Typography.headingFamily,
    fontSize: 24,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 30,
    color: tokens.color.black,
  },
  lessonTitle: {
    fontFamily: Typography.bodyFamily,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  progressSection: {
    gap: Spacing.two,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: tokens.color.black,
  },
  progressValue: {
    color: tokens.color.textSecondary,
  },
  progressSkeleton: {
    height: 16,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  cta: {
    marginTop: Spacing.one,
  },
});
