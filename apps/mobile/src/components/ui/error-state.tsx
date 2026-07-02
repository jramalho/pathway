import { StyleSheet, View } from "react-native";

import { NeoButton } from "./neo-button";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

export type ErrorStateProps = {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

/**
 * Error state: short message, optional retry button. Visually compatible
 * with the neo-brutalist system. Retry is only wired when a real handler
 * is provided.
 */
export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.message}>{message}</ThemedText>
      {retryLabel && onRetry && (
        <NeoButton label={retryLabel} variant="primary" accessibilityLabel={retryLabel} onPress={onRetry} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
});
