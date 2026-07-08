import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';
import type { LessonNavResult } from '@/lib/lesson-navigation';

type LessonNavProps = {
  nav: LessonNavResult;
};

/**
 * Contextual previous/next lesson navigation within the parent
 * learning path.
 *
 * Server-rendered. Derives ordering from the real Strapi module `order`
 * field and lesson position within each module — not alphabetical or
 * date-based. Shows the parent learning-path context and concise,
 * truthful labels ("Previous lesson", "Next lesson") with the actual
 * lesson title as supporting context.
 *
 * No fake locked/current/completed states. Missing previous or next
 * actions are gracefully omitted (the slot renders nothing). The
 * entire section renders nothing when the navigation result has no
 * previous and no next.
 */
export function LessonNav({ nav }: LessonNavProps) {
  const { previous, next, pathTitle, pathSlug } = nav;

  if (!previous && !next) return null;

  return (
    <nav aria-label="Lesson navigation" {...stylex.props(styles.section)}>
      <p {...stylex.props(styles.context)}>
        <span aria-hidden="true" {...stylex.props(styles.contextMark)}>▍</span>
        Part of <Link href={`/paths/${pathSlug}`} {...stylex.props(styles.contextLink)}>{pathTitle}</Link>
      </p>
      <div {...stylex.props(styles.layout)}>
        {previous ? (
          <Link
            href={`/lessons/${previous.slug}`}
            aria-label={`Previous lesson: ${previous.title}`}
            {...stylex.props(styles.slot, styles.slotPrev)}
          >
            <span {...stylex.props(styles.slotLabel)}>Previous lesson</span>
            <span {...stylex.props(styles.slotTitle)}>{previous.title}</span>
            <span aria-hidden="true" {...stylex.props(styles.slotMark)}>←</span>
          </Link>
        ) : (
          <div {...stylex.props(styles.slot, styles.slotEmpty)} aria-hidden="true" />
        )}
        {next ? (
          <Link
            href={`/lessons/${next.slug}`}
            aria-label={`Next lesson: ${next.title}`}
            {...stylex.props(styles.slot, styles.slotNext)}
          >
            <span {...stylex.props(styles.slotLabel)}>Next lesson</span>
            <span {...stylex.props(styles.slotTitle)}>{next.title}</span>
            <span aria-hidden="true" {...stylex.props(styles.slotMark)}>→</span>
          </Link>
        ) : (
          <div {...stylex.props(styles.slot, styles.slotEmpty)} aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceMd,
  },
  context: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spaceXs,
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.textSecondary,
  },
  contextMark: {
    display: "inline-block",
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  contextLink: {
    color: tokens.textPrimary,
    textDecoration: "none",
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.accentActive,
    ":hover": {
      color: tokens.textPrimary,
    },
    ":focus-visible": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceMd,
    "@media (min-width: 640px)": {
      flexDirection: "row",
    },
  },
  slot: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceXs,
    flex: 1,
    minWidth: 0,
    padding: tokens.spaceLg,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    textDecoration: "none",
    color: "inherit",
    transition: tokens.transitionFast,
    position: "relative",
  },
  slotPrev: {
    alignItems: "flex-start",
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.surfaceAccent,
      transform: "translate(-1px, -1px)",
      boxShadow: "6px 6px 0 0 #000000",
    },
    ":active": {
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
  slotNext: {
    alignItems: "flex-end",
    textAlign: "right",
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.surfaceAccent,
      transform: "translate(-1px, -1px)",
      boxShadow: "6px 6px 0 0 #000000",
    },
    ":active": {
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
  slotEmpty: {
    visibility: "hidden",
  },
  slotLabel: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: tokens.textSecondary,
  },
  slotTitle: {
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeMd,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: "-0.01em",
    color: tokens.textPrimary,
  },
  slotMark: {
    position: "absolute",
    top: tokens.spaceSm,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textSecondary,
  },
});
