import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, ThemeColor } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "small" | "smallBold" | "subtitle" | "link" | "linkPrimary" | "code";
  themeColor?: ThemeColor;
};

/**
 * Text component using Epilogue for headings/title and Inter for body.
 * Consumes the Neo-Academic color palette from the theme.
 */
export function ThemedText({ style, type = "default", themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? "text"] },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const headingFont = Fonts?.heading ?? "Epilogue";
const bodyFont = Fonts?.body ?? "Inter";

const styles = StyleSheet.create({
  small: {
    fontFamily: bodyFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  smallBold: {
    fontFamily: bodyFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  default: {
    fontFamily: bodyFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  title: {
    fontFamily: headingFont,
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 52,
  },
  subtitle: {
    fontFamily: headingFont,
    fontSize: 32,
    lineHeight: 44,
    fontWeight: "700",
  },
  link: {
    fontFamily: bodyFont,
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    fontFamily: bodyFont,
    lineHeight: 30,
    fontSize: 14,
    color: tokens.color.black,
  },
  code: {
    fontFamily: Fonts?.mono ?? "monospace",
    fontWeight: Platform.select({ android: "700" }) ?? "500",
    fontSize: 12,
  },
});
