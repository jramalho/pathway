import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { BookmarkControl } from "@/components/ui/bookmark-control";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { DurationLabel } from "@/components/ui/duration-label";
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type SavedLessonCardProps = {
  lesson: LessonPreview;
  pathTitle: string;
  pathSlug: string;
  isCompleted: boolean;
  onRemove: () => void;
};

/**
 * Saved lesson card — off-white surface, 3px black border, hard 6px shadow,
 * acid-green top stripe. Content area navigates to the lesson; bookmark
 * button is separate and only removes from saved.
 */
export function SavedLessonCard({ lesson, pathTitle, pathSlug, isCompleted, onRemove }: SavedLessonCardProps) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.card}>
        {/* Acid-green top stripe */}
        <View style={styles.stripe} />

        <View style={styles.body}>
          {/* Top row: badges + remove bookmark */}
          <View style={styles.topRow}>
            <View style={styles.tagRow}>
              <DifficultyBadge level={lesson.difficulty} backgroundColor={tokens.color.accentGreen} />
              {isCompleted && <Tag backgroundColor={tokens.color.activeGreen}>COMPLETED</Tag>}
            </View>
            <BookmarkControl
              bookmarked
              onToggle={onRemove}
              accessibilityLabel={`Remove lesson ${lesson.title} from saved items`}
              size="sm"
            />
          </View>

          {/* Content area — navigates to lesson */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${lesson.title} from ${pathTitle}. Opens lesson.`}
            onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
            style={({ pressed }) => [styles.contentArea, pressed && styles.contentPressed]}
          >
            {/* Title */}
            <ThemedText style={styles.title}>{lesson.title}</ThemedText>

            {/* Summary */}
            {lesson.summary ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.summary} numberOfLines={3}>
                {lesson.summary}
              </ThemedText>
            ) : null}

            {/* Footer */}
            <View style={styles.footer}>
              {lesson.estimatedDuration > 0 && (
                <DurationLabel minutes={lesson.estimatedDuration} />
              )}
              <ThemedText type="small" themeColor="textSecondary">
                {pathTitle}
              </ThemedText>
              <View style={styles.resumeButton}>
                <Text style={styles.resumeLabel}>RESUME</Text>
                <View style={styles.resumeIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <SymbolView
                    name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                    size={14}
                    tintColor={tokens.color.black}
                  />
                </View>
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
    backgroundColor: tokens.color.surface,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
  },
  stripe: {
    height: 6,
    backgroundColor: tokens.color.accentGreen,
    borderBottomWidth: Border.primary,
    borderBottomColor: tokens.color.black,
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
    borderBottomWidth: Border.primary,
    borderBottomColor: tokens.color.black,
    paddingBottom: Spacing.two,
  },
  summary: {
    fontFamily: Typography.bodyFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginLeft: "auto",
  },
  resumeLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: tokens.color.black,
  },
  resumeIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
