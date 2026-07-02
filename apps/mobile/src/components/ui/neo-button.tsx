import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { Border, Layout, Shadow } from "@/constants/theme";

export type NeoButtonVariant = "primary" | "secondary" | "ghost";

export type NeoButtonProps = Omit<React.ComponentProps<typeof Pressable>, "style"> & {
  label: string;
  variant?: NeoButtonVariant;
  accessibilityLabel: string;
  style?: ViewStyle;
};

const variantColors: Record<NeoButtonVariant, { bg: string; border: boolean; shadow: boolean }> = {
  primary: { bg: "#79FF5B", border: true, shadow: true },
  secondary: { bg: "#D4E7DD", border: true, shadow: true },
  ghost: { bg: "transparent", border: false, shadow: false },
};

/**
 * Neo-brutalist button. Primary = accent green, secondary = mint,
 * ghost = transparent with a bottom black border. Primary and secondary
 * have the hard shadow + press animation; ghost is minimal.
 */
export function NeoButton({
  label,
  variant = "primary",
  accessibilityLabel,
  style,
  onPress,
  disabled,
  ...rest
}: NeoButtonProps) {
  const config = variantColors[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: config.bg },
        config.border && { borderWidth: Border.primary, borderColor: "#000000" },
        variant === "ghost" && styles.ghost,
        style,
      ]}
      {...rest}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.inner,
            config.shadow && {
              transform: pressed
                ? [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }]
                : [{ translateX: 0 }, { translateY: 0 }],
            },
          ]}
        >
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: "relative",
    minHeight: Layout.touchTarget,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ghost: {
    borderBottomWidth: Border.primary,
    borderBottomColor: "#000000",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
