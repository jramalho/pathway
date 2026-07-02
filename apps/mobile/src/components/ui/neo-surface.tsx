import { StyleSheet, View, type ViewProps } from "react-native";

import { Border, Shadow } from "@/constants/theme";

export type NeoSurfaceProps = ViewProps & {
  /** Background color. Defaults to surface container. */
  backgroundColor?: string;
  /** Border color (defaults to black). */
  borderColor?: string;
  /** Border width (defaults to primary 3px). */
  borderWidth?: number;
  /** When true, renders a hard black shadow offset 6px right/down. */
  withShadow?: boolean;
};

/**
 * Neo-brutalist surface: configurable background, 3px black border, no
 * rounded corners. Optional hard shadow (a stacked black View) for
 * prominent elements. No button behaviour by default.
 */
export function NeoSurface({
  backgroundColor = "#EFEEEA",
  borderColor = "#000000",
  borderWidth = Border.primary,
  withShadow = false,
  style,
  children,
  ...rest
}: NeoSurfaceProps) {
  return (
    <View style={[styles.wrapper, style]} {...rest}>
      {withShadow && (
        <View
          style={[
            styles.shadow,
            { backgroundColor: "#000000", right: -Shadow.offset, bottom: -Shadow.offset },
          ]}
        />
      )}
      <View
        style={[
          styles.surface,
          { backgroundColor, borderColor, borderWidth },
        ]}
      >
        {children}
      </View>
    </View>
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
  surface: {
    position: "relative",
    zIndex: 1,
  },
});
