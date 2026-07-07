import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

/**
 * Learning Path Detail skeleton — structural loading state matching
 * the detail layout: back link, hero (cover + content), section header,
 * and module cards. Uses tokens, no shimmer.
 */
export function LearningPathDetailSkeleton() {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      <View style={styles.backLink} />
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
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />
      <View style={styles.moduleCard1} />
      <View style={styles.moduleCard2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.four },
  backLink: {
    height: 20,
    width: 180,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  heroCard: {
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  heroCover: {
    height: 200,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainerHigh,
  },
  heroBorder: { height: Border.primary, backgroundColor: tokens.color.black },
  heroContent: { padding: Spacing.four, gap: Spacing.three },
  tagSkeleton: {
    height: 20,
    width: 80,
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  titleSkeleton: {
    height: 36,
    width: "80%",
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  descSkeleton1: {
    height: 18,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  descSkeleton2: {
    height: 18,
    width: "70%",
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  metaSkeleton: {
    height: 16,
    width: "50%",
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  progressSkeleton: {
    height: 16,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  ctaSkeleton: {
    height: 48,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainerHigh,
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
  sectionDivider: { height: Border.primary, width: "100%", backgroundColor: tokens.color.black },
  moduleCard1: {
    height: 80,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  moduleCard2: {
    height: 80,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
});
