import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { Border, Shadow } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

/**
 * Neo-brutalist pressable: 3px black border + hard black shadow offset
 * 6px right/down. When pressed, the element advances ~3px and the shadow
 * shrinks to ~3px, simulating a physical press.
 *
 * The hard shadow is a second black View stacked behind the content View,
 * so it works without native soft-shadow APIs.
 */
export type NeoPressableProps = React.ComponentProps<typeof Pressable> & {
  /** Background color of the surface. */
  backgroundColor?: string;
  /** Border color (defaults to black). */
  borderColor?: string;
  /** Override the resting shadow offset (defaults to 6). */
  shadowOffset?: number;
};

export function NeoPressable({
  backgroundColor = tokens.color.surface,
  borderColor = tokens.color.black,
  shadowOffset = Shadow.offset,
  style,
  children,
  ...rest
}: NeoPressableProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.wrapper,
        { backgroundColor, borderColor, borderWidth: Border.primary },
        style as ViewStyle,
      ]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          {/* Hard shadow layer */}
          <View
            style={[
              styles.shadow,
              {
                backgroundColor: tokens.color.black,
                right: -(pressed ? Shadow.offsetPressed : shadowOffset),
                bottom: -(pressed ? Shadow.offsetPressed : shadowOffset),
              },
            ]}
          />
          {/* Content layer */}
          <View
            style={[
              styles.content,
              {
                transform: pressed
                  ? [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }]
                  : [{ translateX: 0 }, { translateY: 0 }],
              },
            ]}
          >
            {children as React.ReactNode}
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignSelf: "flex-start",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
});
