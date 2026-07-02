import { StyleSheet, Text, type TextProps } from "react-native";

import { Border } from "@/constants/theme";

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
  backgroundColor = "#D4E7DD",
  color = "#000000",
  style,
  children,
  ...rest
}: TagProps) {
  return (
    <Text
      style={[styles.tag, { backgroundColor, color, borderWidth: Border.thin, borderColor: "#000000" }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 11,
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
});
