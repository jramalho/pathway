import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../../styles/tokens.stylex';
import { StateIcon, type StateIconVariant } from './state-icon';
import { StateAction, type StateActionProps } from './state-action';

export type ContentStateVariant =
  | 'loading'
  | 'error'
  | 'empty'
  | 'unavailable'
  | 'not-found';

type ContentStateProps = {
  variant: ContentStateVariant;
  /** Small contextual label above the title (e.g. "Explore"). */
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: StateActionProps;
  secondaryAction?: StateActionProps;
  /** Override the default icon for this variant. */
  icon?: StateIconVariant | 'none';
  /** Optional children rendered below the actions (e.g. inline skeletons). */
  children?: ReactNode;
};

const variantRole: Record<ContentStateVariant, 'status' | 'alert' | undefined> = {
  loading: 'status',
  error: 'alert',
  empty: 'status',
  unavailable: 'alert',
  'not-found': 'status',
};

const variantAriaLive: Record<ContentStateVariant, 'polite' | 'assertive' | undefined> = {
  loading: 'polite',
  error: 'assertive',
  empty: 'polite',
  unavailable: 'assertive',
  'not-found': 'polite',
};

/**
 * Unified content-state component for public pages.
 *
 * Supports loading, error, empty, unavailable, and not-found variants.
 * Each variant gets an appropriate ARIA role and aria-live politeness
 * so screen readers announce failures without spamming on loading.
 *
 * Use this for:
 *   - loading public learning content
 *   - failed CMS request with retry
 *   - no explore results after filters/search
 *   - published content removed or unavailable
 *   - unknown public route or nonexistent lesson/path
 */
export function ContentState({
  variant,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  children,
}: ContentStateProps) {
  const iconVariant = icon === 'none' ? null : (icon ?? variant);
  const role = variantRole[variant];
  const ariaLive = variantAriaLive[variant];

  return (
    <section
      role={role}
      aria-live={ariaLive}
      aria-busy={variant === 'loading' || undefined}
      {...stylex.props(styles.section)}
    >
      <div {...stylex.props(styles.card)}>
        {iconVariant && <StateIcon variant={iconVariant} />}

        {eyebrow && (
          <p {...stylex.props(styles.eyebrow)}>{eyebrow}</p>
        )}

        <h1 {...stylex.props(styles.title)}>{title}</h1>
        <p {...stylex.props(styles.description)}>{description}</p>

        {(primaryAction || secondaryAction) && (
          <div {...stylex.props(styles.actions)}>
            {primaryAction && <StateAction {...primaryAction} />}
            {secondaryAction && <StateAction {...secondaryAction} />}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBlock: tokens.space3xl,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spaceLg,
    maxWidth: '30rem',
    width: '100%',
    padding: tokens.space2xl,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceRaised,
    boxShadow: tokens.shadowResting,
    textAlign: 'center',
  },
  eyebrow: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSize2xl,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    color: tokens.textPrimary,
    letterSpacing: '-0.02em',
  },
  description: {
    margin: 0,
    maxWidth: '26rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spaceMd,
    marginTop: tokens.spaceSm,
  },
});
