import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";

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
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  greetingLine2: {
    height: 32,
    width: "40%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  continueCard: {
    height: 220,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  sectionHeader: {
    height: 28,
    width: "60%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  sectionDivider: {
    height: Border.primary,
    width: "100%",
    backgroundColor: "#000000",
  },
  pathCard1: {
    height: 160,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  pathCard2: {
    height: 100,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  lessonCard1: {
    height: 70,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  lessonCard2: {
    height: 70,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
});
