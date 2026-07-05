import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { ExploreBadge } from './explore-badge';
import type { ExplorePathItem, ExploreLessonItem } from '@/lib/explore-data';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

/**
 * Presentational card for a learning-path result.
 *
 * When `href` is provided (a valid `/paths/[slug]` URL), the card
 * renders as a Next.js Link so the result navigates to the real
 * public path page. When `href` is absent (e.g. the path lacks a
 * slug), the card renders as a non-interactive panel — no result
 * leads to a missing route.
 */
export function ExplorePathCard({
  path,
  href,
}: {
  path: ExplorePathItem;
  href?: string;
}) {
  const bodyContent = (
    <>
      {path.coverImageUrl && (
        <div {...stylex.props(styles.media)} aria-hidden="true">
          {/* ponytail: next/image deferred until remote image optimization lands in a later M3 slice. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={path.coverImageUrl}
            alt={path.coverImageAlt ?? ''}
            {...stylex.props(styles.image)}
          />
        </div>
      )}
      <div {...stylex.props(styles.body)}>
        <h3 {...stylex.props(styles.title)}>{path.title}</h3>
        <p {...stylex.props(styles.description)}>{path.description}</p>
        <div {...stylex.props(styles.meta)}>
          <ExploreBadge label={DIFFICULTY_LABELS[path.difficulty] ?? path.difficulty} tone="difficulty" />
          <ExploreBadge label={`${path.lessonCount} lessons`} />
          <ExploreBadge label={formatDuration(path.estimatedDuration)} />
        </div>
      </div>
    </>
  );

  if (!href) {
    return <article {...stylex.props(styles.card)}>{bodyContent}</article>;
  }

  return (
    <Link
      href={href}
      aria-label={`Open learning path: ${path.title}`}
      {...stylex.props(styles.card, styles.cardLink)}
    >
      {bodyContent}
    </Link>
  );
}

/**
 * Presentational card for a lesson result.
 *
 * When `href` is provided (a valid `/lessons/[slug]` URL), the card
 * renders as a Next.js Link so the result navigates to the real
 * public lesson page. When `href` is absent (e.g. the lesson lacks a
 * slug), the card renders as a non-interactive panel — no result
 * leads to a missing route.
 */
export function ExploreLessonCard({
  lesson,
  href,
}: {
  lesson: ExploreLessonItem;
  href?: string;
}) {
  const bodyContent = (
    <div {...stylex.props(styles.body)}>
      <p {...stylex.props(styles.context)}>{lesson.pathTitle}</p>
      <h3 {...stylex.props(styles.title)}>{lesson.title}</h3>
      <p {...stylex.props(styles.description)}>{lesson.summary}</p>
      <div {...stylex.props(styles.meta)}>
        <ExploreBadge label={DIFFICULTY_LABELS[lesson.difficulty] ?? lesson.difficulty} tone="difficulty" />
        <ExploreBadge label={formatDuration(lesson.estimatedDuration)} />
      </div>
    </div>
  );

  if (!href) {
    return <article {...stylex.props(styles.card)}>{bodyContent}</article>;
  }

  return (
    <Link
      href={href}
      aria-label={`Open lesson: ${lesson.title}`}
      {...stylex.props(styles.card, styles.cardLink)}
    >
      {bodyContent}
    </Link>
  );
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
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
  media: {
    display: 'block',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderBottomWidth: tokens.borderWidthStrong,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceMuted,
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    padding: tokens.spaceXl,
  },
  context: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeXl,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.02em',
    color: tokens.textPrimary,
  },
  description: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spaceSm,
    marginTop: tokens.spaceXs,
  },
});