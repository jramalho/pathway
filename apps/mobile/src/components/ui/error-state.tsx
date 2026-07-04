import { StyleSheet, View } from "react-native";

import { NeoButton } from "./neo-button";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

export type ErrorStateProps = {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  /** Optional secondary action (e.g. "Back to Explore"). */
  secondaryLabel?: string;
  onSecondary?: () => void;
};

/**
 * Error state: short message, optional retry button, optional secondary
 * action. Visually compatible with the neo-brutalist system. Retry and
 * secondary actions are only wired when real handlers are provided.
 */
export function ErrorState({ message, retryLabel, onRetry, secondaryLabel, onSecondary }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.message}>{message}</ThemedText>
      {retryLabel && onRetry && (
        <NeoButton label={retryLabel} variant="primary" accessibilityLabel={retryLabel} onPress={onRetry} />
      )}
      {secondaryLabel && onSecondary && (
        <NeoButton
          label={secondaryLabel}
          variant="secondary"
          accessibilityLabel={secondaryLabel}
          onPress={onSecondary}
        />
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
