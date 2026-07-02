/**
 * Foundation tokens — raw visual values, platform-agnostic.
 *
 * These are the source of truth for all semantic tokens. Components
 * should never reference foundation values directly — use semantic
 * tokens from semantic.ts instead.
 */
export const foundation = {
  color: {
    // Surfaces
    canvas: "#FAF9F5",
    raised: "#EFEEEA",
    raisedHigh: "#E9E8E4",

    // Text
    ink: "#1B1C1A",
    inkMuted: "#424845",

    // Accents
    black: "#000000",
    mint: "#D4E7DD",
    accentGreen: "#79FF5B",
    activeGreen: "#38FE13",

    // Feedback
    danger: "#BA1A1A",
  },
  spacing: {
    s0: 0,
    s50: 2,
    s100: 4,
    s200: 8,
    s300: 12,
    s400: 24,
    s500: 48,
    s600: 80,
  },
  typography: {
    headingFamily: "Epilogue",
    bodyFamily: "Inter",
    headingWeightBold: 700,
    headingWeightBlack: 800,
    bodyWeightRegular: 400,
    bodyWeightMedium: 500,
    bodyWeightSemibold: 600,
    bodyWeightBold: 700,
  },
  border: {
    widthStrong: 3,
    widthThin: 2,
  },
  radius: {
    none: 0,
  },
  shadow: {
    offsetResting: 6,
    offsetPressed: 3,
  },
  icon: {
    sizeSm: 16,
    sizeMd: 24,
    sizeLg: 32,
  },
  touch: {
    targetMin: 44,
  },
  layout: {
    headerHeight: 64,
    contentPadding: 24,
    maxContentWidth: 800,
  },
  zIndex: {
    base: 0,
    content: 1,
    header: 10,
    tabbar: 20,
    overlay: 100,
  },
} as const;
