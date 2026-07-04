import { Pressable, StyleSheet, Text, View } from "react-native";

import { Border, Shadow, Spacing } from "@/constants/theme";

export type SavedTab = "lessons" | "paths";

export type SavedSegmentedControlProps = {
  activeTab: SavedTab;
  onSelect: (tab: SavedTab) => void;
  disabled?: boolean;
};

/**
 * Segmented control for the Saved screen: LESSONS / PATHS.
 * Neo-brutalist rectangular buttons, no pill. Active = black bg + off-white
 * text. Inactive = off-white bg + black text + hard shadow.
 */
export function SavedSegmentedControl({ activeTab, onSelect, disabled }: SavedSegmentedControlProps) {
  return (
    <View style={styles.container}>
      <SegmentButton
        label="LESSONS"
        isActive={activeTab === "lessons"}
        disabled={disabled}
        onSelect={() => onSelect("lessons")}
        a11yLabel="Show saved lessons"
      />
      <SegmentButton
        label="PATHS"
        isActive={activeTab === "paths"}
        disabled={disabled}
        onSelect={() => onSelect("paths")}
        a11yLabel="Show saved learning paths"
      />
    </View>
  );
}

function SegmentButton({
  label,
  isActive,
  disabled,
  onSelect,
  a11yLabel,
}: {
  label: string;
  isActive: boolean;
  disabled?: boolean;
  onSelect: () => void;
  a11yLabel: string;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ selected: isActive, disabled: !!disabled }}
      disabled={disabled}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.button,
        isActive ? styles.buttonActive : styles.buttonInactive,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  button: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Border.primary,
    borderColor: "#000000",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  buttonActive: {
    backgroundColor: "#000000",
  },
  buttonInactive: {
    backgroundColor: "#FAF9F5",
    // Hard shadow on inactive tabs.
    shadowColor: "#000000",
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#000000",
  },
  labelActive: {
    color: "#FAF9F5",
  },
});
