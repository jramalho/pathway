import { StyleSheet, View } from "react-native";
import { tokens } from "@pathway/ui-tokens";

import { Border, Spacing } from "@/constants/theme";

/**
 * Profile skeleton — structural loading state that mimics the Profile
 * layout: avatar, title, tags, overview cards, and path rows.
 * No shimmer, no gradient. Used during hydration and API loading.
 */
export function ProfileSkeleton() {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      {/* Avatar */}
      <View style={styles.avatar} />

      {/* Title */}
      <View style={styles.title} />

      {/* Tags */}
      <View style={styles.tagRow}>
        <View style={styles.tag1} />
        <View style={styles.tag2} />
      </View>

      {/* Description */}
      <View style={styles.description} />

      {/* Overview section header */}
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />

      {/* Overview cards */}
      <View style={styles.overviewGrid}>
        <View style={styles.overviewCard} />
        <View style={styles.overviewCard} />
        <View style={styles.overviewCard} />
        <View style={styles.overviewCard} />
      </View>

      {/* Path rows */}
      <View style={styles.sectionHeader} />
      <View style={styles.sectionDivider} />
      <View style={styles.pathRow1} />
      <View style={styles.pathRow2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  avatar: {
    width: 112,
    height: 112,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  title: {
    height: 32,
    width: "70%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  tagRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  tag1: {
    height: 24,
    width: 120,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  tag2: {
    height: 24,
    width: 130,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  description: {
    height: 20,
    width: "90%",
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
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  overviewCard: {
    width: "48%",
    flexGrow: 1,
    height: 100,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  pathRow1: {
    height: 90,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
  pathRow2: {
    height: 90,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
});
