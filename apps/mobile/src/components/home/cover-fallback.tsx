import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";

/**
 * Abstract geometric cover fallback when a LearningPath has no coverImage.
 * Mint background with black lines/blocks and a small acid-green detail.
 * No text, no external image — pure View composition.
 */
export function CoverFallback() {
  return (
    <View style={styles.container} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {/* Mint base */}
      <View style={styles.base} />
      {/* Black horizontal lines */}
      <View style={[styles.line, { top: "30%", width: "60%" }]} />
      <View style={[styles.line, { top: "55%", width: "40%" }]} />
      {/* Black block */}
      <View style={styles.block} />
      {/* Acid green detail */}
      <View style={styles.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
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
