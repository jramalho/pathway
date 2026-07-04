import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LearningPath, LessonPreview } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { CoverFallback } from "@/components/home/cover-fallback";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";
import { getStrapiUrl } from "@/lib/env";
import { getDifficultyLabel } from "./learning-path-detail-utils";

export type LearningPathHeroProps = {
  path: LearningPath;
  firstLesson: LessonPreview | null;
  /** Progress percentage 0-100. Defaults to 0. */
  progressPercentage?: number;
  /** While local state is being restored from storage. */
  restoringProgress?: boolean;
};

/**
 * Learning Path hero — large card with cover image (or abstract fallback),
 * difficulty tag, title, description, metadata, progress, and CTA.
 * While restoringProgress is true, shows "RESTORING PROGRESS" instead
 * of a potentially misleading 0%.
 */
export function LearningPathHero({ path, firstLesson, progressPercentage = 0, restoringProgress }: LearningPathHeroProps) {
  const router = useRouter();
  const baseUrl = getStrapiUrl();
  const coverUrl = path.coverImage
    ? resolveStrapiMediaUrl(path.coverImage.url, baseUrl)
    : null;
  const alt = path.coverImage?.alternativeText ?? path.title;
  const difficultyLabel = getDifficultyLabel(path.difficulty);

  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
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
          <View style={styles.cover}>
            <CoverFallback />
          </View>
        )}
        {/* Border between image and content */}
        <View style={styles.coverBorder} />

        {/* Content */}
        <View style={styles.content}>
          {/* Tag row */}
          {difficultyLabel && (
            <View style={styles.tagRow}>
              <Tag backgroundColor="#D4E7DD">{difficultyLabel}</Tag>
              {path.featured && <Tag backgroundColor="#79FF5B">★ Featured</Tag>}
            </View>
          )}

          {/* Title */}
          <ThemedText style={styles.title}>{path.title}</ThemedText>

          {/* Description */}
          {path.description ? (
            <ThemedText themeColor="textSecondary" style={styles.description}>
              {path.description}
            </ThemedText>
          ) : null}

          {/* Metadata */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "clock", android: "schedule", web: "schedule" }}
                size={14}
                tintColor="#424845"
              />
              <ThemedText type="small" themeColor="textSecondary">
                {path.estimatedDuration} min
              </ThemedText>
            </View>
            <View style={styles.metaItem} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "square.stack.3d.up", android: "layers", web: "layers" }}
                size={14}
                tintColor="#424845"
              />
              <ThemedText type="small" themeColor="textSecondary">
                {path.modules.length} modules
              </ThemedText>
            </View>
            <View style={styles.metaItem} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "book", android: "menu_book", web: "menu_book" }}
                size={14}
                tintColor="#424845"
              />
              <ThemedText type="small" themeColor="textSecondary">
                {path.lessonCount} lessons
              </ThemedText>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <ThemedText type="smallBold" style={styles.progressLabel}>
                {restoringProgress ? "RESTORING PROGRESS" : "PATH PROGRESS"}
              </ThemedText>
              {!restoringProgress && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.progressValue}>{progressPercentage}%</ThemedText>
              )}
            </View>
            {restoringProgress ? (
              <View style={styles.progressSkeleton} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
            ) : (
              <ProgressBar value={progressPercentage} />
            )}
          </View>

          {/* CTA */}
          {firstLesson && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Start learning with ${firstLesson.title}`}
              onPress={() => router.navigate(`/lessons/${firstLesson.slug}`)}
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
            >
              <Text style={styles.ctaLabel}>START LEARNING</Text>
              <View style={styles.ctaIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <SymbolView
                  name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                  size={18}
                  tintColor="#000000"
                />
              </View>
            </Pressable>
          )}
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
    backgroundColor: "#000000",
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 240,
  },
  coverBorder: {
    height: Border.primary,
    backgroundColor: "#000000",
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    color: "#000000",
  },
  description: {
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.four,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  progressSection: {
    gap: Spacing.two,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: "#000000",
  },
  progressValue: {
    color: "#424845",
  },
  cta: {
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
  ctaPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  ctaLabel: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 14,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ctaIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressSkeleton: {
    height: 16,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
});
