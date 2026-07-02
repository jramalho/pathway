import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { CoverFallback } from "./cover-fallback";
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";
import { getStrapiUrl } from "@/lib/env";

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export type FeaturedPathCardProps = {
  path: LearningPath;
};

/**
 * Featured path card — large card with cover image (or abstract fallback),
 * mint body, difficulty tag, title, description, and navigation arrow.
 * Entire card is pressable and navigates to /paths/[slug].
 */
export function FeaturedPathCard({ path }: FeaturedPathCardProps) {
  const router = useRouter();
  const baseUrl = getStrapiUrl();
  const coverUrl = path.coverImage
    ? resolveStrapiMediaUrl(path.coverImage.url, baseUrl)
    : null;
  const alt = path.coverImage?.alternativeText ?? path.title;
  const a11yLabel = `${path.title}. Opens learning path details.`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={() => router.navigate(`/paths/${path.slug}`)}
      style={styles.pressable}
    >
      <View style={styles.card}>
        {/* Cover image or fallback */}
        {coverUrl ? (
          <Image
            source={coverUrl}
            style={styles.cover}
            contentFit="cover"
            accessibilityLabel={alt}
            transition={200}
          />
        ) : (
          <CoverFallback />
        )}
        {/* Border between image and body */}
        <View style={styles.coverBorder} />

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.tagRow}>
            <Tag backgroundColor="#FAF9F5">
              {difficultyLabels[path.difficulty] ?? path.difficulty}
            </Tag>
            {path.featured && (
              <Tag backgroundColor="#79FF5B">★ Featured</Tag>
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
              <ThemedText type="small" themeColor="textSecondary">
                · {path.estimatedDuration} min
              </ThemedText>
            </View>
            {/* Navigation arrow */}
            <View style={styles.arrowBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                size={20}
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
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 200,
  },
  coverBorder: {
    height: Border.primary,
    backgroundColor: "#000000",
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
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
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
    width: 36,
    height: 36,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
});
