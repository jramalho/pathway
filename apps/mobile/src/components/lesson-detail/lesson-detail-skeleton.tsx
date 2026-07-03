import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";

/**
 * Lesson detail skeleton — structural loading state matching the
 * lesson detail layout: context, tags, title, summary, media, body, takeaway.
 */
export function LessonDetailSkeleton() {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      <View style={styles.contextBlock} />
      <View style={styles.tagsRow}>
        <View style={styles.tag} />
        <View style={styles.tag} />
      </View>
      <View style={styles.titleBlock} />
      <View style={styles.summaryBlock1} />
      <View style={styles.summaryBlock2} />
      <View style={styles.mediaBlock} />
      <View style={styles.progressBlock} />
      <View style={styles.bodyBlock1} />
      <View style={styles.bodyBlock2} />
      <View style={styles.bodyBlock3} />
      <View style={styles.takeawayBlock} />
      <View style={styles.completionBlock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  contextBlock: {
    height: 40,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  tagsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  tag: {
    height: 24,
    width: 80,
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  titleBlock: {
    height: 36,
    width: "80%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  summaryBlock1: {
    height: 18,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  summaryBlock2: {
    height: 18,
    width: "70%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  mediaBlock: {
    aspectRatio: 16 / 9,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  progressBlock: {
    height: 60,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  bodyBlock1: {
    height: 18,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  bodyBlock2: {
    height: 18,
    width: "90%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  bodyBlock3: {
    height: 18,
    width: "60%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.thin,
    borderColor: "#000000",
  },
  takeawayBlock: {
    height: 100,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
  completionBlock: {
    height: 120,
    width: "100%",
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
  },
});
