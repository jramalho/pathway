import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";

import { PathCover } from "@/components/ui/path-cover";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { DurationLabel } from "@/components/ui/duration-label";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type FeaturedPathCardProps = {
  path: LearningPath;
};

/**
 * Featured path card — large card with cover image (or abstract fallback),
 * mint body, difficulty badge, title, description, duration, and navigation arrow.
 * Entire card is pressable and navigates to /paths/[slug].
 */
export function FeaturedPathCard({ path }: FeaturedPathCardProps) {
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
        {/* Cover image or fallback */}
        <PathCover
          coverImage={path.coverImage}
          fallbackTitle={path.title}
          style={styles.cover}
          decorative
        />
        {/* Border between image and body */}
        <View style={styles.coverBorder} />

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.tagRow}>
            <DifficultyBadge level={path.difficulty} backgroundColor={tokens.color.surface} />
            {path.featured && (
              <View style={styles.featuredTag}>
                <SymbolView
                  name={{ ios: "star.fill", android: "star", web: "star" }}
                  size={10}
                  tintColor={tokens.color.black}
                />
                <ThemedText type="smallBold" style={styles.featuredText}>FEATURED</ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={styles.title}>{path.title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.description} numberOfLines={3}>
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
            {/* Navigation arrow */}
            <View style={styles.arrowBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                size={20}
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
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 200,
  },
  coverBorder: {
    height: Border.primary,
    backgroundColor: tokens.color.black,
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
  featuredTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredText: {
    fontSize: 11,
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: tokens.color.black,
  },
  title: {
    fontFamily: Typography.headingFamily,
    fontSize: 20,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 26,
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
    width: 36,
    height: 36,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
  },
});
