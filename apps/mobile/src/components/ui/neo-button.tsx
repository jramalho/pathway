import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { Border, Layout, Shadow, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type NeoButtonVariant = "primary" | "secondary" | "ghost";

export type NeoButtonProps = Omit<React.ComponentProps<typeof Pressable>, "style"> & {
  label: string;
  variant?: NeoButtonVariant;
  accessibilityLabel: string;
  /** Show a loading indicator instead of the label. */
  loading?: boolean;
  style?: ViewStyle;
};

const variantColors: Record<NeoButtonVariant, { bg: string; border: boolean; shadow: boolean }> = {
  primary: { bg: tokens.color.surfaceAction, border: true, shadow: true },
  secondary: { bg: tokens.color.surfaceAccent, border: true, shadow: true },
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
  loading = false,
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
      accessibilityState={{ disabled: !!disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: config.bg },
        config.border && { borderWidth: Border.primary, borderColor: tokens.color.black },
        variant === "ghost" && styles.ghost,
        (disabled || loading) && styles.disabled,
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
          {loading ? (
            <Text style={styles.label}>···</Text>
          ) : (
            <Text style={styles.label}>{label}</Text>
          )}
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
    borderBottomColor: tokens.color.black,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeSm,
    color: tokens.color.black,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
