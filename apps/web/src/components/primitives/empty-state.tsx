import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Optional children rendered below the action (e.g. icon). */
  children?: ReactNode;
};

/**
 * Empty state — a bordered neo-brutalist card with title, description,
 * and optional action. No cartoon illustrations. Uses the same visual
 * language as ContentState but is a lighter-weight primitive for
 * inline empty states.
 */
export function EmptyState({ title, description, actionLabel, onAction, children }: EmptyStateProps) {
  return (
    <div {...stylex.props(styles.container)}>
      {children}
      <h3 {...stylex.props(styles.title)}>{title}</h3>
      {description && <p {...stylex.props(styles.description)}>{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          {...stylex.props(styles.action)}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spaceMd,
    paddingBlock: tokens.space3xl,
    maxWidth: '30rem',
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeXl,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    color: tokens.textPrimary,
    letterSpacing: '-0.02em',
  },
  description: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  action: {
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
    backgroundColor: tokens.surfaceAccent,
    color: tokens.textPrimary,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
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
});
