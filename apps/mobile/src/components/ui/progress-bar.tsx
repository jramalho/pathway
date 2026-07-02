import { StyleSheet, View } from "react-native";

import { Border } from "@/constants/theme";

export type ProgressBarProps = {
  /** Progress value from 0 to 100. */
  value: number;
  /** Background color of the track. */
  trackColor?: string;
  /** Fill color. Defaults to active green. */
  fillColor?: string;
};

/**
 * Neo-brutalist progress bar: off-white track, black border, acid-green
 * fill. No rounded corners. Accepts 0–100.
 */
export function ProgressBar({
  value,
  trackColor = "#EFEEEA",
  fillColor = "#38FE13",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View
      style={[styles.track, { backgroundColor: trackColor, borderWidth: Border.primary }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View style={[styles.fill, { backgroundColor: fillColor, width: `${clamped}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 16,
    width: "100%",
    borderColor: "#000000",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
