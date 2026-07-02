/**
 * Semantic tokens — named by purpose, not by value.
 *
 * Components reference these. If the visual direction changes, only
 * this file needs updating — components stay the same.
 */
import { foundation as f } from "./foundation.ts";

export const semantic = {
  color: {
    surfaceCanvas: f.color.canvas,
    surfaceRaised: f.color.raised,
    surfaceMuted: f.color.raisedHigh,
    textPrimary: f.color.ink,
    textSecondary: f.color.inkMuted,
    borderStrong: f.color.black,
    borderThin: f.color.black,
    accentPrimary: f.color.accentGreen,
    accentSecondary: f.color.mint,
    accentActive: f.color.activeGreen,
    feedbackDanger: f.color.danger,
    onAccent: f.color.black,
  },
  spacing: {
    none: f.spacing.s0,
    hairline: f.spacing.s50,
    xs: f.spacing.s100,
    sm: f.spacing.s200,
    md: f.spacing.s300,
    lg: f.spacing.s400,
    xl: f.spacing.s500,
    xxl: f.spacing.s600,
  },
  typography: {
    headingFamily: f.typography.headingFamily,
    bodyFamily: f.typography.bodyFamily,
    headingWeightBold: f.typography.headingWeightBold,
    headingWeightBlack: f.typography.headingWeightBlack,
    bodyWeightRegular: f.typography.bodyWeightRegular,
    bodyWeightMedium: f.typography.bodyWeightMedium,
    bodyWeightSemibold: f.typography.bodyWeightSemibold,
    bodyWeightBold: f.typography.bodyWeightBold,
  },
  border: {
    widthStrong: f.border.widthStrong,
    widthThin: f.border.widthThin,
  },
  radius: {
    none: f.radius.none,
  },
  shadow: {
    offsetResting: f.shadow.offsetResting,
    offsetPressed: f.shadow.offsetPressed,
  },
  icon: {
    sizeSm: f.icon.sizeSm,
    sizeMd: f.icon.sizeMd,
    sizeLg: f.icon.sizeLg,
  },
  touch: {
    targetMin: f.touch.targetMin,
  },
  layout: {
    headerHeight: f.layout.headerHeight,
    contentPadding: f.layout.contentPadding,
    maxContentWidth: f.layout.maxContentWidth,
  },
  zIndex: {
    base: f.zIndex.base,
    content: f.zIndex.content,
    header: f.zIndex.header,
    tabbar: f.zIndex.tabbar,
    overlay: f.zIndex.overlay,
  },
} as const;
