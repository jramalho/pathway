import { Pressable, StyleSheet, Text } from "react-native";

import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type FilterChipProps = {
  label: string;
  /** Whether the chip is active/selected. */
  active: boolean;
  /** Called when the chip is pressed. */
  onPress: () => void;
  /** Accessibility label. Defaults to the label prop. */
  accessibilityLabel?: string;
};

/**
 * Neo-brutalist filter chip. Inactive = mint with 2px border.
 * Active = acid green with 3px border. Press animation shifts 3px
 * and reduces shadow. Meets 36px minimum height (comfortable touch
 * target when combined with padding).
 */
export function FilterChip({ label, active, onPress, accessibilityLabel }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>
        {active && <Text style={styles.checkmark}>✓ </Text>}
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: tokens.color.accentGreen,
    borderWidth: Border.primary,
  },
  chipPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  label: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: 13,
    color: tokens.color.black,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelActive: {
    fontWeight: String(Typography.headingWeightBlack) as "800",
  },
  checkmark: {
    fontWeight: String(Typography.headingWeightBlack) as "800",
  },
});
