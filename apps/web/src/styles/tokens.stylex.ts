import * as stylex from '@stylexjs/stylex';

/**
 * Web-only StyleX design tokens.
 *
 * Mirrors the platform-agnostic values in `packages/ui-tokens` but exposes
 * them as CSS custom properties so StyleX can consume them at build time.
 * Components reference these tokens — never raw values.
 *
 * The visual direction is refined green neo-brutalism:
 *   - deep forest-green header surface
 *   - warm off-white page surface
 *   - dark, high-contrast borders
 *   - hard offset shadows (no blur)
 *   - restrained emerald/mint/acid-green accents
 */

const MEDIA_DESKTOP = '@media (min-width: 768px)' as const;

export const tokens = stylex.defineVars({
  /* ── Surfaces ───────────────────────────────────────────── */
  surfacePage: '#FAF9F5', // warm off-white page background
  surfaceRaised: '#EFEEEA', // raised card / panel
  surfaceMuted: '#E9E8E4', // muted inset / secondary
  surfaceHeader: '#0F3D2E', // deep forest-green header
  surfaceHeaderHover: '#14503B', // header hover
  surfaceAccent: '#D4E7DD', // mint accent surface
  surfaceAction: '#79FF5B', // acid-green primary action
  surfaceActionHover: '#5FE03D',
  surfaceActionPressed: '#38FE13', // active green

  /* ── Text ──────────────────────────────────────────────── */
  textPrimary: '#1B1C1A', // near-black ink
  textSecondary: '#424845', // muted ink
  textOnHeader: '#FAF9F5', // off-white on forest-green
  textOnHeaderMuted: '#C9D6CF', // muted on forest-green
  textOnAccent: '#1B1C1A', // dark text on bright accents

  /* ── Borders ───────────────────────────────────────────── */
  borderStrong: '#000000',
  borderThin: '#1B1C1A',
  borderOnHeader: '#000000',

  /* ── Accents ───────────────────────────────────────────── */
  accentActive: '#38FE13',
  accentFocus: '#38FE13',

  /* ── Typography ────────────────────────────────────────── */
  fontFamilyHeading: 'var(--font-heading), system-ui, sans-serif',
  fontFamilyBody: 'var(--font-sans), system-ui, sans-serif',

  fontSizeXs: '0.75rem',
  fontSizeSm: '0.875rem',
  fontSizeMd: '1rem',
  fontSizeLg: '1.25rem',
  fontSizeXl: '1.5rem',
  fontSize2xl: '2rem',
  fontSize3xl: '2.5rem',

  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',
  fontWeightBlack: '800',

  lineHeightTight: '1.15',
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.7',

  /* ── Spacing ───────────────────────────────────────────── */
  spaceXs: '0.25rem',
  spaceSm: '0.5rem',
  spaceMd: '0.75rem',
  spaceLg: '1rem',
  spaceXl: '1.5rem',
  space2xl: '2rem',
  space3xl: '3rem',
  space4xl: '4rem',

  /* ── Borders ───────────────────────────────────────────── */
  borderWidthThin: '2px',
  borderWidthStrong: '3px',

  /* ── Radius ────────────────────────────────────────────── */
  radiusNone: '0px',
  radiusSm: '2px',
  radiusMd: '4px',

  /* ── Shadows (hard offset, no blur) ─────────────────────── */
  shadowResting: '4px 4px 0 0 #000000',
  shadowPressed: '2px 2px 0 0 #000000',
  shadowHeader: '0 4px 0 0 #000000',

  /* ── Layout ────────────────────────────────────────────── */
  headerHeight: '4rem',
  contentMaxWidth: '72rem',
  contentPaddingInline: {
    default: '1rem',
    [MEDIA_DESKTOP]: '2rem',
  },

  /* ── Z-index ───────────────────────────────────────────── */
  zIndexBase: '0',
  zIndexContent: '1',
  zIndexHeader: '10',
  zIndexOverlay: '100',

  /* ── Transitions ───────────────────────────────────────── */
  transitionFast: '120ms ease',
});
