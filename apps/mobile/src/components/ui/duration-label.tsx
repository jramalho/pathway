import { StyleSheet, Text, type TextProps } from "react-native";

import { Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type DurationLabelProps = TextProps & {
  /** Duration in minutes. */
  minutes: number;
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}m`;
}

/**
 * Duration label — small secondary-text label that formats a minute
 * count into a readable duration string. No border or background;
 * purely typographic.
 */
export function DurationLabel({ minutes, style, ...rest }: DurationLabelProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {formatDuration(minutes)}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
    fontSize: Typography.fontSizeSm,
    color: tokens.color.textSecondary,
  },
});
