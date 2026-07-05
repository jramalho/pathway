import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';

/**
 * Transition area for the lesson route shell.
 *
 * Makes clear that the complete editorial reading experience (body
 * renderer, table of contents, key takeaway, video treatment, sharing,
 * related lessons, previous/next navigation) is being built below. This
 * is a polished, intentional placeholder — not a fake article. It uses
 * the established Pathway visual system: warm neutral surface, dark
 * borders, restrained mint highlight, hard offset shadow.
 */
export function LessonTransition() {
  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.header)}>
          <span aria-hidden="true" {...stylex.props(styles.mark)}>▍</span>
          <p {...stylex.props(styles.eyebrow)}>Reading experience</p>
        </div>
        <h2 {...stylex.props(styles.title)}>
          The full lesson reader is on its way.
        </h2>
        <p {...stylex.props(styles.supporting)}>
          This lesson is published and ready. The complete editorial reading
          experience — formatted body content, table of contents, key
          takeaways, and lesson navigation — is being built in the next
          milestone slice.
        </p>
        <div {...stylex.props(styles.motif)} aria-hidden="true">
          <span {...stylex.props(styles.bar, styles.bar1)} />
          <span {...stylex.props(styles.bar, styles.bar2)} />
          <span {...stylex.props(styles.bar, styles.bar3)} />
          <span {...stylex.props(styles.bar, styles.bar4)} />
        </div>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    padding: tokens.space2xl,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  header: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceSm,
  },
  mark: {
    display: 'inline-block',
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  eyebrow: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
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
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  motif: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    maxWidth: '24rem',
    paddingTop: tokens.spaceMd,
  },
  bar: {
    display: 'block',
    height: tokens.spaceSm,
    backgroundColor: tokens.borderThin,
  },
  bar1: { width: '100%' },
  bar2: { width: '85%' },
  bar3: { width: '60%' },
  bar4: { width: '40%' },
});
