import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';
import type { TocEntry } from '@/lib/lesson-body-parser';

type LessonTocProps = {
  entries: TocEntry[];
};

/** Minimum number of headings needed to justify a table of contents. */
const MIN_TOC_ENTRIES = 2;

/**
 * Determine whether the table of contents should render.
 *
 * The TOC is omitted when there are too few meaningful headings — a
 * single heading does not justify a navigation section.
 */
export function shouldShowToc(entries: TocEntry[]): boolean {
  return entries.length >= MIN_TOC_ENTRIES;
}

/** Map a heading level to its indentation style (typed lookup). */
function indentForLevel(level: number) {
  if (level === 3) return styles.level3;
  if (level === 4) return styles.level4;
  return styles.level2;
}

/**
 * Desktop sticky table of contents for the lesson article.
 *
 * Renders alongside the article body on wide viewports. Includes only
 * real headings from the parsed lesson body, with stable, deterministic
 * anchor IDs. Each entry links to the correct article section. No
 * scroll-spy or JavaScript active-state tracking — that is deferred.
 *
 * On mobile/tablet, use `LessonTocInline` instead (in-flow "On this
 * page" section).
 */
export function LessonTocAside({ entries }: LessonTocProps) {
  if (!shouldShowToc(entries)) return null;

  return (
    <aside aria-label="Table of contents" {...stylex.props(styles.aside)}>
      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.heading)}>On this page</p>
        <nav>
          <ol {...stylex.props(styles.list)}>
            {entries.map((entry, index) => (
              <li
                key={`${entry.anchorId}-${index}`}
                {...stylex.props(styles.item, indentForLevel(entry.level))}
              >
                <Link
                  href={`#${entry.anchorId}`}
                  {...stylex.props(styles.link)}
                >
                  {entry.text}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </aside>
  );
}

/**
 * Mobile/tablet in-flow table of contents.
 *
 * Renders a compact "On this page" section near the start of the article
 * on narrow viewports. Non-dominant, readable, and keyboard accessible.
 */
export function LessonTocInline({ entries }: LessonTocProps) {
  if (!shouldShowToc(entries)) return null;

  return (
    <nav aria-label="On this page" {...stylex.props(styles.inlineNav)}>
      <p {...stylex.props(styles.inlineHeading)}>On this page</p>
      <ol {...stylex.props(styles.inlineList)}>
        {entries.map((entry, index) => (
          <li
            key={`${entry.anchorId}-${index}`}
            {...stylex.props(styles.inlineItem)}
          >
            <Link
              href={`#${entry.anchorId}`}
              {...stylex.props(styles.inlineLink)}
            >
              {entry.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const styles = stylex.create({
  aside: {
    display: "none",
    "@media (min-width: 1024px)": {
      display: "flex",
      flexDirection: "column",
      flex: "0 0 16rem",
      position: "sticky",
      top: "5rem",
      // ponytail: sticky stops when the article scrolls past.
      // Ceiling: if the article is shorter than the TOC, the sticky
      // element rests at top without overlap. No JS scroll tracking.
      maxHeight: "calc(100vh - 6rem)",
      overflowY: "auto",
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceMd,
    padding: tokens.spaceLg,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  heading: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: tokens.textSecondary,
    paddingBottom: tokens.spaceSm,
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.borderThin,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceXs,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  item: {
    display: "flex",
    margin: 0,
  },
  level2: {
    paddingLeft: 0,
  },
  level3: {
    paddingLeft: tokens.spaceMd,
  },
  level4: {
    paddingLeft: tokens.spaceLg,
  },
  link: {
    display: "block",
    width: "100%",
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceSm,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightNormal,
    color: tokens.textSecondary,
    textDecoration: "none",
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    transition: tokens.transitionFast,
    ":hover": {
      color: tokens.textPrimary,
      backgroundColor: tokens.surfaceAccent,
    },
    ":focus-visible": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  // ── Mobile/tablet in-flow TOC ──────────────────────────────
  inlineNav: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceSm,
    padding: tokens.spaceLg,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    "@media (min-width: 1024px)": {
      display: "none",
    },
  },
  inlineHeading: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: tokens.textSecondary,
  },
  inlineList: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spaceSm,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  inlineItem: {
    display: "flex",
    margin: 0,
  },
  inlineLink: {
    display: "inline-block",
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceSm,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    color: tokens.textSecondary,
    textDecoration: "none",
    borderWidth: tokens.borderWidthThin,
    borderStyle: "solid",
    borderColor: tokens.borderThin,
    backgroundColor: tokens.surfacePage,
    transition: tokens.transitionFast,
    ":hover": {
      color: tokens.textPrimary,
      backgroundColor: tokens.surfaceAccent,
    },
    ":focus-visible": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
});
