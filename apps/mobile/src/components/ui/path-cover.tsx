import { useState } from "react";
import { Image, type ImageSource } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import type { ContentImage } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";

import { CoverFallback, type CoverFallbackVariant } from "@/components/home/cover-fallback";
import { getStrapiUrl } from "@/lib/env";

export type PathCoverProps = {
  /** Cover image from the domain model. Null when no image is set. */
  coverImage: ContentImage | null;
  /** Fallback title for alt text when no alternativeText is set. */
  fallbackTitle: string;
  /** Visual scale of the fallback. */
  fallbackVariant?: CoverFallbackVariant;
  /** Style applied to the outer View. */
  style?: StyleProp<ViewStyle>;
  /** Whether the image is purely decorative (no accessibility label). */
  decorative?: boolean;
};

/**
 * Cover image with automatic geometric fallback.
 *
 * Shows the real Strapi cover image when available. Falls back to the
 * abstract CoverFallback when the image is missing OR fails to load
 * (onError). The fallback is decorative and hidden from screen readers.
 *
 * Real images get an accessibilityLabel only when they carry useful
 * information (non-decorative). Decorative images are hidden.
 */
export function PathCover({
  coverImage,
  fallbackTitle,
  fallbackVariant = "cover",
  style,
  decorative = false,
}: PathCoverProps) {
  const baseUrl = getStrapiUrl();
  const url = coverImage ? resolveStrapiMediaUrl(coverImage.url, baseUrl) : null;
  const alt = coverImage?.alternativeText ?? fallbackTitle;
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <View style={[styles.container, style]}>
        <CoverFallback variant={fallbackVariant} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={url as ImageSource}
        style={styles.image}
        contentFit="cover"
        accessibilityLabel={decorative ? undefined : alt}
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? "no-hide-descendants" : undefined}
        transition={200}
        onError={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
