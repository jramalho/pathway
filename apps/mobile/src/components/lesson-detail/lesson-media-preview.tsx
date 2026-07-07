import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { SymbolView } from "expo-symbols";

import type { ContentImage } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { Border, Shadow, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
import { getStrapiUrl } from "@/lib/env";

export type LessonMediaPreviewProps = {
  videoThumbnail: ContentImage | null;
  videoUrl: string | null;
};

/**
 * Media preview — shows video thumbnail or cover image when available,
 * or an abstract geometric fallback when no media exists or the image
 * fails to load. The play icon is a decorative affordance (no functional
 * player). Uses the neo-brutalist border + shadow language.
 */
export function LessonMediaPreview({ videoThumbnail, videoUrl }: LessonMediaPreviewProps) {
  const baseUrl = getStrapiUrl();
  const thumbUrl = videoThumbnail
    ? resolveStrapiMediaUrl(videoThumbnail.url, baseUrl)
    : null;
  const alt = videoThumbnail?.alternativeText ?? "Lesson preview";
  const [failed, setFailed] = useState(false);
  const hasMedia = thumbUrl !== null && !failed;

  return (
    <View style={styles.wrapper}>
      <View style={styles.shadow} />
      <View style={styles.container}>
        {hasMedia ? (
          <>
            <Image
              source={thumbUrl as ImageSource}
              style={styles.image}
              contentFit="cover"
              accessibilityLabel={alt}
              transition={200}
              onError={() => setFailed(true)}
            />
            <View style={styles.tagOverlay}>
              <Tag backgroundColor={tokens.color.black} color={tokens.color.accentGreen}>LESSON PREVIEW</Tag>
            </View>
            <View style={styles.playIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
                size={48}
                tintColor={tokens.color.accentGreen}
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
        <View style={[fallbackStyles.hLine, { top: "25%" }]} />
        <View style={[fallbackStyles.hLine, { top: "50%" }]} />
        <View style={[fallbackStyles.hLine, { top: "75%" }]} />
        <View style={[fallbackStyles.vLine, { left: "33%" }]} />
        <View style={[fallbackStyles.vLine, { left: "66%" }]} />
        <View style={fallbackStyles.accentBlock} />
        <View style={fallbackStyles.blackBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
  shadow: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  container: {
    position: "relative",
    zIndex: 1,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
    aspectRatio: 16 / 9,
  },
  image: { width: "100%", height: "100%" },
  tagOverlay: { position: "absolute", top: Spacing.two, left: Spacing.two },
  playIcon: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

const fallbackStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.mint },
  grid: { flex: 1, position: "relative" },
  hLine: { position: "absolute", left: 0, right: 0, height: Border.thin, backgroundColor: tokens.color.black },
  vLine: { position: "absolute", top: 0, bottom: 0, width: Border.thin, backgroundColor: tokens.color.black },
  accentBlock: {
    position: "absolute",
    top: "30%", left: "40%",
    width: 48, height: 48,
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  blackBlock: {
    position: "absolute",
    bottom: "15%", right: "10%",
    width: 32, height: 32,
    backgroundColor: tokens.color.black,
  },
});
