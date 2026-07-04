import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type PlaceholderSectionProps = {
  heading: string;
  description: string;
  children?: ReactNode;
};

/**
 * Minimal, intentional placeholder section for routes whose real content
 * arrives in later Milestone 3 tasks. Establishes page rhythm without
 * fake cards, lessons, or search results.
 */
export function PlaceholderSection({
  heading,
  description,
  children,
}: PlaceholderSectionProps) {
  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.card)}>
        <h1 {...stylex.props(styles.heading)}>{heading}</h1>
        <p {...stylex.props(styles.description)}>{description}</p>
        {children}
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    padding: tokens.space2xl,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceRaised,
    boxShadow: tokens.shadowResting,
  },
  heading: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSize3xl,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    color: tokens.textPrimary,
    letterSpacing: '-0.02em',
  },
  description: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeLg,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
});
