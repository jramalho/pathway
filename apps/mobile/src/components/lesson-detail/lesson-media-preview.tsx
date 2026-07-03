import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";

import type { ContentImage } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { Border, Shadow, Spacing } from "@/constants/theme";
import { getStrapiUrl } from "@/lib/env";

export type LessonMediaPreviewProps = {
  videoThumbnail: ContentImage | null;
  videoUrl: string | null;
};

/**
 * Media preview — shows video thumbnail or cover image when available,
 * or an abstract geometric fallback when no media exists.
 * No functional play button — the play icon is decorative.
 */
export function LessonMediaPreview({ videoThumbnail, videoUrl }: LessonMediaPreviewProps) {
  const baseUrl = getStrapiUrl();
  const thumbUrl = videoThumbnail
    ? resolveStrapiMediaUrl(videoThumbnail.url, baseUrl)
    : null;
  const alt = videoThumbnail?.alternativeText ?? "Lesson preview";
  const hasMedia = thumbUrl !== null;

  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.container}>
        {hasMedia ? (
          <>
            <Image
              source={thumbUrl}
              style={styles.image}
              contentFit="cover"
              accessibilityLabel={alt}
              transition={200}
            />
            {/* Tag overlay */}
            <View style={styles.tagOverlay}>
              <Tag backgroundColor="#000000" color="#79FF5B">LESSON PREVIEW</Tag>
            </View>
            {/* Decorative play icon */}
            <View style={styles.playIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
                size={48}
                tintColor="#79FF5B"
              />
            </View>
          </>
        ) : (
          <AbstractMediaFallback />
        )}
      </View>
    </View>
  );
}

/** Abstract geometric fallback when no media is available. */
function AbstractMediaFallback() {
  return (
    <View style={fallbackStyles.container} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={fallbackStyles.grid}>
        {/* Grid lines */}
        <View style={[fallbackStyles.hLine, { top: "25%" }]} />
        <View style={[fallbackStyles.hLine, { top: "50%" }]} />
        <View style={[fallbackStyles.hLine, { top: "75%" }]} />
        <View style={[fallbackStyles.vLine, { left: "33%" }]} />
        <View style={[fallbackStyles.vLine, { left: "66%" }]} />
        {/* Acid green block */}
        <View style={fallbackStyles.accentBlock} />
        {/* Black block */}
        <View style={fallbackStyles.blackBlock} />
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
  container: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
    overflow: "hidden",
    aspectRatio: 16 / 9,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tagOverlay: {
    position: "absolute",
    top: Spacing.two,
    left: Spacing.two,
  },
  playIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

const fallbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D4E7DD",
  },
  grid: {
    flex: 1,
    position: "relative",
  },
  hLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: Border.thin,
    backgroundColor: "#000000",
  },
  vLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: Border.thin,
    backgroundColor: "#000000",
  },
  accentBlock: {
    position: "absolute",
    top: "30%",
    left: "40%",
    width: 48,
    height: 48,
    backgroundColor: "#79FF5B",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  blackBlock: {
    position: "absolute",
    bottom: "15%",
    right: "10%",
    width: 32,
    height: 32,
    backgroundColor: "#000000",
  },
});
