import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";

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
            tintColor="#000000"
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
    backgroundColor: "#000000",
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    color: "#000000",
  },
  description: {
    fontFamily: "Inter",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  button: {
    minHeight: 44,
    backgroundColor: "#79FF5B",
    borderWidth: Border.primary,
    borderColor: "#000000",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#000000",
  },
});
