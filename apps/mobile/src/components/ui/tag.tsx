import { StyleSheet, Text, type TextProps } from "react-native";

import { Border, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type TagProps = TextProps & {
  /** Background color. Defaults to mint. */
  backgroundColor?: string;
  /** Text color. Defaults to black. */
  color?: string;
};

/**
 * Small neo-brutalist tag/badge: 2px black border, uppercase Inter label,
 * no rounded corners. Mint or off-white background.
 */
export function Tag({
  backgroundColor = tokens.color.mint,
  color = tokens.color.black,
  style,
  children,
  ...rest
}: TagProps) {
  return (
    <Text
      style={[styles.tag, { backgroundColor, color, borderWidth: Border.thin, borderColor: tokens.color.black }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: 11,
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
});
