import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";

/**
 * Learning Path Detail skeleton — structural loading state matching
 * the detail layout: hero, progress, CTA, section header, module cards.
 */
export function LearningPathDetailSkeleton() {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      {/* Back link */}
      <View style={styles.backLink} />

      {/* Hero card */}
      <View style={styles.heroCard}>
        <View style={styles.heroCover} />
        <View style={styles.heroBorder} />
        <View style={styles.heroContent}>
          <View style={styles.tagSkeleton} />
          <View style={styles.titleSkeleton} />
          <View style={styles.descSkeleton1} />
          <View style={styles.descSkeleton2} />
          <View style={styles.metaSkeleton} />
          <View style={styles.progressSkeleton} />
          <View style={styles.ctaSkeleton} />
        </View>
      </View>

      {/* Section header */}
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />

      {/* Module cards */}
      <View style={styles.moduleCard1} />
      <View style={styles.moduleCard2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  backLink: {
    height: 20,
    width: 180,
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  heroCard: {
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  heroCover: {
    height: 200,
    width: "100%",
    backgroundColor: "#E9E8E4",
  },
  heroBorder: {
    height: Border.primary,
    backgroundColor: "#000000",
  },
  heroContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  tagSkeleton: {
    height: 20,
    width: 80,
    backgroundColor: "#E9E8E4",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  titleSkeleton: {
    height: 36,
    width: "80%",
    backgroundColor: "#E9E8E4",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  descSkeleton1: {
    height: 18,
    width: "100%",
    backgroundColor: "#E9E8E4",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  descSkeleton2: {
    height: 18,
    width: "70%",
    backgroundColor: "#E9E8E4",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  metaSkeleton: {
    height: 16,
    width: "50%",
    backgroundColor: "#E9E8E4",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  progressSkeleton: {
    height: 16,
    width: "100%",
    backgroundColor: "#E9E8E4",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  ctaSkeleton: {
    height: 48,
    width: "100%",
    backgroundColor: "#E9E8E4",
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
  moduleCard1: {
    height: 80,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  moduleCard2: {
    height: 80,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
});
