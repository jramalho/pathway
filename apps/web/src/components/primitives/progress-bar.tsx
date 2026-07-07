import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type ProgressBarProps = {
  /** Progress value from 0 to 100. */
  value: number;
  /** Accessible label for screen readers. */
  'aria-label': string;
};

/**
 * Neo-brutalist progress bar: off-white track, 3px black border,
 * acid-green fill. No rounded corners. Accepts 0–100.
 */
export function ProgressBar({ value, ...rest }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={rest['aria-label']}
      {...stylex.props(styles.track)}
    >
      <div
        style={{ width: `${clamped}%` }}
        {...stylex.props(styles.fill)}
      />
    </div>
  );
}

const styles = stylex.create({
  track: {
    display: 'flex',
    width: '100%',
    height: '1rem',
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: tokens.accentActive,
  },
});
