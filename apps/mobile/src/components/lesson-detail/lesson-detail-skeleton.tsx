import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

/**
 * Lesson detail skeleton — structural loading state matching the
 * lesson detail layout: context breadcrumb, tags, title, summary,
 * media, progress, body blocks, takeaway, completion, navigation.
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

const surface = tokens.color.surfaceContainer;
const surfaceHigh = tokens.color.surfaceContainerHigh;
const black = tokens.color.black;

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  contextBlock: {
    height: 40,
    width: "100%",
    backgroundColor: surface,
    borderWidth: Border.thin,
    borderColor: black,
  },
  tagsRow: { flexDirection: "row", gap: Spacing.two },
  tag: {
    height: 24,
    width: 80,
    backgroundColor: surface,
    borderWidth: Border.thin,
    borderColor: black,
  },
  titleBlock: {
    height: 36,
    width: "80%",
    backgroundColor: surface,
    borderWidth: Border.thin,
    borderColor: black,
  },
  summaryBlock1: {
    height: 18,
    width: "100%",
    backgroundColor: surface,
    borderWidth: Border.thin,
    borderColor: black,
  },
  summaryBlock2: {
    height: 18,
    width: "70%",
    backgroundColor: surface,
    borderWidth: Border.thin,
    borderColor: black,
  },
  mediaBlock: {
    aspectRatio: 16 / 9,
    width: "100%",
    backgroundColor: surface,
    borderWidth: Border.primary,
    borderColor: black,
  },
  progressBlock: {
    height: 60,
    width: "100%",
    backgroundColor: surface,
    borderWidth: Border.primary,
    borderColor: black,
  },
  bodyBlock1: {
    height: 18,
    width: "100%",
    backgroundColor: surfaceHigh,
    borderWidth: Border.thin,
    borderColor: black,
  },
  bodyBlock2: {
    height: 18,
    width: "90%",
    backgroundColor: surfaceHigh,
    borderWidth: Border.thin,
    borderColor: black,
  },
  bodyBlock3: {
    height: 18,
    width: "60%",
    backgroundColor: surfaceHigh,
    borderWidth: Border.thin,
    borderColor: black,
  },
  takeawayBlock: {
    height: 100,
    width: "100%",
    backgroundColor: surface,
    borderWidth: Border.primary,
    borderColor: black,
  },
  completionBlock: {
    height: 120,
    width: "100%",
    backgroundColor: surface,
    borderWidth: Border.primary,
    borderColor: black,
  },
});
