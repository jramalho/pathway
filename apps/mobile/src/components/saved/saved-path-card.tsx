import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";

import { BookmarkControl } from "@/components/ui/bookmark-control";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { PathCover } from "@/components/ui/path-cover";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
import { getDifficultyLabel } from "@/components/path-detail/learning-path-detail-utils";
import { flattenNavigableLessons } from "@/components/lesson-detail/lesson-detail-utils";

export type SavedPathCardProps = {
  path: LearningPath;
  completedLessonSlugs: Record<string, true>;
  onRemove: () => void;
};

/**
 * Saved path card — mint surface, 3px black border, hard 6px shadow.
 * Cover image (or abstract fallback), difficulty badge, remove bookmark,
 * title, description, real progress, and VIEW/CONTINUE PATH button.
 */
export function SavedPathCard({ path, completedLessonSlugs, onRemove }: SavedPathCardProps) {
  const router = useRouter();
  const difficultyLabel = getDifficultyLabel(path.difficulty);

  const lessons = flattenNavigableLessons(path);
  const total = lessons.length;
  const completed = total > 0 ? lessons.filter((l) => completedLessonSlugs[l.slug]).length : 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const hasProgress = completed > 0 && completed < total;

  const ctaLabel = hasProgress ? "CONTINUE PATH" : "VIEW PATH";

  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.card}>
        {/* Cover */}
        <PathCover
          coverImage={path.coverImage}
          fallbackTitle={path.title}
          style={styles.cover}
          decorative
        />
        <View style={styles.coverBorder} />

        <View style={styles.body}>
          {/* Top row: badge + remove bookmark */}
          <View style={styles.topRow}>
            <View style={styles.tagRow}>
              {difficultyLabel && <DifficultyBadge level={path.difficulty} />}
            </View>
            <BookmarkControl
              bookmarked
              onToggle={onRemove}
              accessibilityLabel={`Remove learning path ${path.title} from saved items`}
              size="sm"
            />
          </View>

          {/* Content area — navigates to path */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${path.title}. Opens learning path details.`}
            onPress={() => router.navigate(`/paths/${path.slug}`)}
            style={({ pressed }) => [styles.contentArea, pressed && styles.contentPressed]}
          >
            <ThemedText style={styles.title}>{path.title}</ThemedText>
            {path.description ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.description} numberOfLines={3}>
                {path.description}
              </ThemedText>
            ) : null}

            {/* Progress */}
            {total > 0 && (
              <View style={styles.progressSection}>
                <ThemedText type="smallBold" style={styles.progressLabel}>
                  {completed} OF {total} LESSONS COMPLETED
                </ThemedText>
                <ProgressBar value={percentage} />
              </View>
            )}

            {/* CTA */}
            <View style={styles.ctaButton}>
              <Text style={styles.ctaLabel}>{ctaLabel}</Text>
              <View style={styles.ctaIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <SymbolView
                  name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                  size={16}
                  tintColor={tokens.color.black}
                />
              </View>
            </View>
          </Pressable>
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
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 160,
  },
  coverBorder: {
    height: Border.primary,
    backgroundColor: tokens.color.black,
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    flex: 1,
  },
  contentArea: {
    gap: Spacing.two,
  },
  contentPressed: {
    opacity: 0.7,
  },
  title: {
    fontFamily: Typography.headingFamily,
    fontSize: 24,
    fontWeight: String(Typography.headingWeightBold) as "700",
    lineHeight: 30,
    color: tokens.color.black,
  },
  description: {
    fontFamily: Typography.bodyFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  progressSection: {
    gap: Spacing.one,
  },
  progressLabel: {
    color: tokens.color.black,
  },
  ctaButton: {
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
    alignSelf: "flex-start",
  },
  ctaLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: tokens.color.black,
  },
  ctaIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
