import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';

export type SkeletonMediaAspect = '16-9' | '4-3' | '1-1' | '21-9';

export type SkeletonMediaProps = {
  /** Aspect ratio of the media block. Defaults to "16-9". */
  aspect?: SkeletonMediaAspect;
};

const aspectStyles: Record<SkeletonMediaAspect, 'aspect_16_9' | 'aspect_4_3' | 'aspect_1_1' | 'aspect_21_9'> = {
  '16-9': 'aspect_16_9',
  '4-3': 'aspect_4_3',
  '1-1': 'aspect_1_1',
  '21-9': 'aspect_21_9',
};

/**
 * Media/cover skeleton — a bordered block with a fixed aspect ratio
 * that approximates a cover image or media preview. Uses the global
 * `.pathway-skeleton` pulse class (disabled under reduced-motion).
 *
 * Screen readers: marked `aria-hidden`.
 */
export function SkeletonMedia({ aspect = '16-9' }: SkeletonMediaProps) {
  return (
    <div
      aria-hidden="true"
      className="pathway-skeleton"
      {...stylex.props(styles.media, styles[aspectStyles[aspect]])}
    />
  );
}

const styles = stylex.create({
  media: {
    width: '100%',
    backgroundColor: tokens.surfaceMuted,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
  },
  aspect_16_9: {
    aspectRatio: '16 / 9',
  },
  aspect_4_3: {
    aspectRatio: '4 / 3',
  },
  aspect_1_1: {
    aspectRatio: '1 / 1',
  },
  aspect_21_9: {
    aspectRatio: '21 / 9',
  },
});
