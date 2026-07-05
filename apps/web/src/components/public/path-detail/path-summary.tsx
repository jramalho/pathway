import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';
import type { PathDetailView } from '@/lib/path-data';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining === 0 ? `${hours} hr` : `${hours} hr ${remaining} min`;
}

type PathSummaryProps = {
  path: PathDetailView;
};

/**
 * Focused, reusable learning-path summary.
 *
 * Shows only real content data as a semantic description list:
 * difficulty, estimated duration, lesson count, module count (derived
 * from the actual modules array), and topic/category when available.
 * Unavailable metadata is omitted gracefully — no meaningless zero
 * values, no completion percentages, no learner counts.
 *
 * Used as a sticky desktop sidebar and as a stacked summary on mobile.
 */
export function PathSummary({ path }: PathSummaryProps) {
  const moduleCount = path.modules.length;

  return (
    <aside {...stylex.props(styles.aside)}>
      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.heading)}>Path details</p>

        <dl {...stylex.props(styles.list)}>
          <div {...stylex.props(styles.item)}>
            <dt {...stylex.props(styles.label)}>Difficulty</dt>
            <dd {...stylex.props(styles.value)}>
              {DIFFICULTY_LABELS[path.difficulty] ?? path.difficulty}
            </dd>
          </div>

          <div {...stylex.props(styles.item)}>
            <dt {...stylex.props(styles.label)}>Estimated duration</dt>
            <dd {...stylex.props(styles.value)}>
              {formatDuration(path.estimatedDuration)}
            </dd>
          </div>

          <div {...stylex.props(styles.item)}>
            <dt {...stylex.props(styles.label)}>Lessons</dt>
            <dd {...stylex.props(styles.value)}>
              {path.lessonCount}{' '}
              {path.lessonCount === 1 ? 'lesson' : 'lessons'}
            </dd>
          </div>

          {moduleCount > 0 && (
            <div {...stylex.props(styles.item)}>
              <dt {...stylex.props(styles.label)}>Modules</dt>
              <dd {...stylex.props(styles.value)}>
                {moduleCount}{' '}
                {moduleCount === 1 ? 'module' : 'modules'}
              </dd>
            </div>
          )}

          {path.category && (
            <div {...stylex.props(styles.item)}>
              <dt {...stylex.props(styles.label)}>Topic</dt>
              <dd {...stylex.props(styles.value)}>{path.category.name}</dd>
            </div>
          )}
        </dl>

        <div {...stylex.props(styles.actions)}>
          <Link
            href="/paths"
            {...stylex.props(styles.secondaryAction)}
          >
            Explore all paths
          </Link>
        </div>
      </div>
    </aside>
  );
}

const styles = stylex.create({
  aside: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    padding: tokens.spaceXl,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  heading: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
    paddingBottom: tokens.spaceSm,
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderThin,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceMd,
    margin: 0,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    margin: 0,
  },
  label: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  value: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textPrimary,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    paddingTop: tokens.spaceSm,
    borderTopWidth: tokens.borderWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderThin,
  },
  secondaryAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '2.5rem',
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    backgroundColor: tokens.surfaceAccent,
    color: tokens.textPrimary,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfacePage,
      transform: 'translate(-1px, -1px)',
    },
    ':active': {
      backgroundColor: tokens.surfaceMuted,
      transform: 'translate(2px, 2px)',
    },
    ':focus': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
});