import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath, LessonPreview } from "@pathway/api";

import { PathCover } from "@/components/ui/path-cover";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
import { getDifficultyLabel } from "./learning-path-detail-utils";

export type LearningPathHeroProps = {
  path: LearningPath;
  /** First navigable lesson (used for the "Start" CTA when no progress). */
  firstLesson: LessonPreview | null;
  /** First incomplete lesson (the "continue" target), or null when complete. */
  continueLesson?: LessonPreview | null;
  /** Progress percentage 0-100. Defaults to 0. */
  progressPercentage?: number;
  /** Number of completed lessons. */
  completedCount?: number;
  /** Total lessons in the path. */
  totalCount?: number;
  /** While local state is being restored from storage. */
  restoringProgress?: boolean;
};

/**
 * Learning Path hero — cover image (or fallback), difficulty tag, title,
 * description, metadata, progress with human language, and a contextual
 * CTA that adapts to the learner's state:
 *   - no progress  → "START PATH"
 *   - in progress  → "CONTINUE LEARNING"
 *   - complete     → "REVIEW PATH"
 *
 * While restoringProgress is true, shows "RESTORING PROGRESS" instead
 * of a potentially misleading 0%.
 */
export function LearningPathHero({
  path,
  firstLesson,
  continueLesson,
  progressPercentage = 0,
  completedCount = 0,
  totalCount = 0,
  restoringProgress,
}: LearningPathHeroProps) {
  const router = useRouter();
  const difficultyLabel = getDifficultyLabel(path.difficulty);

  // Determine CTA label and target lesson.
  const isComplete = totalCount > 0 && completedCount >= totalCount;
  const ctaLesson = isComplete ? firstLesson : (continueLesson ?? firstLesson);
  const ctaLabel = restoringProgress
    ? "RESTORING PROGRESS"
    : isComplete
      ? "REVIEW PATH"
      : completedCount > 0
        ? "CONTINUE LEARNING"
        : "START PATH";
  const ctaA11y = ctaLesson
    ? `${ctaLabel} — ${ctaLesson.title}`
    : ctaLabel;

  // Human-language progress summary.
  const progressSummary = restoringProgress || totalCount === 0
    ? null
    : completedCount > 0
      ? `${completedCount} of ${totalCount} lessons completed`
      : `${totalCount} lessons to go`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.shadow} />
      <View style={styles.card}>
        <PathCover
          coverImage={path.coverImage}
          fallbackTitle={path.title}
          style={styles.cover}
          decorative
        />
        <View style={styles.coverBorder} />

        <View style={styles.content}>
          {/* Tags */}
          {difficultyLabel && (
            <View style={styles.tagRow}>
              <Tag backgroundColor={tokens.color.mint}>{difficultyLabel}</Tag>
              {path.featured && (
                <Tag backgroundColor={tokens.color.accentGreen}>★ FEATURED</Tag>
              )}
            </View>
          )}

          {/* Title */}
          <ThemedText style={styles.title}>{path.title}</ThemedText>

          {/* Description */}
          {path.description ? (
            <ThemedText themeColor="textSecondary" style={styles.description} numberOfLines={3}>
              {path.description}
            </ThemedText>
          ) : null}

          {/* Metadata */}
          <View style={styles.metaRow}>
            <MetaItem icon={{ ios: "clock", android: "schedule", web: "schedule" }} text={`${path.estimatedDuration} min`} />
            <MetaItem icon={{ ios: "square.stack.3d.up", android: "layers", web: "layers" }} text={`${path.modules.length} modules`} />
            <MetaItem icon={{ ios: "book", android: "menu_book", web: "menu_book" }} text={`${path.lessonCount} lessons`} />
            {path.category && <MetaItem icon={{ ios: "tag", android: "sell", web: "sell" }} text={path.category.name} />}
          </View>

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <ThemedText type="smallBold" style={styles.progressLabel}>
                {restoringProgress ? "RESTORING PROGRESS" : "PATH PROGRESS"}
              </ThemedText>
              {!restoringProgress && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.progressValue}>
                  {progressPercentage}%
                </ThemedText>
              )}
            </View>
            {restoringProgress ? (
              <View style={styles.progressSkeleton} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
            ) : (
              <ProgressBar value={progressPercentage} />
            )}
            {progressSummary && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.progressSummary}>
                {progressSummary}
              </ThemedText>
            )}
          </View>

          {/* CTA */}
          {ctaLesson && !restoringProgress && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={ctaA11y}
              onPress={() => router.navigate(`/lessons/${ctaLesson.slug}`)}
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            >
              <Text style={styles.ctaLabel}>{ctaLabel}</Text>
              <View style={styles.ctaIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <SymbolView
                  name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                  size={18}
                  tintColor={tokens.color.black}
                />
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function MetaItem({ icon, text }: { icon: React.ComponentProps<typeof SymbolView>["name"]; text: string }) {
  return (
    <View style={styles.metaItem} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <SymbolView name={icon} size={14} tintColor={tokens.color.textSecondary} />
      <ThemedText type="small" themeColor="textSecondary">{text}</ThemedText>
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
    overflow: "hidden",
  },
  cover: { width: "100%", height: 220 },
  coverBorder: { height: Border.primary, backgroundColor: tokens.color.black },
  content: { padding: Spacing.four, gap: Spacing.three },
  tagRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two, flexWrap: "wrap" },
  title: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSize2xl,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 38,
    color: tokens.color.black,
  },
  description: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 24,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  metaRow: { flexDirection: "row", gap: Spacing.four, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  progressSection: { gap: Spacing.two },
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { color: tokens.color.black },
  progressValue: { color: tokens.color.textSecondary },
  progressSummary: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
    color: tokens.color.textSecondary,
  },
  progressSkeleton: {
    height: 16,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: 48,
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  ctaPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  ctaLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeSm,
    color: tokens.color.black,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ctaIcon: { alignItems: "center", justifyContent: "center" },
});
