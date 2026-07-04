import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";
import { getPublishedNavigableLessons } from "@/lib/profile-learning.utils";

export type CompletedPathCardProps = {
  path: LearningPath;
};

/**
 * Completed path card — mint surface with check icon, title, COMPLETED tag,
 * lesson count, and arrow. Navigates to /paths/[slug]. No certificates,
 * no grades, no completion date.
 */
export function CompletedPathCard({ path }: CompletedPathCardProps) {
  const router = useRouter();
  const total = getPublishedNavigableLessons(path).length;

  const a11yLabel = `Open completed learning path ${path.title}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/paths/${path.slug}`)}
      style={styles.pressable}
    >
      {({ pressed }) => (
        <View style={styles.wrapper}>
          {/* Hard shadow */}
          <View
            style={[
              styles.shadow,
              {
                right: -(pressed ? Shadow.offsetPressed : Shadow.offset),
                bottom: -(pressed ? Shadow.offsetPressed : Shadow.offset),
              },
            ]}
          />
          <View
            style={[
              styles.card,
              { transform: pressed ? [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }] : [{ translateX: 0 }, { translateY: 0 }] },
            ]}
          >
            {/* Check icon block */}
            <View style={styles.checkBlock} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={20}
                tintColor="#38FE13"
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <ThemedText style={styles.title} numberOfLines={2}>{path.title}</ThemedText>
              <View style={styles.metaRow}>
                <Tag backgroundColor="#38FE13">COMPLETED</Tag>
                <ThemedText type="small" themeColor="textSecondary" style={styles.lessonCount}>
                  {total} LESSONS COMPLETED
                </ThemedText>
              </View>
            </View>

            {/* Arrow */}
            <View style={styles.arrow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                size={16}
                tintColor="#000000"
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
    backgroundColor: "#000000",
  },
  card: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
  },
  checkBlock: {
    width: 44,
    height: 44,
    backgroundColor: "#000000",
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
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: "#000000",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  lessonCount: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  arrow: {
    width: 32,
    height: 32,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
