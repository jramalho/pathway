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
    black: semantic.color.borderStrong,
    text: semantic.color.textPrimary,
    textSecondary: semantic.color.textSecondary,
    mint: semantic.color.accentSecondary,
    accentGreen: semantic.color.accentPrimary,
    activeGreen: semantic.color.accentActive,
    error: semantic.color.feedbackDanger,
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
  },
  border: {
    primary: semantic.border.widthStrong,
    thin: semantic.border.widthThin,
  },
  shadow: {
    offset: semantic.shadow.offsetResting,
    offsetPressed: semantic.shadow.offsetPressed,
  },
  layout: {
    touchTarget: semantic.touch.targetMin,
    headerHeight: semantic.layout.headerHeight,
    contentPadding: semantic.layout.contentPadding,
    maxContentWidth: semantic.layout.maxContentWidth,
  },
} as const;
