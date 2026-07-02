import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

export type SectionHeaderProps = {
  title: string;
};

/**
 * Section header: Epilogue uppercase title with a 3px black divider below.
 * Used across Home sections (Featured Paths, Recommended Lessons, etc.).
 */
export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#000000",
  },
  divider: {
    height: Border.primary,
    backgroundColor: "#000000",
    width: "100%",
  },
});
