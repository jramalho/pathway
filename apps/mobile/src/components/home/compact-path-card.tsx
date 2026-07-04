import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export type CompactPathCardProps = {
  path: LearningPath;
};

/**
 * Compact path card — smaller card for remaining featured paths.
 * Off-white surface, difficulty tag, title, description, stats, arrow.
 * Entire card is pressable, navigates to /paths/[slug].
 */
export function CompactPathCard({ path }: CompactPathCardProps) {
  const router = useRouter();
  const a11yLabel = `Open learning path ${path.title}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/paths/${path.slug}`)}
      style={styles.pressable}
    >
      <View style={styles.card}>
        <View style={styles.body}>
          <View style={styles.tagRow}>
            <Tag backgroundColor="#D4E7DD">
              {difficultyLabels[path.difficulty] ?? path.difficulty}
            </Tag>
          </View>
          <ThemedText style={styles.title}>{path.title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.description} numberOfLines={2}>
            {path.description}
          </ThemedText>
          <View style={styles.footer}>
            <View style={styles.statsRow}>
              <ThemedText type="small" themeColor="textSecondary">
                {path.lessonCount} lessons
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                · {path.estimatedDuration} min
              </ThemedText>
            </View>
            <View style={styles.arrowBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                size={16}
                tintColor="#000000"
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  card: {
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    color: "#000000",
  },
  description: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.one,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  arrowBox: {
    width: 32,
    height: 32,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
});
