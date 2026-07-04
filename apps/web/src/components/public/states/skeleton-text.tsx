import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';

export type SkeletonLastLine = 'full' | 'three-quarters' | 'half' | 'quarter';

export type SkeletonTextProps = {
  /** Number of lines to render. */
  lines?: number;
  /** Visual width of the last line. Defaults to "full". */
  lastLine?: SkeletonLastLine;
  /** Heading line — taller, for titles. */
  heading?: boolean;
};

const lastLineStyles: Record<SkeletonLastLine, 'last_full' | 'last_three_quarters' | 'last_half' | 'last_quarter'> = {
  full: 'last_full',
  'three-quarters': 'last_three_quarters',
  half: 'last_half',
  quarter: 'last_quarter',
};

/**
 * Text-line skeleton — one or more horizontal bars that approximate
 * lines of text. Uses the global `.pathway-skeleton` pulse class,
 * which is disabled under `prefers-reduced-motion`.
 *
 * Screen readers: the wrapper is marked `aria-hidden` so skeletons
 * don't create inaccessible noise.
 */
export function SkeletonText({
  lines = 3,
  lastLine = 'full',
  heading = false,
}: SkeletonTextProps) {
  return (
    <div
      aria-hidden="true"
      {...stylex.props(styles.wrapper)}
    >
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        return (
          <div
            key={index}
            className="pathway-skeleton"
            {...stylex.props(
              styles.line,
              heading && styles.lineHeading,
              isLast && styles[lastLineStyles[lastLine]],
            )}
          />
        );
      })}
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    width: '100%',
  },
  line: {
    height: '0.75rem',
    width: '100%',
    backgroundColor: tokens.surfaceMuted,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderThin,
  },
  lineHeading: {
    height: '1.5rem',
  },
  last_full: {
    width: '100%',
  },
  last_three_quarters: {
    width: '75%',
  },
  last_half: {
    width: '50%',
  },
  last_quarter: {
    width: '25%',
  },
});
