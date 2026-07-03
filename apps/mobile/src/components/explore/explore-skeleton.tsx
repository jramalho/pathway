import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";

/**
 * Explore skeleton — structural loading state matching the Explore layout:
 * title, search field, chips, hero card, compact cards, lesson cards.
 */
export function ExploreSkeleton() {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      {/* Title */}
      <View style={styles.titleBlock} />
      <View style={styles.titleDivider} />

      {/* Search */}
      <View style={styles.searchBlock} />

      {/* Chips */}
      <View style={styles.chipsRow}>
        <View style={styles.chip} />
        <View style={styles.chip} />
        <View style={styles.chip} />
      </View>

      {/* Section header */}
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />

      {/* Hero card */}
      <View style={styles.heroCard} />

      {/* Compact cards */}
      <View style={styles.compactCard} />
      <View style={styles.compactCard} />

      {/* Section header 2 */}
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />

      {/* Lesson cards */}
      <View style={styles.lessonCard} />
      <View style={styles.lessonCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  titleBlock: {
    height: 36,
    width: "50%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  titleDivider: {
    height: Border.primary,
    width: "100%",
    backgroundColor: "#000000",
  },
  searchBlock: {
    height: 48,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  chipsRow: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  chip: {
    height: 36,
    width: 80,
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
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
  heroCard: {
    height: 200,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  compactCard: {
    height: 100,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  lessonCard: {
    height: 70,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
});
