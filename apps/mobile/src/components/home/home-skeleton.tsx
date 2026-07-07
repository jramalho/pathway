import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

/**
 * Home skeleton — structural loading state that mimics the Home layout:
 * greeting lines, continue learning card, section header, path cards,
 * and compact lesson cards. No shimmer, no gradient.
 */
export function HomeSkeleton() {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      {/* Greeting lines */}
      <View style={styles.greetingLine1} />
      <View style={styles.greetingLine2} />

      {/* Continue learning card */}
      <View style={styles.continueCard} />

      {/* Section header */}
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />

      {/* Path cards */}
      <View style={styles.pathCard1} />
      <View style={styles.pathCard2} />

      {/* Section header 2 */}
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />

      {/* Lesson cards */}
      <View style={styles.lessonCard1} />
      <View style={styles.lessonCard2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  greetingLine1: {
    height: 32,
    width: "70%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  greetingLine2: {
    height: 32,
    width: "40%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  continueCard: {
    height: 220,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  sectionHeader: {
    height: 28,
    width: "60%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  sectionDivider: {
    height: Border.primary,
    width: "100%",
    backgroundColor: tokens.color.black,
  },
  pathCard1: {
    height: 160,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  pathCard2: {
    height: 100,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  lessonCard1: {
    height: 70,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  lessonCard2: {
    height: 70,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
});
