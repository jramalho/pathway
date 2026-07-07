'use client';

import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type BookmarkControlProps = {
  bookmarked: boolean;
  onToggle: () => void;
  'aria-label': string;
  disabled?: boolean;
};

/**
 * Neo-brutalist bookmark toggle for web. Off = transparent with 2px
 * border. On = acid-green surface. Visible focus outline for keyboard
 * navigation. Meets 44px touch target.
 */
export function BookmarkControl({
  bookmarked,
  onToggle,
  disabled,
  ...rest
}: BookmarkControlProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={bookmarked}
      aria-label={rest['aria-label']}
      {...stylex.props(styles.button, bookmarked && styles.bookmarked)}
    >
      <BookmarkIcon filled={bookmarked} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

const styles = stylex.create({
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    padding: 0,
    backgroundColor: 'transparent',
    color: tokens.textPrimary,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    cursor: 'pointer',
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfaceMuted,
    },
    ':focus-visible': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: '2px',
    },
    ':disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
  bookmarked: {
    backgroundColor: tokens.surfaceAction,
    color: tokens.textOnAccent,
    borderColor: tokens.borderStrong,
    ':hover': {
      backgroundColor: tokens.surfaceActionHover,
    },
  },
});
