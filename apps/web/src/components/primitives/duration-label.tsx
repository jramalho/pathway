import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type DurationLabelProps = {
  /** Duration in minutes. */
  minutes: number;
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}m`;
}

/**
 * Duration label — small secondary-text label that formats a minute
 * count into a readable duration string. No border or background;
 * purely typographic. Decorative (aria-hidden) — the card already
 * exposes the same information in text.
 */
export function DurationLabel({ minutes }: DurationLabelProps) {
  return (
    <span
      aria-hidden="true"
      {...stylex.props(styles.label)}
    >
      {formatDuration(minutes)}
    </span>
  );
}

const styles = stylex.create({
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceSm,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    backgroundColor: tokens.surfaceMuted,
    color: tokens.textSecondary,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    whiteSpace: 'nowrap',
  },
});
