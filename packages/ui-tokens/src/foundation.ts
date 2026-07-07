/**
 * Foundation tokens — raw visual values, platform-agnostic.
 *
 * These are the source of truth for all semantic tokens. Components
 * should never reference foundation values directly — use semantic
 * tokens from semantic.ts instead.
 */
export const foundation = {
  color: {
    // Surfaces — warm off-whites
    canvas: "#FAF9F5",
    raised: "#EFEEEA",
    raisedHigh: "#E9E8E4",

    // Header surface — deep forest green
    header: "#0F3D2E",
    headerHover: "#14503B",

    // Accent surfaces
    mint: "#D4E7DD",
    accentGreen: "#79FF5B",
    accentGreenHover: "#5FE03D",
    activeGreen: "#38FE13",

    // Text
    ink: "#1B1C1A",
    inkMuted: "#424845",
    onHeader: "#FAF9F5",
    onHeaderMuted: "#C9D6CF",

    // Borders
    black: "#000000",

    // Feedback
    danger: "#BA1A1A",
    success: "#1B6B3A",
    warning: "#8B5A1A",
    focus: "#38FE13",
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
    // Numeric font sizes (px) — web converts to rem in tokens.stylex.ts
    fontSizeXs: 12,
    fontSizeSm: 14,
    fontSizeMd: 16,
    fontSizeLg: 20,
    fontSizeXl: 24,
    fontSize2xl: 32,
    fontSize3xl: 40,
    // Numeric line heights (px)
    lineHeightTight: 1.15,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.7,
  },
  border: {
    widthStrong: 3,
    widthThin: 2,
  },
  radius: {
    none: 0,
    sm: 2,
    md: 4,
  },
  shadow: {
    offsetResting: 6,
    offsetPressed: 3,
    offsetHeader: 4,
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
