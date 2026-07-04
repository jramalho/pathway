import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';
import { SkeletonText } from './skeleton-text';
import { SkeletonMedia } from './skeleton-media';
import { SkeletonCard } from './skeleton-card';

export type SkeletonPageProps = {
  /** Number of card skeletons in the grid. Defaults to 3. */
  cardCount?: number;
  /** Show a hero media block at the top. Defaults to true. */
  withHero?: boolean;
};

/**
 * Generic public page skeleton.
 *
 * Approximates a content page (homepage, explore, path listing) with:
 *   - a heading line
 *   - an optional hero media block
 *   - a responsive grid of card skeletons
 *
 * Used by `(public)/loading.tsx` and individual route `loading.tsx`
 * files. Screen readers: all skeleton children are `aria-hidden`.
 */
export function SkeletonPage({
  cardCount = 3,
  withHero = true,
}: SkeletonPageProps) {
  return (
    <div aria-hidden="true" {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.header)}>
        <SkeletonText lines={1} heading />
        <SkeletonText lines={2} lastLine="half" />
      </div>

      {withHero && <SkeletonMedia aspect="21-9" />}

      <div {...stylex.props(styles.grid)}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

const styles = stylex.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceMd,
    maxWidth: '36rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spaceXl,
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});
