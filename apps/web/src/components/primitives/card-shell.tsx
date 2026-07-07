import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type CardShellProps = {
  children: ReactNode;
  /** When true, renders a hard offset shadow. */
  withShadow?: boolean;
  /** When true, makes the card a link (cursor pointer, hover transform). */
  interactive?: boolean;
  /** HTML element override. Defaults to 'div'. */
  as?: 'div' | 'article' | 'li';
  /** Accessible label for interactive cards. */
  'aria-label'?: string;
  /** href for interactive cards rendered as links. */
  href?: string;
};

/**
 * CardShell — the base neo-brutalist card container for web.
 *
 * 3px black border, optional hard shadow. Interactive cards get
 * hover/active transforms and focus outlines. Content components
 * compose on top of this instead of re-implementing the border/shadow
 * pattern each time.
 */
export function CardShell({
  children,
  withShadow = false,
  interactive = false,
  href,
  as = 'div',
  ...rest
}: CardShellProps) {
  const Tag = as;
  const styleProps = stylex.props(
    styles.card,
    withShadow && styles.shadowed,
    interactive && styles.interactive,
  );

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
    <Tag {...styleProps}>
      {children}
    </Tag>
  );
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    textDecoration: 'none',
    color: 'inherit',
  },
  shadowed: {
    boxShadow: tokens.shadowResting,
  },
  interactive: {
    cursor: 'pointer',
    transition: tokens.transitionFast,
    ':hover': {
      transform: 'translate(-1px, -1px)',
      boxShadow: '6px 6px 0 0 #000000',
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
});
