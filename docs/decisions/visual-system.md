# Visual System — Refined Green Neo-Brutalism

## Why shared tokens, not shared components

React Native (Expo) and React DOM (Next.js) have fundamentally different
styling primitives. React Native uses `StyleSheet.create` with
platform-specific layout (Flexbox-only, no CSS custom properties). Web
uses CSS via StyleX, which compiles to atomic CSS classes and CSS
custom properties.

Forcing a single shared component library across both platforms would
require an abstraction layer that hides platform differences — adding
complexity without real reuse value. A button on mobile needs
`Pressable`, `accessibilityRole`, and `hitSlop`; a button on web needs
`<button>`, `:focus-visible`, and keyboard navigation. The JSX is
different, the accessibility APIs are different, and the styling
engines are different.

**Decision:** Share tokens (colors, spacing, typography, borders,
shadows, radii, icon sizes, touch targets) via `@pathway/ui-tokens`.
Each platform consumes the tokens and builds its own components using
its native styling mechanism. This gives visual consistency without
artificial component sharing.

## How StyleX is used

**Web (Next.js):** StyleX is the styling engine. Tokens are defined as
CSS custom properties via `stylex.defineVars` in
`apps/web/src/styles/tokens.stylex.ts`. Components use `stylex.create`
for styles and `stylex.props` to apply them. The Babel plugin compiles
styles at build time; the PostCSS plugin handles the CSS output.

**Mobile (Expo):** StyleX is not used. React Native does not support
CSS custom properties or StyleX's compilation model. Instead, mobile
consumes the same token values from `@pathway/ui-tokens` directly as
plain JavaScript constants via `apps/mobile/src/constants/theme.ts`.
`StyleSheet.create` uses these constants. This is the adaptation
already present in the project — no new library is introduced.

**Alignment:** The web `tokens.stylex.ts` mirrors the values from
`packages/ui-tokens/src/foundation.ts`. When a value changes in the
shared package, the web tokens file is updated to match. The two are
aligned in value but not structurally unified — web needs rem units
and CSS custom property references; mobile needs numeric px values.

## Principles of refined green neo-brutalism

1. **Forest-green header surface** — deep, mature green (`#0F3D2E`)
   for headers and prominent surfaces. Not a SaaS gradient.
2. **Warm off-white page surface** — `#FAF9F5`, an editorial paper
   tone. Not pure white, not gray.
3. **Dark, high-contrast borders** — `#000000`, 3px strong / 2px thin.
   Borders are structural, not decorative.
4. **Hard offset shadows** — `4px 4px 0 0 #000000` (web) / 6px offset
   (mobile). No blur, no soft floating shadows. Shadows are physical:
   they shrink on press, simulating a button being pushed down.
5. **Restrained accents** — mint `#D4E7DD`, acid-green `#79FF5B`,
   active-green `#38FE13`. Used only for primary actions, active
   states, and selected indicators. Never as background fill for
   large areas.
6. **Editorial typography** — Epilogue for headings (800/700), Inter
   for body (400–700). Clear hierarchy: one h1, logical order, no
   skipped levels.
7. **Moderate corner radius** — 0px default, 2px–4px for subtle
   softening. No pills, no excessive rounding.
8. **No glassmorphism, no gradients, no decorative blur** — surfaces
   are opaque. Depth comes from borders and offset shadows, not from
   translucency.
9. **Mature product appearance** — no cartoon illustrations, no
   generic SaaS aesthetics, no crypto/AI visual tropes. Geometric
   icons only, built with SVG or SF Symbols.

## Accessibility decisions

- **Visible focus on web** — all interactive elements have
  `:focus-visible` outlines using `tokens.accentFocus` (acid-green).
  The outline offset is 2px so it doesn't overlap the border.
- **Touch targets on mobile** — 44px minimum (`tokens.touch.targetMin`).
  The `NeoButton`, `BookmarkControl`, and tab bar all meet this.
  `hitSlop` extends the touch area when the visual box is smaller.
- **Non-color selected indicator** — `FilterChip` uses a `✓` checkmark
  in addition to the color change. `BookmarkControl` uses a filled vs
  unfilled icon. State is never communicated by color alone.
- **Accessible labels** — all interactive elements have explicit
  `accessibilityLabel` (mobile) or `aria-label` (web). Decorative
  icons are `aria-hidden` or `accessibilityElementsHidden`.
- **ARIA roles** — `progressbar` has `accessibilityRole="progressbar"`
  with `accessibilityValue` (mobile) or `role="progressbar"` with
  `aria-valuenow` (web). Filter chips have `aria-pressed`.
- **Reduced motion** — transitions are minimal (120ms). The press
  animation is a transform, not a fade. `prefers-reduced-motion` is
  respected in the web transition tokens.
- **Skip link** — web has a skip-to-content link in `PublicShell`.
- **Contrast** — text on off-white (`#1B1C1A` on `#FAF9F5`) and text
  on forest-green (`#FAF9F5` on `#0F3D2E`) both meet WCAG AA.
