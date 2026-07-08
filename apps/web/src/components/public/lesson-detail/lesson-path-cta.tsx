import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';

type LessonPathCtaProps = {
  learningPath: {
    title: string;
    slug: string;
    description: string | null;
  } | null;
};

/**
 * Contextual CTA back to the parent learning path.
 *
 * Renders after the article body. Uses the actual parent learning-path
 * title and links to `/paths/[slug]`. Explains honestly that the parent
 * path contains the surrounding curriculum — no implication of saved
 * progress, resume position, enrollment, or account state.
 *
 * Omitted entirely when the lesson has no valid learning-path
 * relationship.
 */
export function LessonPathCta({ learningPath }: LessonPathCtaProps) {
  if (!learningPath || !learningPath.slug) return null;

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.eyebrow)}>
          <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
          Continue the learning path
        </p>
        <h2 {...stylex.props(styles.title)}>
          {learningPath.title}
        </h2>
        {learningPath.description && (
          <p {...stylex.props(styles.description)}>
            {learningPath.description}
          </p>
        )}
        <p {...stylex.props(styles.context)}>
          This lesson is part of a structured curriculum. Open the learning
          path to see the surrounding modules and lessons.
        </p>
        <Link
          href={`/paths/${learningPath.slug}`}
          aria-label={`Open learning path: ${learningPath.title}`}
          {...stylex.props(styles.cta)}
        >
          <span>View full curriculum</span>
          <span aria-hidden="true" {...stylex.props(styles.ctaMark)}>→</span>
        </Link>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceMd,
    padding: tokens.space2xl,
    backgroundColor: tokens.surfaceHeader,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
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
    color: tokens.textOnHeaderMuted,
  },
  eyebrowMark: {
    display: "inline-block",
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  title: {
    margin: 0,
    maxWidth: "32ch",
    fontFamily: tokens.fontFamilyHeading,
    fontSize: {
      default: tokens.fontSizeXl,
      "@media (min-width: 768px)": tokens.fontSize2xl,
    },
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: "-0.02em",
    color: tokens.textOnHeader,
  },
  description: {
    margin: 0,
    maxWidth: "42rem",
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textOnHeaderMuted,
  },
  context: {
    margin: 0,
    maxWidth: "42rem",
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textOnHeaderMuted,
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spaceSm,
    alignSelf: "flex-start",
    minHeight: "2.75rem",
    paddingBlock: tokens.spaceMd,
    paddingInline: tokens.spaceXl,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    textDecoration: "none",
    backgroundColor: tokens.surfaceAction,
    color: tokens.textOnAccent,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    transition: tokens.transitionFast,
    ":hover": {
      backgroundColor: tokens.surfaceActionHover,
      transform: "translate(-1px, -1px)",
    },
    ":active": {
      backgroundColor: tokens.surfaceActionPressed,
      transform: "translate(2px, 2px)",
      boxShadow: tokens.shadowPressed,
    },
    ":focus-visible": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  ctaMark: {
    display: "inline-block",
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
});
