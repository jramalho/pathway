import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LoadingStateProps = {
  /** Number of skeleton blocks to show. */
  count?: number;
};

/**
 * Structural skeleton loader — neo-brutalist blocks with borders, no
 * shimmer or gradient. Used while real content loads from the API.
 */
export function LoadingState({ count = 3 }: LoadingStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.block} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  block: {
    height: 120,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
  },
});
