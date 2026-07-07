import { StyleSheet, View, type ViewProps } from "react-native";

import { Border, Shadow, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type CardShellProps = ViewProps & {
  /** Background color. Defaults to raised surface. */
  backgroundColor?: string;
  /** Border color. Defaults to black. */
  borderColor?: string;
  /** Border width. Defaults to primary (3px). */
  borderWidth?: number;
  /** When true, renders a hard offset shadow behind the card. */
  withShadow?: boolean;
  /** Internal padding. Defaults to Spacing.three (12). */
  padding?: number;
  /** Gap between children. */
  gap?: number;
};

/**
 * CardShell — the base neo-brutalist card container.
 *
 * Configurable background, 3px black border, optional hard shadow,
 * optional rounded corners (defaults to none). Content components
 * compose on top of this instead of re-implementing the border/shadow
 * pattern each time.
 */
export function CardShell({
  backgroundColor = tokens.color.surfaceContainer,
  borderColor = tokens.color.black,
  borderWidth = Border.primary,
  withShadow = false,
  padding = Spacing.three,
  gap,
  style,
  children,
  ...rest
}: CardShellProps) {
  return (
    <View style={styles.wrapper}>
      {withShadow && (
        <View
          style={[
            styles.shadow,
            {
              backgroundColor: tokens.color.black,
              right: -Shadow.offset,
              bottom: -Shadow.offset,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.card,
          {
            backgroundColor,
            borderColor,
            borderWidth,
            padding,
            ...(gap !== undefined ? { gap } : {}),
          },
          style,
        ]}
        {...rest}
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
    width: "100%",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
  },
});
