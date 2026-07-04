import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";

export type CoverFallbackVariant = "cover" | "thumbnail";

export type CoverFallbackProps = {
  /** Visual scale: "cover" for large heroes, "thumbnail" for compact rows. */
  variant?: CoverFallbackVariant;
};

/**
 * Abstract geometric cover fallback when a LearningPath has no coverImage
 * or when an image URL fails to load. Mint background with black
 * lines/blocks and a small acid-green detail. No text, no external
 * image — pure View composition. Decorative and hidden from screen readers.
 */
export function CoverFallback({ variant = "cover" }: CoverFallbackProps) {
  const s = variant === "thumbnail" ? thumbnailStyles : coverStyles;
  return (
    <View style={s.container} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {/* Mint base */}
      <View style={s.base} />
      {/* Black horizontal lines */}
      <View style={[s.line, { top: "30%", width: "60%" }]} />
      <View style={[s.line, { top: "55%", width: "40%" }]} />
      {/* Black block */}
      <View style={s.block} />
      {/* Acid green detail */}
      <View style={s.accent} />
    </View>
  );
}

const coverStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#D4E7DD",
    overflow: "hidden",
  },
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#D4E7DD",
  },
  line: {
    position: "absolute",
    left: Spacing.four,
    height: Border.primary,
    backgroundColor: "#000000",
  },
  block: {
    position: "absolute",
    bottom: Spacing.four,
    right: Spacing.four,
    width: 40,
    height: 40,
    backgroundColor: "#000000",
  },
  accent: {
    position: "absolute",
    top: Spacing.three,
    right: Spacing.three,
    width: 24,
    height: 24,
    backgroundColor: "#79FF5B",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
});

const thumbnailStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#D4E7DD",
    overflow: "hidden",
  },
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#D4E7DD",
  },
  line: {
    position: "absolute",
    left: Spacing.one,
    height: Border.thin,
    backgroundColor: "#000000",
  },
  block: {
    position: "absolute",
    bottom: Spacing.one,
    right: Spacing.one,
    width: 20,
    height: 20,
    backgroundColor: "#000000",
  },
  accent: {
    position: "absolute",
    top: Spacing.one,
    right: Spacing.one,
    width: 14,
    height: 14,
    backgroundColor: "#79FF5B",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
});
