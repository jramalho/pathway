import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type SecondaryButtonProps = {
  children: ReactNode;
  'aria-label': string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

/**
 * Secondary button — mint accent surface, black border, hard offset shadow.
 * Used for secondary CTAs alongside a PrimaryButton.
 */
export function SecondaryButton({
  children,
  href,
  onClick,
  disabled,
  ...rest
}: SecondaryButtonProps) {
  const styleProps = stylex.props(styles.base, styles.secondary);

  if (href) {
    return (
      <a
        href={href}
        aria-label={rest['aria-label']}
        {...styleProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={rest['aria-label']}
      {...styleProps}
    >
      {children}
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
  secondary: {
    backgroundColor: tokens.surfaceAccent,
    borderColor: tokens.borderStrong,
    color: tokens.textPrimary,
    ':hover': {
      backgroundColor: tokens.surfacePage,
    },
    ':active': {
      backgroundColor: tokens.surfaceMuted,
    },
    ':disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: tokens.shadowResting,
    },
  },
});
