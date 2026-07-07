import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { SectionHeader } from './section-header';

/**
 * Practical learning section for the homepage.
 *
 * Explains the product positioning honestly: structured technical
 * content, short progressive paths, and a centralized editorial
 * source. No corporate marketing, no false career promises.
 */
export function PracticalLearningSection() {
  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.card)}>
        <SectionHeader
          eyebrow="How Pathway works"
          title="Practical, structured learning"
          supporting="Pathway is a CMS-driven learning platform. Content is authored in a single editorial source and published to web and mobile — no scattered docs, no stale wikis."
        />

        <ol {...stylex.props(styles.list)}>
          <li {...stylex.props(styles.item)}>
            <span aria-hidden="true" {...stylex.props(styles.itemNumber)}>01</span>
            <div {...stylex.props(styles.itemBody)}>
              <h3 {...stylex.props(styles.itemTitle)}>Short, progressive paths</h3>
              <p {...stylex.props(styles.itemText)}>
                Each learning path groups focused lessons into modules you can
                finish in a sitting.
              </p>
            </div>
          </li>
          <li {...stylex.props(styles.item)}>
            <span aria-hidden="true" {...stylex.props(styles.itemNumber)}>02</span>
            <div {...stylex.props(styles.itemBody)}>
              <h3 {...stylex.props(styles.itemTitle)}>Real editorial content</h3>
              <p {...stylex.props(styles.itemText)}>
                Lessons are written and published from a single source — the
                same content reaches the web and the mobile app.
              </p>
            </div>
          </li>
          <li {...stylex.props(styles.item)}>
            <span aria-hidden="true" {...stylex.props(styles.itemNumber)}>03</span>
            <div {...stylex.props(styles.itemBody)}>
              <h3 {...stylex.props(styles.itemTitle)}>Open and shareable</h3>
              <p {...stylex.props(styles.itemText)}>
                Every path and lesson has a stable public URL you can share in a
                resume, a message, or a pull request.
              </p>
            </div>
          </li>
        </ol>

        <div {...stylex.props(styles.actions)}>
          <Link href="/explore" {...stylex.props(styles.ctaPrimary)}>
            Explore content
            <span aria-hidden="true" {...stylex.props(styles.ctaMark)}>→</span>
          </Link>
          <Link href="/paths" {...stylex.props(styles.ctaSecondary)}>
            Browse learning paths
          </Link>
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
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXl,
    padding: {
      default: tokens.spaceXl,
      '@media (min-width: 768px)': tokens.space2xl,
    },
    backgroundColor: tokens.surfaceHeader,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    gap: tokens.spaceLg,
    alignItems: 'flex-start',
  },
  itemNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    flexShrink: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textOnAccent,
    backgroundColor: tokens.surfaceAction,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
  },
  itemBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
  },
  itemTitle: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.01em',
    color: tokens.textOnHeader,
  },
  itemText: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textOnHeaderMuted,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceMd,
    '@media (min-width: 480px)': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spaceSm,
    minHeight: '2.75rem',
    paddingBlock: tokens.spaceMd,
    paddingInline: tokens.spaceXl,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    backgroundColor: tokens.surfaceAction,
    color: tokens.textOnAccent,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfaceActionHover,
      transform: 'translate(-1px, -1px)',
    },
    ':active': {
      backgroundColor: tokens.surfaceActionPressed,
      transform: 'translate(2px, 2px)',
      boxShadow: tokens.shadowPressed,
    },
    ':focus': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  ctaMark: {
    display: 'inline-block',
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '2.75rem',
    paddingBlock: tokens.spaceMd,
    paddingInline: tokens.spaceXl,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    color: tokens.textOnHeader,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.textOnHeaderMuted,
    transition: tokens.transitionFast,
    ':hover': {
      borderColor: tokens.accentActive,
      color: tokens.textOnHeader,
    },
    ':focus': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
});
