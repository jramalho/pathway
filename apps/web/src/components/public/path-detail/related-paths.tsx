import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';
import type { RelatedPathItem } from '@/lib/path-data';
import { ExplorePathCard } from '@/components/explore/explore-result-card';
import type { ExplorePathItem } from '@/lib/explore-data';

type RelatedPathsProps = {
  paths: RelatedPathItem[];
};

/**
 * Related learning paths section.
 *
 * Renders after the curriculum. Uses the existing `ExplorePathCard` for
 * visual consistency across the site. Each card links to its real
 * `/paths/[slug]` URL when the path has a valid slug.
 *
 * Renders nothing when the `paths` array is empty — no forced empty
 * block. The section is labelled "Related learning paths" (not
 * "Recommended") because no recommendation engine exists.
 */
export function RelatedPaths({ paths }: RelatedPathsProps) {
  if (paths.length === 0) return null;

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.header)}>
        <p {...stylex.props(styles.eyebrow)}>
          <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
          Continue learning
        </p>
        <h2 {...stylex.props(styles.title)}>Related learning paths</h2>
        <p {...stylex.props(styles.supporting)}>
          Other published learning paths on Pathway.
        </p>
      </div>

      <div {...stylex.props(styles.grid)}>
        {paths.map((path) => (
          <ExplorePathCard
            key={path.slug}
            path={toExplorePathItem(path)}
            href={path.slug ? `/paths/${path.slug}` : undefined}
          />
        ))}
      </div>
    </section>
  );
}

/** Map RelatedPathItem to ExplorePathItem (RelatedPathItem is a superset). */
function toExplorePathItem(path: RelatedPathItem): ExplorePathItem {
  return {
    slug: path.slug,
    title: path.title,
    description: path.description,
    difficulty: path.difficulty,
    estimatedDuration: path.estimatedDuration,
    lessonCount: path.lessonCount,
    coverImageUrl: path.coverImageUrl,
    coverImageAlt: path.coverImageAlt,
  };
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXl,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceSm,
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  eyebrowMark: {
    display: 'inline-block',
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: {
      default: tokens.fontSizeXl,
      '@media (min-width: 768px)': tokens.fontSize2xl,
    },
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.02em',
    color: tokens.textPrimary,
  },
  supporting: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': 'repeat(2, 1fr)',
      '@media (min-width: 1024px)': 'repeat(3, 1fr)',
    },
    gap: tokens.spaceXl,
  },
});