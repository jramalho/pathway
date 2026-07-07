import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type SkeletonCardProps = {
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
 * Screen readers: the wrapper is marked aria-hidden.
 */
export function SkeletonCard({ withMedia = true, textLines = 3 }: SkeletonCardProps) {
  return (
    <div aria-hidden="true" {...stylex.props(styles.card)}>
      {withMedia && <div {...stylex.props(styles.media)} />}
      <div {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.titleLine)} />
        {Array.from({ length: textLines }).map((_, i) => (
          <div
            key={i}
            {...stylex.props(styles.textLine, i === textLines - 1 && styles.textLineLast)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceRaised,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    aspectRatio: '16 / 9',
    backgroundColor: tokens.surfaceMuted,
    borderBottomWidth: tokens.borderWidthStrong,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderStrong,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    padding: tokens.spaceLg,
  },
  titleLine: {
    height: '1.25rem',
    width: '70%',
    backgroundColor: tokens.surfaceMuted,
  },
  textLine: {
    height: '0.75rem',
    width: '100%',
    backgroundColor: tokens.surfaceMuted,
  },
  textLineLast: {
    width: '60%',
  },
});
