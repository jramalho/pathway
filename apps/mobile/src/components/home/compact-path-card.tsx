import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";

import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { DurationLabel } from "@/components/ui/duration-label";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type CompactPathCardProps = {
  path: LearningPath;
};

/**
 * Compact path card — smaller card for remaining featured paths.
 * Off-white surface, difficulty badge, title, description, stats, arrow.
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
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.card}>
        <View style={styles.body}>
          <View style={styles.tagRow}>
            <DifficultyBadge level={path.difficulty} />
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
              <ThemedText type="small" themeColor="textSecondary"> · </ThemedText>
              <DurationLabel minutes={path.estimatedDuration} />
            </View>
            <View style={styles.arrowBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                size={16}
                tintColor={tokens.color.black}
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
  pressed: {
    opacity: 0.85,
  },
  card: {
    backgroundColor: tokens.color.surface,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
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
    fontFamily: Typography.headingFamily,
    fontSize: 18,
    fontWeight: String(Typography.headingWeightBold) as "700",
    lineHeight: 24,
    color: tokens.color.black,
  },
  description: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    lineHeight: 20,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
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
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
  },
});
