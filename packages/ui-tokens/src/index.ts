/**
 * Shared visual tokens for Pathway.
 *
 * Platform-agnostic values only (colors, spacing, typography, borders,
 * shadows, layout). React Native and web components consume these but
 * do not share component implementations.
 *
 * Structure:
 *   foundation.ts — raw values, never referenced directly by components
 *   semantic.ts   — purpose-named tokens, the API components use
 *   index.ts      — public entrypoint
 */
import { foundation } from "./foundation.ts";
import { semantic } from "./semantic.ts";

export { foundation } from "./foundation.ts";
export { semantic } from "./semantic.ts";

// Backward-compatible flat export for existing consumers.
export const tokens = {
  color: {
    surface: semantic.color.surfaceCanvas,
    surfaceContainer: semantic.color.surfaceRaised,
    surfaceContainerHigh: semantic.color.surfaceMuted,
    surfaceHeader: semantic.color.surfaceHeader,
    surfaceHeaderHover: semantic.color.surfaceHeaderHover,
    surfaceAccent: semantic.color.surfaceAccent,
    surfaceAction: semantic.color.surfaceAction,
    surfaceActionHover: semantic.color.surfaceActionHover,
    surfaceActionPressed: semantic.color.surfaceActionPressed,
    black: semantic.color.borderStrong,
    text: semantic.color.textPrimary,
    textSecondary: semantic.color.textSecondary,
    textOnHeader: semantic.color.textOnHeader,
    textOnHeaderMuted: semantic.color.textOnHeaderMuted,
    textOnAccent: semantic.color.textOnAccent,
    mint: semantic.color.accentSecondary,
    accentGreen: semantic.color.accentPrimary,
    activeGreen: semantic.color.accentActive,
    accentFocus: semantic.color.accentFocus,
    error: semantic.color.feedbackDanger,
    success: semantic.color.feedbackSuccess,
    warning: semantic.color.feedbackWarning,
  },
  spacing: {
    xs: semantic.spacing.xs,
    sm: semantic.spacing.sm,
    md: semantic.spacing.md,
    lg: semantic.spacing.lg,
    xl: semantic.spacing.xl,
    xxl: semantic.spacing.xxl,
  },
  typography: {
    heading: semantic.typography.headingFamily,
    body: semantic.typography.bodyFamily,
    headingWeightBold: semantic.typography.headingWeightBold,
    headingWeightBlack: semantic.typography.headingWeightBlack,
    bodyWeightRegular: semantic.typography.bodyWeightRegular,
    bodyWeightMedium: semantic.typography.bodyWeightMedium,
    bodyWeightSemibold: semantic.typography.bodyWeightSemibold,
    bodyWeightBold: semantic.typography.bodyWeightBold,
    fontSizeXs: semantic.typography.fontSizeXs,
    fontSizeSm: semantic.typography.fontSizeSm,
    fontSizeMd: semantic.typography.fontSizeMd,
    fontSizeLg: semantic.typography.fontSizeLg,
    fontSizeXl: semantic.typography.fontSizeXl,
    fontSize2xl: semantic.typography.fontSize2xl,
    fontSize3xl: semantic.typography.fontSize3xl,
    lineHeightTight: semantic.typography.lineHeightTight,
    lineHeightNormal: semantic.typography.lineHeightNormal,
    lineHeightRelaxed: semantic.typography.lineHeightRelaxed,
  },
  border: {
    primary: semantic.border.widthStrong,
    thin: semantic.border.widthThin,
  },
  radius: {
    none: semantic.radius.none,
    sm: semantic.radius.sm,
    md: semantic.radius.md,
  },
  shadow: {
    offset: semantic.shadow.offsetResting,
    offsetPressed: semantic.shadow.offsetPressed,
    offsetHeader: semantic.shadow.offsetHeader,
  },
  icon: {
    sizeSm: semantic.icon.sizeSm,
    sizeMd: semantic.icon.sizeMd,
    sizeLg: semantic.icon.sizeLg,
  },
  layout: {
    touchTarget: semantic.touch.targetMin,
    headerHeight: semantic.layout.headerHeight,
    contentPadding: semantic.layout.contentPadding,
    maxContentWidth: semantic.layout.maxContentWidth,
  },
  zIndex: {
    base: semantic.zIndex.base,
    content: semantic.zIndex.content,
    header: semantic.zIndex.header,
    tabbar: semantic.zIndex.tabbar,
    overlay: semantic.zIndex.overlay,
  },
} as const;
