import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { SectionHeader } from './section-header';
import type { HomepageTopicSummary } from '@/lib/homepage-data';

type TopicsSectionProps = {
  topics: HomepageTopicSummary[];
};

/**
 * Topics section for the homepage.
 *
 * Renders real topic summaries derived from published featured paths.
 * Each topic links to /explore (the real discovery surface) since the
 * shared API does not expose a category listing endpoint. No decorative
 * cards that lead nowhere.
 */
export function TopicsSection({ topics }: TopicsSectionProps) {
  if (topics.length === 0) return null;

  return (
    <section {...stylex.props(styles.section)}>
      <SectionHeader
        eyebrow="Topics"
        title="Learn by topic"
        supporting="Browse learning content by the areas that matter to your work."
      />
      <div {...stylex.props(styles.grid)}>
        {topics.map((topic) => (
          <Link
            key={topic.label}
            href="/explore"
            aria-label={`Explore content related to ${topic.label}`}
            {...stylex.props(styles.card, styles.cardLink)}
          >
            <div {...stylex.props(styles.body)}>
              <p {...stylex.props(styles.label)}>{topic.label}</p>
              <p {...stylex.props(styles.count)}>
                {topic.count} {topic.count === 1 ? 'lesson' : 'lessons'}
              </p>
            </div>
            <span aria-hidden="true" {...stylex.props(styles.mark)}>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXl,
  },
  grid: {
    display: 'grid',
    gap: tokens.spaceLg,
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': 'repeat(2, 1fr)',
      '@media (min-width: 1024px)': 'repeat(4, 1fr)',
    },
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spaceMd,
    padding: tokens.spaceXl,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    textDecoration: 'none',
    color: 'inherit',
    transition: tokens.transitionFast,
  },
  cardLink: {
    cursor: 'pointer',
    ':hover': {
      transform: 'translate(-1px, -1px)',
      boxShadow: '6px 6px 0 0 #000000',
    },
    ':active': {
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
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    minWidth: 0,
  },
  label: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeMd,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.01em',
    color: tokens.textPrimary,
  },
  count: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.textSecondary,
  },
  mark: {
    display: 'inline-block',
    flexShrink: 0,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textSecondary,
  },
});
