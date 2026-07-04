import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';
import { PublicPageContainer } from '@/components/public/public-page-container';

/**
 * Home placeholder.
 *
 * Establishes page rhythm and top spacing only. The real homepage —
 * hero, featured paths, popular lessons, topic sections — arrives in
 * a later Milestone 3 task.
 */
export default function HomePage() {
  return (
    <PublicPageContainer>
      <div {...stylex.props(styles.rhythm)}>
        <h1 {...stylex.props(styles.wordmark)}>Pathway</h1>
        <p {...stylex.props(styles.tagline)}>
          Short, structured learning paths for mobile engineers, product
          builders, and modern technical teams.
        </p>
      </div>
    </PublicPageContainer>
  );
}

const styles = stylex.create({
  rhythm: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    paddingTop: tokens.space2xl,
  },
  wordmark: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSize3xl,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    color: tokens.textPrimary,
    letterSpacing: '-0.03em',
  },
  tagline: {
    margin: 0,
    maxWidth: '36rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXl,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
});
