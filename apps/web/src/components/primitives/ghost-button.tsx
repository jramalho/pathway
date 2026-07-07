import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type GhostButtonProps = {
  children: ReactNode;
  'aria-label': string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

/**
 * Ghost button — transparent background, bottom black border only.
 * Minimal visual weight for tertiary actions. No shadow.
 */
export function GhostButton({
  children,
  href,
  onClick,
  disabled,
  ...rest
}: GhostButtonProps) {
  const styleProps = stylex.props(styles.base);

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
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    borderBottomWidth: tokens.borderWidthStrong,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderStrong,
    color: tokens.textPrimary,
    cursor: 'pointer',
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.accentActive,
    },
    ':active': {
      color: tokens.accentActive,
    },
    ':focus-visible': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
    ':disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
});
