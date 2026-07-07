import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LessonCompletionCardProps = {
  lessonTitle: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  /** While local state is being restored from storage. */
  restoring?: boolean;
  /** Whether completing this lesson finishes the entire path. */
  completesPath?: boolean;
  /** Path progress after completion (percentage). */
  pathPercentage?: number;
  /** Slug of the parent path (for "review path" CTA on completion). */
  pathSlug?: string;
};

/**
 * Lesson completion card — shows "READY TO MOVE ON?" with MARK AS COMPLETE
 * when not completed, or "LESSON COMPLETED" with MARK AS INCOMPLETE when done.
 *
 * When completing this lesson finishes the entire path, shows a discrete
 * inline path-completion message with a "REVIEW PATH" CTA instead of an
 * invasive modal. While restoring, shows "RESTORING PROGRESS".
 */
export function LessonCompletionCard({
  lessonTitle,
  isCompleted,
  onMarkComplete,
  onMarkIncomplete,
  restoring,
  completesPath,
  pathPercentage,
  pathSlug,
}: LessonCompletionCardProps) {
  const router = useRouter();

  if (restoring) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.shadow} />
        <View style={styles.card}>
          <ThemedText style={styles.title}>RESTORING PROGRESS</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            Your lesson progress is being restored.
          </ThemedText>
        </View>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.shadow} />
        <View style={[styles.card, styles.cardCompleted]}>
          <View style={styles.iconRow}>
            <View style={styles.checkBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
                size={28}
                tintColor={tokens.color.accentGreen}
              />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.title}>LESSON COMPLETED</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
                This lesson is included in your current path progress.
              </ThemedText>
            </View>
          </View>

          {/* Path completion feedback */}
          {completesPath && (
            <View style={styles.pathCompleteBanner}>
              <View style={styles.pathCompleteIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <SymbolView
                  name={{ ios: "rosette", android: "workspace_premium", web: "workspace_premium" }}
                  size={20}
                  tintColor={tokens.color.black}
                />
              </View>
              <View style={styles.pathCompleteText}>
                <ThemedText style={styles.pathCompleteTitle}>PATH COMPLETE</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.pathCompleteDesc}>
                  {pathPercentage !== undefined ? `${pathPercentage}% · ` : ""}You finished every lesson in this path.
                </ThemedText>
              </View>
            </View>
          )}

          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Mark lesson ${lessonTitle} as incomplete`}
              onPress={onMarkIncomplete}
              style={({ pressed }) => [styles.incompleteButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.incompleteLabel}>MARK AS INCOMPLETE</Text>
            </Pressable>
            {completesPath && pathSlug && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Review learning path"
                onPress={() => router.navigate(`/paths/${pathSlug}`)}
                style={({ pressed }) => [styles.reviewButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.reviewLabel}>REVIEW PATH</Text>
                <View style={styles.reviewIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <SymbolView
                    name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                    size={14}
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

  return (
    <View style={styles.wrapper}>
    <View style={styles.shadow} />
    <View style={styles.card}>
      <ThemedText style={styles.title}>READY TO MOVE ON?</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
        Mark this lesson complete when you finish the material.
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Mark lesson ${lessonTitle} as complete`}
        onPress={onMarkComplete}
        style={({ pressed }) => [styles.completeButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.completeLabel}>MARK AS COMPLETE</Text>
        <View style={styles.completeIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={18}
            tintColor={tokens.color.black}
          />
        </View>
      </Pressable>
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
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardCompleted: { backgroundColor: tokens.color.mint },
  iconRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  checkBox: {
    width: 40,
    height: 40,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: { flex: 1, gap: Spacing.one },
  title: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeLg,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 26,
    color: tokens.color.black,
  },
  description: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    lineHeight: 20,
  },
  pathCompleteBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    padding: Spacing.three,
  },
  pathCompleteIcon: {
    width: 36,
    height: 36,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pathCompleteText: { flex: 1, gap: 2 },
  pathCompleteTitle: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeSm,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: tokens.color.black,
  },
  pathCompleteDesc: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeXs,
    lineHeight: 16,
  },
  actionRow: { flexDirection: "row", gap: Spacing.two, flexWrap: "wrap" },
  completeButton: {
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
  buttonPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  completeLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeSm,
    color: tokens.color.black,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  completeIcon: { alignItems: "center", justifyContent: "center" },
  incompleteButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    backgroundColor: tokens.color.surface,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    flex: 1,
  },
  incompleteLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeXs,
    color: tokens.color.black,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    minHeight: 44,
    backgroundColor: tokens.color.black,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    flex: 1,
  },
  reviewLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeXs,
    color: tokens.color.surface,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reviewIcon: { alignItems: "center", justifyContent: "center" },
});
