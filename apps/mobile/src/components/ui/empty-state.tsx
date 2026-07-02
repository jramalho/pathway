import { StyleSheet, View } from "react-native";

import { NeoButton } from "./neo-button";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Structural empty state: large title, description, optional action.
 * No cartoon illustrations.
 */
export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText themeColor="textSecondary" style={styles.description}>
          {description}
        </ThemedText>
      )}
      {actionLabel && onAction && (
        <NeoButton label={actionLabel} variant="secondary" accessibilityLabel={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
