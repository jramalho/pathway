import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type PrimaryButtonProps = {
  children: ReactNode;
  /** Accessible label. */
  'aria-label': string;
  /** Render as a link instead of a button. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * Primary button — acid-green surface, black border, hard offset shadow.
 * Pressed state shifts the element and reduces the shadow. Visible
 * focus outline for keyboard navigation. Meets 44px touch target.
 */
export function PrimaryButton({
  children,
  href,
  onClick,
  disabled,
  loading,
  ...rest
}: PrimaryButtonProps) {
  const styleProps = stylex.props(styles.base, styles.primary);

  if (href) {
    return (
      <a
        href={href}
        aria-label={rest['aria-label']}
        {...styleProps}
      >
        {loading ? '···' : children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={rest['aria-label']}
      aria-busy={loading || undefined}
      {...styleProps}
    >
      {loading ? '···' : children}
    </button>
  );
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '2.75rem',
    paddingBlock: tokens.spaceMd,
    paddingInline: tokens.spaceXl,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    cursor: 'pointer',
    boxShadow: tokens.shadowResting,
    transition: tokens.transitionFast,
    ':hover': {
      transform: 'translate(-1px, -1px)',
    },
    ':active': {
      transform: 'translate(2px, 2px)',
      boxShadow: tokens.shadowPressed,
    },
    ':focus-visible': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  primary: {
    backgroundColor: tokens.surfaceAction,
    borderColor: tokens.borderStrong,
    color: tokens.textOnAccent,
    ':hover': {
      backgroundColor: tokens.surfaceActionHover,
    },
    ':active': {
      backgroundColor: tokens.surfaceActionPressed,
    },
    ':disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: tokens.shadowResting,
    },
  },
});
