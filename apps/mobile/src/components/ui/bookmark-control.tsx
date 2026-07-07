import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

import { Border, Layout, Shadow } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type BookmarkControlProps = {
  /** Whether the item is currently bookmarked. */
  bookmarked: boolean;
  /** Called when the user toggles the bookmark. */
  onToggle: () => void;
  /** Accessible label, e.g. "Save React Native Performance". */
  accessibilityLabel: string;
  /** Visual size variant. Defaults to "default". */
  size?: "sm" | "default";
  /** Disable the control (e.g. during hydration). */
  disabled?: boolean;
};

const SIZES = {
  sm: { box: 32, icon: 16 },
  default: { box: 40, icon: 20 },
} as const;

/**
 * Neo-brutalist bookmark toggle. Off = off-white surface with 3px border
 * and hard shadow. On = acid-green surface, pressed-in shadow. Meets
 * 44px touch target via hitSlop when the visual box is smaller.
 */
export function BookmarkControl({
  bookmarked,
  onToggle,
  accessibilityLabel,
  size = "default",
  disabled = false,
}: BookmarkControlProps) {
  const dims = SIZES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: bookmarked, disabled }}
      onPress={onToggle}
      disabled={disabled}
      hitSlop={Math.max(0, (Layout.touchTarget - dims.box) / 2)}
      style={({ pressed }) => [
        styles.button,
        {
          width: dims.box,
          height: dims.box,
          backgroundColor: bookmarked ? tokens.color.accentGreen : tokens.color.surface,
          borderWidth: Border.primary,
          borderColor: tokens.color.black,
          opacity: disabled ? 0.5 : 1,
          transform: pressed
            ? [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }]
            : bookmarked
              ? [{ translateX: 0 }, { translateY: 0 }]
              : undefined,
        },
      ]}
    >
      <SymbolView
        name={
          bookmarked
            ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
            : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
        }
        size={dims.icon}
        tintColor={tokens.color.black}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
