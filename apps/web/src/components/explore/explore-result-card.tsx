import * as stylex from '@stylexjs/stylex';
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
 * Route safety: dynamic `/paths/[slug]` routes are intentionally not
 * implemented yet (Milestone 3.3.3). This card therefore renders as a
 * non-interactive panel — no `href` — so no result leads to a missing
 * route. The component API accepts an optional `href` so later work can
 * pass a real link without changing the card shape.
 */
export function ExplorePathCard({
  path,
}: {
  path: ExplorePathItem;
  /** Reserved for future dynamic route linking. Not rendered yet. */
  href?: string;
}) {
  return (
    <article {...stylex.props(styles.card)}>
      {path.coverImageUrl && (
        <div {...stylex.props(styles.media)} aria-hidden="true">
          {/* ponytail: next/image deferred until dynamic routes + remote image optimization land in M3.3.3 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={path.coverImageUrl}
            alt={path.coverImageAlt ?? ""}
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
    </article>
  );
}

/**
 * Presentational card for a lesson result.
 *
 * Route safety: dynamic `/lessons/[slug]` routes are intentionally not
 * implemented yet (Milestone 3.3.3). This card renders as a
 * non-interactive panel — no `href` — so no result leads to a missing
 * route. The component API accepts an optional `href` so later work can
 * pass a real link without changing the card shape.
 */
export function ExploreLessonCard({
  lesson,
}: {
  lesson: ExploreLessonItem;
  /** Reserved for future dynamic route linking. Not rendered yet. */
  href?: string;
}) {
  return (
    <article {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.body)}>
        <p {...stylex.props(styles.context)}>{lesson.pathTitle}</p>
        <h3 {...stylex.props(styles.title)}>{lesson.title}</h3>
        <p {...stylex.props(styles.description)}>{lesson.summary}</p>
        <div {...stylex.props(styles.meta)}>
          <ExploreBadge label={DIFFICULTY_LABELS[lesson.difficulty] ?? lesson.difficulty} tone="difficulty" />
          <ExploreBadge label={formatDuration(lesson.estimatedDuration)} />
        </div>
      </div>
    </article>
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