import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type SectionHeaderProps = {
  /** Small contextual label above the title. */
  eyebrow: string;
  /** Section title (rendered as h2). */
  title: string;
  /** Optional supporting copy below the title. */
  supporting?: string;
};

/**
 * Reusable section header for homepage sections.
 *
 * Editorial rhythm: eyebrow label, strong heading, optional supporting
 * copy. Uses the same eyebrow mark motif as the hero for consistency.
 */
export function SectionHeader({ eyebrow, title, supporting }: SectionHeaderProps) {
  return (
    <div {...stylex.props(styles.header)}>
      <p {...stylex.props(styles.eyebrow)}>
        <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
        {eyebrow}
      </p>
      <h2 {...stylex.props(styles.title)}>{title}</h2>
      {supporting && (
        <p {...stylex.props(styles.supporting)}>{supporting}</p>
      )}
    </div>
  );
}

const styles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceSm,
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  eyebrowMark: {
    display: 'inline-block',
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  title: {
    margin: 0,
    maxWidth: '32ch',
    fontFamily: tokens.fontFamilyHeading,
    fontSize: {
      default: tokens.fontSizeXl,
      '@media (min-width: 768px)': tokens.fontSize2xl,
    },
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.02em',
    color: tokens.textPrimary,
  },
  supporting: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
});
