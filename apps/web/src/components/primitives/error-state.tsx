import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type ErrorStateProps = {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

/**
 * Error state — short message, optional retry button, optional
 * secondary action. Visually compatible with the neo-brutalist system.
 * Retry and secondary actions are only wired when real handlers are
 * provided.
 */
export function ErrorState({ message, retryLabel, onRetry, secondaryLabel, onSecondary }: ErrorStateProps) {
  return (
    <div {...stylex.props(styles.container)}>
      <p {...stylex.props(styles.message)}>{message}</p>
      <div {...stylex.props(styles.actions)}>
        {retryLabel && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            {...stylex.props(styles.primary)}
          >
            {retryLabel}
          </button>
        )}
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            {...stylex.props(styles.secondary)}
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spaceLg,
    paddingBlock: tokens.space3xl,
    maxWidth: '30rem',
  },
  message: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textPrimary,
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spaceMd,
  },
  primary: {
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
    backgroundColor: tokens.surfaceAction,
    color: tokens.textOnAccent,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    cursor: 'pointer',
    boxShadow: tokens.shadowResting,
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfaceActionHover,
      transform: 'translate(-1px, -1px)',
    },
    ':active': {
      backgroundColor: tokens.surfaceActionPressed,
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
      backgroundColor: tokens.surfacePage,
      transform: 'translate(-1px, -1px)',
    },
    ':active': {
      backgroundColor: tokens.surfaceMuted,
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
