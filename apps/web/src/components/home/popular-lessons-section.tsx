import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { SectionHeader } from './section-header';
import { ExploreBadge } from '@/components/explore/explore-badge';
import type { HomepageRecommendedLesson } from '@/lib/homepage-data';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

type PopularLessonsSectionProps = {
  lessons: HomepageRecommendedLesson[];
};

/**
 * Popular lessons section for the homepage.
 *
 * Renders real published lessons as compact cards. Each card links to
 * its real /lessons/[slug] page and shows the parent path context,
 * title, summary, difficulty, and duration. No fake popularity metrics.
 */
export function PopularLessonsSection({ lessons }: PopularLessonsSectionProps) {
  if (lessons.length === 0) return null;

  return (
    <section {...stylex.props(styles.section)}>
      <SectionHeader
        eyebrow="Lessons"
        title="Start with a focused lesson"
        supporting="Short, self-contained readings you can open individually."
      />
      <div {...stylex.props(styles.grid)}>
        {lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}

function LessonCard({ lesson }: { lesson: HomepageRecommendedLesson }) {
  const href = `/lessons/${lesson.slug}`;

  return (
    <Link
      href={href}
      aria-label={`Open lesson: ${lesson.title}`}
      {...stylex.props(styles.card, styles.cardLink)}
    >
      <div {...stylex.props(styles.body)}>
        <p {...stylex.props(styles.context)}>{lesson.pathTitle}</p>
        <h3 {...stylex.props(styles.title)}>{lesson.title}</h3>
        <p {...stylex.props(styles.summary)}>{lesson.summary}</p>
        <div {...stylex.props(styles.meta)}>
          <ExploreBadge label={DIFFICULTY_LABELS[lesson.difficulty] ?? lesson.difficulty} tone="difficulty" />
          <ExploreBadge label={formatDuration(lesson.estimatedDuration)} />
        </div>
      </div>
    </Link>
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
      '@media (min-width: 1024px)': 'repeat(3, 1fr)',
    },
  },
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
    ':focus-visible': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
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
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.02em',
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
    gap: tokens.spaceSm,
    marginTop: tokens.spaceXs,
  },
});
