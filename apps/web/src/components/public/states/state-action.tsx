import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';

export type StateActionVariant = 'primary' | 'secondary';

type StateActionBaseProps = {
  label: string;
  variant?: StateActionVariant;
};

type StateActionLinkProps = StateActionBaseProps & {
  href: string;
  onClick?: never;
};

type StateActionButtonProps = StateActionBaseProps & {
  href?: never;
  onClick: () => void;
};

export type StateActionProps = StateActionLinkProps | StateActionButtonProps;

/**
 * Shared action control for content-state screens.
 *
 * Renders as a Next.js Link when `href` is provided, or a button when
 * `onClick` is provided. Both variants share the same neo-brutalist
 * visual treatment with visible hover, pressed, and focus states.
 * Meets the 44px mobile touch-target minimum.
 */
export function StateAction({ label, variant = 'primary', ...rest }: StateActionProps) {
  if ('href' in rest && rest.href) {
    return (
      <Link
        href={rest.href}
        {...stylex.props(styles.base, styles[variant])}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={rest.onClick}
      {...stylex.props(styles.base, styles[variant])}
    >
      {label}
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
  },
});
