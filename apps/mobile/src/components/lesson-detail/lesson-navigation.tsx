import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { Border, Shadow, Spacing } from "@/constants/theme";

export type LessonNavigationProps = {
  previousLesson: LessonPreview | null;
  nextLesson: LessonPreview | null;
  pathSlug: string;
  /** Whether all lessons in the path are completed. */
  isPathComplete: boolean;
};

/**
 * Keep Learning navigation — previous/next lesson buttons or
 * back-to-path / path-complete state.
 */
export function LessonNavigation({ previousLesson, nextLesson, pathSlug, isPathComplete }: LessonNavigationProps) {
  const router = useRouter();

  if (!previousLesson && !nextLesson) return null;

  return (
    <View style={styles.container}>
      {previousLesson && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Previous lesson: ${previousLesson.title}`}
          onPress={() => router.navigate(`/lessons/${previousLesson.slug}`)}
          style={({ pressed }) => [styles.prevButton, pressed && styles.buttonPressed]}
        >
          <View style={styles.prevIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
              size={18}
              tintColor="#000000"
            />
          </View>
          <View style={styles.navContent}>
            <Text style={styles.navLabel}>PREVIOUS LESSON</Text>
            <Text style={styles.navTitle} numberOfLines={1}>{previousLesson.title}</Text>
          </View>
        </Pressable>
      )}

      {nextLesson ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Next lesson: ${nextLesson.title}`}
          onPress={() => router.navigate(`/lessons/${nextLesson.slug}`)}
          style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
        >
          <View style={styles.nextContent}>
            <Text style={styles.nextLabel}>NEXT LESSON</Text>
            <Text style={styles.nextTitle} numberOfLines={1}>{nextLesson.title}</Text>
          </View>
          <View style={styles.nextIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
              size={18}
              tintColor="#000000"
            />
          </View>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPathComplete ? "Back to path" : "Back to path"}
          onPress={() => router.navigate(`/paths/${pathSlug}`)}
          style={({ pressed }) => [styles.pathButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.pathLabel}>
            {isPathComplete ? "PATH COMPLETE" : "BACK TO PATH"}
          </Text>
          <View style={styles.pathIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
              size={18}
              tintColor="#000000"
            />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: 48,
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    minHeight: 48,
    backgroundColor: "#79FF5B",
    borderWidth: Border.primary,
    borderColor: "#000000",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pathButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: 48,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  buttonPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  prevIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  navContent: {
    flex: 1,
    gap: 2,
  },
  navLabel: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 11,
    color: "#424845",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  navTitle: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  nextContent: {
    flex: 1,
    gap: 2,
  },
  nextLabel: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 11,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nextTitle: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
  },
  nextIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pathLabel: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 14,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pathIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
