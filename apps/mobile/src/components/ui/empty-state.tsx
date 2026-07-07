import { StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { NeoButton } from "./neo-button";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type EmptyStateIcon = "none" | "bookmark" | "warning" | "grid";

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Optional geometric icon to differentiate the state type. */
  icon?: EmptyStateIcon;
};

const iconNames: Record<Exclude<EmptyStateIcon, "none">, React.ComponentProps<typeof SymbolView>["name"]> = {
  bookmark: { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" },
  warning: { ios: "exclamationmark.triangle", android: "warning", web: "warning" },
  grid: { ios: "square.grid.2x2", android: "grid_view", web: "grid_view" },
};

/**
 * Structural empty state: optional geometric icon, large title, description,
 * optional action. No cartoon illustrations. The icon differentiates
 * empty (bookmark), unavailable (warning), and content-coming (grid)
 * without relying on color alone.
 */
export function EmptyState({ title, description, actionLabel, onAction, icon = "none" }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon !== "none" && (
        <View style={styles.iconContainer} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={iconNames[icon]}
            size={28}
            tintColor={tokens.color.black}
          />
        </View>
      )}
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
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
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
