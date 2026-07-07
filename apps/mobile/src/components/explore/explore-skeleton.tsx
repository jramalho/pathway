import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

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
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  titleDivider: {
    height: Border.primary,
    width: "100%",
    backgroundColor: tokens.color.black,
  },
  searchBlock: {
    height: 48,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  chipsRow: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  chip: {
    height: 36,
    width: 80,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
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
  heroCard: {
    height: 200,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  compactCard: {
    height: 100,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  lessonCard: {
    height: 70,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
});
