import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';
import { SkeletonMedia } from './skeleton-media';
import { SkeletonText } from './skeleton-text';

export type SkeletonCardProps = {
  /** Show a media/cover block at the top. Defaults to true. */
  withMedia?: boolean;
  /** Number of text lines below the media. Defaults to 3. */
  textLines?: number;
};

/**
 * Card skeleton — a bordered neo-brutalist card with optional media
 * block and text lines. Generic enough to approximate a learning-path
 * card, lesson card, or topic card without hardcoding their layouts.
 *
 * Screen readers: the wrapper is marked `aria-hidden`.
 */
export function SkeletonCard({
  withMedia = true,
  textLines = 3,
}: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      {...stylex.props(styles.card)}
    >
      {withMedia && <SkeletonMedia aspect="16-9" />}
      <div {...stylex.props(styles.body)}>
        <SkeletonText lines={1} heading />
        <SkeletonText lines={textLines} lastLine="three-quarters" />
      </div>
    </div>
  );
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    padding: tokens.spaceLg,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceRaised,
    boxShadow: tokens.shadowResting,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceMd,
  },
});
