import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';
import type { PathDetailLesson } from '@/lib/path-data';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

type LessonRowProps = {
  lesson: PathDetailLesson;
  /** Position of this lesson within its module (1-based). */
  index: number;
};

/**
 * A single lesson row inside a module.
 *
 * This is a semantic information row — not a link. The `/lessons/[slug]`
 * route does not exist yet, so lesson rows intentionally do not navigate.
 * No disabled links, no "coming soon" labels, no fabricated completion
 * or video states. The row presents real lesson metadata: title,
 * summary (when it helps scanning), estimated duration, and difficulty.
 */
export function LessonRow({ lesson, index }: LessonRowProps) {
  return (
    <li {...stylex.props(styles.row)}>
      <span aria-hidden="true" {...stylex.props(styles.number)}>
        {String(index).padStart(2, '0')}
      </span>
      <div {...stylex.props(styles.body)}>
        <h4 {...stylex.props(styles.title)}>{lesson.title}</h4>
        {lesson.summary && (
          <p {...stylex.props(styles.summary)}>{lesson.summary}</p>
        )}
        <div {...stylex.props(styles.meta)}>
          <span {...stylex.props(styles.metaItem)}>
            {formatDuration(lesson.estimatedDuration)}
          </span>
          <span aria-hidden="true" {...stylex.props(styles.metaDot)}>·</span>
          <span {...stylex.props(styles.metaItem)}>
            {DIFFICULTY_LABELS[lesson.difficulty] ?? lesson.difficulty}
          </span>
        </div>
      </div>
    </li>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    gap: tokens.spaceMd,
    paddingBlock: tokens.spaceMd,
    paddingInline: tokens.spaceLg,
    backgroundColor: tokens.surfacePage,
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderThin,
    ':last-child': {
      borderBottomWidth: 0,
    },
  },
  number: {
    display: 'inline-block',
    flexShrink: 0,
    width: '1.75rem',
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textSecondary,
    lineHeight: tokens.lineHeightTight,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeMd,
    fontWeight: tokens.fontWeightBold,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.01em',
    color: tokens.textPrimary,
  },
  summary: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spaceSm,
    marginTop: tokens.spaceXs,
  },
  metaItem: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.textSecondary,
  },
  metaDot: {
    color: tokens.textSecondary,
    fontSize: tokens.fontSizeXs,
  },
});