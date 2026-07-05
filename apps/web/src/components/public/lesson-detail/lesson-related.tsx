import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';
import { ExploreBadge } from '../../explore/explore-badge';
import type { RelatedLessonItem } from '@/lib/lesson-navigation';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

type LessonRelatedProps = {
  lessons: RelatedLessonItem[];
};

/**
 * Related lessons section for the lesson route.
 *
 * Renders after the parent-path CTA. Uses only real published Strapi
 * content. The section title is "Related lessons" — never "Popular",
 * "Trending", or "Recommended" (no real ranking data exists). Cards
 * link to valid `/lessons/[slug]` routes. Renders nothing when the
 * list is empty — no forced empty section.
 */
export function LessonRelated({ lessons }: LessonRelatedProps) {
  if (!lessons || lessons.length === 0) return null;

  return (
    <section aria-label="Related lessons" {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.header)}>
        <p {...stylex.props(styles.eyebrow)}>
          <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
          Related lessons
        </p>
        <h2 {...stylex.props(styles.title)}>Keep learning</h2>
      </div>
      <div {...stylex.props(styles.grid)}>
        {lessons.map((lesson) => (
          <RelatedLessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}

function RelatedLessonCard({ lesson }: { lesson: RelatedLessonItem }) {
  const href = lesson.slug ? `/lessons/${lesson.slug}` : undefined;

  const bodyContent = (
    <div {...stylex.props(styles.cardBody)}>
      <p {...stylex.props(styles.context)}>{lesson.pathTitle}</p>
      <h3 {...stylex.props(styles.cardTitle)}>{lesson.title}</h3>
      <p {...stylex.props(styles.cardSummary)}>{lesson.summary}</p>
      <div {...stylex.props(styles.cardMeta)}>
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
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceXl,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceSm,
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spaceSm,
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: tokens.textSecondary,
  },
  eyebrowMark: {
    display: "inline-block",
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: {
      default: tokens.fontSizeXl,
      "@media (min-width: 768px)": tokens.fontSize2xl,
    },
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: "-0.02em",
    color: tokens.textPrimary,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: tokens.spaceLg,
    "@media (min-width: 640px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    textDecoration: "none",
    color: "inherit",
    transition: tokens.transitionFast,
  },
  cardLink: {
    cursor: "pointer",
    ":hover": {
      transform: "translate(-1px, -1px)",
      boxShadow: "6px 6px 0 0 #000000",
    },
    ":active": {
      transform: "translate(2px, 2px)",
      boxShadow: tokens.shadowPressed,
    },
    ":focus": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceSm,
    padding: tokens.spaceXl,
  },
  context: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: tokens.textSecondary,
  },
  cardTitle: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: "-0.02em",
    color: tokens.textPrimary,
  },
  cardSummary: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  cardMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spaceSm,
    marginTop: tokens.spaceXs,
  },
});
