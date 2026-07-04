import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';

export type StateIconVariant =
  | 'loading'
  | 'error'
  | 'empty'
  | 'unavailable'
  | 'not-found';

type StateIconProps = {
  variant: StateIconVariant;
};

/**
 * Decorative inline-SVG icons for content-state screens.
 *
 * No external icon package — these are small, purpose-built SVGs that
 * differentiate state types without relying on color alone. Marked
 * `aria-hidden` because the state title/description carry the meaning.
 */
export function StateIcon({ variant }: StateIconProps) {
  return (
    <span
      aria-hidden="true"
      {...stylex.props(styles.wrapper)}
    >
      {variant === 'loading' && <LoadingIcon />}
      {variant === 'error' && <ErrorIcon />}
      {variant === 'empty' && <EmptyIcon />}
      {variant === 'unavailable' && <UnavailableIcon />}
      {variant === 'not-found' && <NotFoundIcon />}
    </span>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceAccent,
    boxShadow: tokens.shadowResting,
  },
});

function LoadingIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M12 3 2 21h20L12 3z" />
      <line x1="12" y1="9" x2="12" y2="14" />
      <circle cx="12" cy="17.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" opacity="0.3" />
    </svg>
  );
}

function UnavailableIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function NotFoundIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16" y1="16" x2="21" y2="21" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}
