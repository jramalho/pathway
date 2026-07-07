import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type DifficultyBadgeProps = {
  /** Difficulty level from the domain model. */
  level: 'beginner' | 'intermediate' | 'advanced' | string;
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/**
 * Difficulty badge — mint accent surface, 2px black border, uppercase
 * label. Decorative-only (aria-hidden) — the card already exposes the
 * same information in text.
 */
export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const label = DIFFICULTY_LABELS[level] ?? level;
  return (
    <span
      aria-hidden="true"
      {...stylex.props(styles.badge)}
    >
      {label}
    </span>
  );
}

const styles = stylex.create({
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceSm,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    backgroundColor: tokens.surfaceAccent,
    color: tokens.textPrimary,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    whiteSpace: 'nowrap',
  },
});
