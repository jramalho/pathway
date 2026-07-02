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
    text: tokens.color.text,
    textSecondary: tokens.color.textSecondary,
    black: tokens.color.black,
    mint: tokens.color.mint,
    accentGreen: tokens.color.accentGreen,
    activeGreen: tokens.color.activeGreen,
    error: tokens.color.error,
  },
  dark: {
    // The Neo-Academic aesthetic is a light, editorial surface. Dark mode
    // keeps the same palette — the design is intentionally single-mode.
    background: tokens.color.surface,
    backgroundElement: tokens.color.surfaceContainer,
    backgroundSelected: tokens.color.surfaceContainerHigh,
    text: tokens.color.text,
    textSecondary: tokens.color.textSecondary,
    black: tokens.color.black,
    mint: tokens.color.mint,
    accentGreen: tokens.color.accentGreen,
    activeGreen: tokens.color.activeGreen,
    error: tokens.color.error,
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

export const Shadow = {
  offset: tokens.shadow.offset,
  offsetPressed: tokens.shadow.offsetPressed,
} as const;

export const Layout = {
  touchTarget: tokens.layout.touchTarget,
  headerHeight: tokens.layout.headerHeight,
  contentPadding: tokens.layout.contentPadding,
  maxContentWidth: tokens.layout.maxContentWidth,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = Layout.maxContentWidth;
