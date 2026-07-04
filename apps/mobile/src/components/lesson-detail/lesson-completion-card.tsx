import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";

export type LessonCompletionCardProps = {
  lessonTitle: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  /** While local state is being restored from storage. */
  restoring?: boolean;
};

/**
 * Lesson completion card — shows "READY TO MOVE ON?" with MARK AS COMPLETE
 * when not completed, or "LESSON COMPLETED" with MARK AS INCOMPLETE when done.
 * While restoring, shows "RESTORING PROGRESS" instead of a false 0% state.
 */
export function LessonCompletionCard({
  lessonTitle,
  isCompleted,
  onMarkComplete,
  onMarkIncomplete,
  restoring,
}: LessonCompletionCardProps) {
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
                tintColor="#79FF5B"
              />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.title}>LESSON COMPLETED</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
                This lesson is included in your current path progress.
              </ThemedText>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Mark lesson ${lessonTitle} as incomplete`}
            onPress={onMarkIncomplete}
            style={({ pressed }) => [styles.incompleteButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.incompleteLabel}>MARK AS INCOMPLETE</Text>
          </Pressable>
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
              tintColor="#000000"
            />
          </View>
        </Pressable>
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
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardCompleted: {
    backgroundColor: "#D4E7DD",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  checkBox: {
    width: 40,
    height: 40,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    color: "#000000",
  },
  description: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: 48,
    backgroundColor: "#79FF5B",
    borderWidth: Border.primary,
    borderColor: "#000000",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  buttonPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  completeLabel: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 14,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  completeIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  incompleteButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    backgroundColor: "#FAF9F5",
    borderWidth: Border.thin,
    borderColor: "#000000",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    marginTop: Spacing.two,
  },
  incompleteLabel: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 13,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
