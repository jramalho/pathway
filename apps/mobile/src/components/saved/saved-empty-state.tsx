import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type SavedEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: "bookmark" | "warning";
};

/**
 * Empty state for the Saved screen — centered card with off-white surface,
 * 3px black border, hard shadow. Simple geometric icon, no illustration.
 */
export function SavedEmptyState({ title, description, actionLabel, onAction, icon = "bookmark" }: SavedEmptyStateProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.shadow} />
      <View style={styles.card}>
        {/* Icon */}
        <View style={styles.iconContainer} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={
              icon === "warning"
                ? { ios: "exclamationmark.triangle", android: "warning", web: "warning" }
                : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
            }
            size={32}
            tintColor={tokens.color.black}
          />
        </View>

        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
          {description}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginVertical: Spacing.four,
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: "flex-start",
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
    fontFamily: Typography.headingFamily,
    fontSize: 24,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 30,
    color: tokens.color.black,
  },
  description: {
    fontFamily: Typography.bodyFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
  button: {
    minHeight: 44,
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeSm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: tokens.color.black,
  },
});
