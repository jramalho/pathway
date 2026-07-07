import { StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { Border } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LessonStatus = "completed" | "current" | "upcoming" | "default";

export type LessonStatusIndicatorProps = {
  status: LessonStatus;
};

const CONFIG: Record<LessonStatus, { label: string; bg: string; icon: React.ComponentProps<typeof SymbolView>["name"] }> = {
  completed: {
    label: "DONE",
    bg: tokens.color.activeGreen,
    icon: { ios: "checkmark", android: "check", web: "check" },
  },
  current: {
    label: "NOW",
    bg: tokens.color.accentGreen,
    icon: { ios: "play.fill", android: "play_arrow", web: "play_arrow" },
  },
  upcoming: {
    label: "NEXT",
    bg: tokens.color.mint,
    icon: { ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" },
  },
  default: {
    label: "",
    bg: "transparent",
    icon: { ios: "circle", android: "circle", web: "circle" },
  },
};

/**
 * Lesson status indicator — a compact pill that communicates the lesson
 * state with BOTH an icon and a text label, so the state never relies on
 * color alone. Used inside lesson rows and the lesson header.
 *
 * - completed: acid-green pill with a checkmark and "DONE"
 * - current: accent-green pill with a play icon and "NOW"
 * - upcoming: mint pill with an arrow and "NEXT"
 * - default: renders nothing (no decorative noise)
 */
export function LessonStatusIndicator({ status }: LessonStatusIndicatorProps) {
  if (status === "default") return null;
  const config = CONFIG[status];

  return (
    <View
      style={[styles.pill, { backgroundColor: config.bg }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <SymbolView name={config.icon} size={10} tintColor={tokens.color.black} />
      <ThemedText type="smallBold" style={styles.label}>{config.label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: tokens.color.black,
  },
});
