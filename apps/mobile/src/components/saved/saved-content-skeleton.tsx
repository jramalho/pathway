import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

/**
 * Skeleton for the Saved screen content area — solid blocks with borders,
 * no shimmer or gradient. Used during hydration and API loading.
 */
export function SavedContentSkeleton() {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      {Array.from({ length: 2 }).map((_, i) => (
        <View key={i} style={styles.card} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  card: {
    height: 200,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
});
