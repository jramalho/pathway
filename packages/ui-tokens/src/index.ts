/**
 * Shared visual tokens for Pathway — Neo-Academic Brutalist.
 *
 * Platform-agnostic values only (colors, spacing, typography, borders,
 * shadows, layout). React Native and web components consume these but do
 * not share component implementations.
 */
export const tokens = {
  color: {
    /** App background / surface. */
    surface: "#FAF9F5",
    /** Container surface (cards, lists). */
    surfaceContainer: "#EFEEEA",
    /** Higher-contrast container surface. */
    surfaceContainerHigh: "#E9E8E4",
    /** Primary black. */
    black: "#000000",
    /** Primary text. */
    text: "#1B1C1A",
    /** Secondary text. */
    textSecondary: "#424845",
    /** Mint surface (secondary buttons, tags). */
    mint: "#D4E7DD",
    /** Accent green (primary buttons). */
    accentGreen: "#79FF5B",
    /** Active green (active tab block). */
    activeGreen: "#38FE13",
    /** Error / danger. */
    error: "#BA1A1A",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 24,
    xl: 48,
    xxl: 80,
  },
  typography: {
    /** Headings and brand. */
    heading: "Epilogue",
    /** Body, labels, tabs, buttons. */
    body: "Inter",
  },
  border: {
    /** Primary border — containers, cards, buttons, header, bottom nav. */
    primary: 3,
    /** Thin border — tags and inputs. */
    thin: 2,
  },
  shadow: {
    /** Hard shadow offset for prominent interactive elements. */
    offset: 6,
    /** Reduced shadow offset when pressed. */
    offsetPressed: 3,
  },
  layout: {
    /** Minimum touch target. */
    touchTarget: 44,
    /** Header visual height (excludes safe area). */
    headerHeight: 64,
    /** Horizontal content padding. */
    contentPadding: 24,
    /** Max content width for large screens. */
    maxContentWidth: 800,
  },
} as const;