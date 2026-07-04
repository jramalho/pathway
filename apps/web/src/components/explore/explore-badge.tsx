import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type ExploreBadgeProps = {
  /** Label text shown in the badge. */
  label: string;
  /** Visual tone. `difficulty` uses the mint accent; `meta` is muted. */
  tone?: 'difficulty' | 'meta';
};

/**
 * Small neo-brutalist badge for difficulty and meta labels on Explore
 * result cards. Decorative-only — the card already exposes the same
 * information in text, so the badge itself is not relied upon for
 * meaning by screen readers (aria-hidden).
 */
export function ExploreBadge({ label, tone = 'meta' }: ExploreBadgeProps) {
  return (
    <span
      aria-hidden="true"
      {...stylex.props(styles.base, styles[tone])}
    >
      {label}
    </span>
  );
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceSm,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    whiteSpace: 'nowrap',
  },
  difficulty: {
    backgroundColor: tokens.surfaceAccent,
    color: tokens.textPrimary,
  },
  meta: {
    backgroundColor: tokens.surfaceMuted,
    color: tokens.textSecondary,
  },
});