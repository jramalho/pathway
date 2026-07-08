import { Pressable, StyleSheet, View } from "react-native";
import { tokens } from "@pathway/ui-tokens";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";

export type CompletedLessonRowProps = {
  lesson: LessonPreview;
  pathTitle: string;
};

/**
 * Completed lesson row — compact horizontal row with acid-green check block,
 * lesson title, path context, duration, COMPLETED tag, and arrow.
 * Navigates to /lessons/[slug].
 */
export function CompletedLessonRow({ lesson, pathTitle }: CompletedLessonRowProps) {
  const router = useRouter();

  const a11yLabel = `Open completed lesson ${lesson.title}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
      style={styles.pressable}
    >
      {({ pressed }) => (
        <View style={styles.wrapper}>
          {/* Hard shadow */}
          <View
            style={[
              styles.shadow,
              {
                right: -(pressed ? Shadow.offsetPressed : Shadow.offsetPressed),
                bottom: -(pressed ? Shadow.offsetPressed : Shadow.offsetPressed),
              },
            ]}
          />
          <View
            style={[
              styles.row,
              { transform: pressed ? [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }] : [{ translateX: 0 }, { translateY: 0 }] },
            ]}
          >
            {/* Check block */}
            <View style={styles.checkBlock} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={16}
                tintColor={tokens.color.black}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <ThemedText style={styles.title} numberOfLines={2}>{lesson.title}</ThemedText>
              <View style={styles.metaRow}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.context} numberOfLines={1}>
                  {pathTitle}
                </ThemedText>
                {lesson.estimatedDuration > 0 && (
                  <ThemedText type="small" themeColor="textSecondary">
                    · {lesson.estimatedDuration} min
                  </ThemedText>
                )}
                <Tag backgroundColor={tokens.color.activeGreen}>COMPLETED</Tag>
              </View>
            </View>

            {/* Arrow */}
            <View style={styles.arrow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                size={16}
                tintColor={tokens.color.black}
              />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
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
  },
  row: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    backgroundColor: tokens.color.surface,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    padding: Spacing.three,
  },
  checkBlock: {
    width: 36,
    height: 36,
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    color: tokens.color.black,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    flexWrap: "wrap",
  },
  context: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  arrow: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
