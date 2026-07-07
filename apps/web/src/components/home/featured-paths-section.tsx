import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { SectionHeader } from './section-header';
import { ExplorePathCard } from '@/components/explore/explore-result-card';
import type { HomepageFeaturedPath } from '@/lib/homepage-data';
import type { ExplorePathItem } from '@/lib/explore-data';

type FeaturedPathsSectionProps = {
  paths: HomepageFeaturedPath[];
};

/**
 * Featured learning paths section for the homepage.
 *
 * Renders real published Strapi paths as cards using the existing
 * ExplorePathCard for visual consistency. Each card links to its
 * real /paths/[slug] page. Includes a "View all paths" link to /paths.
 */
export function FeaturedPathsSection({ paths }: FeaturedPathsSectionProps) {
  if (paths.length === 0) return null;

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.headerRow)}>
        <SectionHeader
          eyebrow="Learning paths"
          title="Featured learning paths"
          supporting="Structured curricula built from real published lessons."
        />
        <Link href="/paths" {...stylex.props(styles.viewAll)}>
          View all paths
          <span aria-hidden="true" {...stylex.props(styles.viewAllMark)}>→</span>
        </Link>
      </div>

      <div {...stylex.props(styles.grid)}>
        {paths.map((path) => (
          <ExplorePathCard
            key={path.slug}
            path={toExplorePathItem(path)}
            href={`/paths/${path.slug}`}
          />
        ))}
      </div>
    </section>
  );
}

function toExplorePathItem(path: HomepageFeaturedPath): ExplorePathItem {
  return {
    slug: path.slug,
    title: path.title,
    description: path.description,
    difficulty: path.difficulty,
    estimatedDuration: path.estimatedDuration,
    lessonCount: path.lessonCount,
    coverImageUrl: null,
    coverImageAlt: null,
  };
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXl,
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceMd,
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: tokens.spaceLg,
    },
  },
  viewAll: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceXs,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: tokens.textPrimary,
    textDecoration: 'none',
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.accentActive,
    paddingBottom: tokens.spaceXs,
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.accentActive,
    },
    ':focus': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  viewAllMark: {
    display: 'inline-block',
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
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
});
