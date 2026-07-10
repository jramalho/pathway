/**
 * Mobile theme constants — Neo-Academic Brutalist.
 *
 * Colors, spacing, borders and layout values come from the shared
 * `@pathway/ui-tokens` package so web and mobile stay in sync on the
 * values that make sense to share. Font family names are resolved per
 * platform here (the shared package only stores the logical name).
 */

import { tokens } from "@pathway/ui-tokens";

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    background: tokens.color.surface,
    backgroundElement: tokens.color.surfaceContainer,
    backgroundSelected: tokens.color.surfaceContainerHigh,
    surfaceHeader: tokens.color.surfaceHeader,
    surfaceHeaderHover: tokens.color.surfaceHeaderHover,
    surfaceAccent: tokens.color.surfaceAccent,
    surfaceAction: tokens.color.surfaceAction,
    surfaceActionHover: tokens.color.surfaceActionHover,
    surfaceActionPressed: tokens.color.activeGreen,
    text: tokens.color.text,
    textSecondary: tokens.color.textSecondary,
    textOnHeader: tokens.color.textOnHeader,
    textOnHeaderMuted: tokens.color.textOnHeaderMuted,
    textOnAccent: tokens.color.textOnAccent,
    black: tokens.color.black,
    mint: tokens.color.mint,
    accentGreen: tokens.color.accentGreen,
    activeGreen: tokens.color.activeGreen,
    accentFocus: tokens.color.accentFocus,
    error: tokens.color.error,
    success: tokens.color.success,
    warning: tokens.color.warning,
  },
  dark: {
    // The Neo-Academic aesthetic is a light, editorial surface. Dark mode
    // keeps the same palette — the design is intentionally single-mode.
    background: tokens.color.surface,
    backgroundElement: tokens.color.surfaceContainer,
    backgroundSelected: tokens.color.surfaceContainerHigh,
    surfaceHeader: tokens.color.surfaceHeader,
    surfaceHeaderHover: tokens.color.surfaceHeaderHover,
    surfaceAccent: tokens.color.surfaceAccent,
    surfaceAction: tokens.color.surfaceAction,
    surfaceActionHover: tokens.color.surfaceActionHover,
    surfaceActionPressed: tokens.color.activeGreen,
    text: tokens.color.text,
    textSecondary: tokens.color.textSecondary,
    textOnHeader: tokens.color.textOnHeader,
    textOnHeaderMuted: tokens.color.textOnHeaderMuted,
    textOnAccent: tokens.color.textOnAccent,
    black: tokens.color.black,
    mint: tokens.color.mint,
    accentGreen: tokens.color.accentGreen,
    activeGreen: tokens.color.activeGreen,
    accentFocus: tokens.color.accentFocus,
    error: tokens.color.error,
    success: tokens.color.success,
    warning: tokens.color.warning,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

/**
 * Font family names. The shared tokens store the logical family name
 * ("Epilogue", "Inter"); here we resolve the platform-specific PostScript
 * name so React Native can find the loaded font.
 */
export const Fonts = Platform.select({
  ios: {
    heading: "Epilogue",
    body: "Inter",
    sans: "Inter",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    heading: "Epilogue",
    body: "Inter",
    sans: "Inter",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    heading: "var(--font-display)",
    body: "var(--font-body)",
    sans: "var(--font-body)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: tokens.spacing.xs,
  two: tokens.spacing.sm,
  three: tokens.spacing.md,
  four: tokens.spacing.lg,
  five: tokens.spacing.xl,
  six: tokens.spacing.xxl,
} as const;

export const Border = {
  primary: tokens.border.primary,
  thin: tokens.border.thin,
} as const;

export const Radius = {
  none: tokens.radius.none,
  sm: tokens.radius.sm,
  md: tokens.radius.md,
} as const;

export const Shadow = {
  offset: tokens.shadow.offset,
  offsetPressed: tokens.shadow.offsetPressed,
  offsetHeader: tokens.shadow.offsetHeader,
} as const;

export const IconSize = {
  sm: tokens.icon.sizeSm,
  md: tokens.icon.sizeMd,
  lg: tokens.icon.sizeLg,
} as const;

export const Typography = {
  headingFamily: tokens.typography.heading,
  bodyFamily: tokens.typography.body,
  headingWeightBold: tokens.typography.headingWeightBold,
  headingWeightBlack: tokens.typography.headingWeightBlack,
  bodyWeightRegular: tokens.typography.bodyWeightRegular,
  bodyWeightMedium: tokens.typography.bodyWeightMedium,
  bodyWeightSemibold: tokens.typography.bodyWeightSemibold,
  bodyWeightBold: tokens.typography.bodyWeightBold,
  fontSizeXs: tokens.typography.fontSizeXs,
  fontSizeSm: tokens.typography.fontSizeSm,
  fontSizeMd: tokens.typography.fontSizeMd,
  fontSizeLg: tokens.typography.fontSizeLg,
  fontSizeXl: tokens.typography.fontSizeXl,
  fontSize2xl: tokens.typography.fontSize2xl,
  fontSize3xl: tokens.typography.fontSize3xl,
  lineHeightTight: tokens.typography.lineHeightTight,
  lineHeightNormal: tokens.typography.lineHeightNormal,
  lineHeightRelaxed: tokens.typography.lineHeightRelaxed,
} as const;

export const Layout = {
  touchTarget: tokens.layout.touchTarget,
  headerHeight: tokens.layout.headerHeight,
  contentPadding: tokens.layout.contentPadding,
  maxContentWidth: tokens.layout.maxContentWidth,
} as const;

// Tab bar height excluding the bottom safe area (which Screen adds separately).
// barOuter paddingTop(10) + barShell minHeight(98) = 108 on iOS.
export const BottomTabInset = Platform.select({ ios: 108, android: 80 }) ?? 0;
export const MaxContentWidth = Layout.maxContentWidth;
