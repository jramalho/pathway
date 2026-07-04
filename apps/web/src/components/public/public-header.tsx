import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { PublicNavigation } from './public-navigation';
import { MobileNavigation } from './mobile-navigation';

type PublicHeaderProps = {
  /** Pathname used to determine the active nav item. */
  activePath?: string;
};

/**
 * Responsive public site header.
 *
 * Desktop: wordmark (left) + inline nav (center/right) + Sign in (right).
 * Mobile: wordmark (left) + hamburger trigger (right) with dropdown menu.
 */
export function PublicHeader({ activePath }: PublicHeaderProps) {
  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.inner)}>
        <Link
          href="/"
          aria-label="Pathway home"
          {...stylex.props(styles.wordmark)}
        >
          Pathway
        </Link>

        <PublicNavigation activePath={activePath} />

        <div {...stylex.props(styles.actions)}>
          <Link
            href="/signin"
            aria-label="Sign in to Pathway"
            {...stylex.props(styles.signIn)}
          >
            Sign in
          </Link>
          <MobileNavigation activePath={activePath} />
        </div>
      </div>
    </header>
  );
}

const styles = stylex.create({
  header: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    minHeight: tokens.headerHeight,
    backgroundColor: tokens.surfaceHeader,
    borderBottomWidth: tokens.borderWidthStrong,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderStrong,
    boxShadow: tokens.shadowHeader,
    zIndex: tokens.zIndexHeader,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: tokens.contentMaxWidth,
    marginInline: 'auto',
    paddingInline: tokens.contentPaddingInline,
    gap: tokens.spaceXl,
  },
  wordmark: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeXl,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textOnHeader,
    textDecoration: 'none',
    letterSpacing: '-0.02em',
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.accentActive,
    },
    ':active': {
      color: tokens.accentActive,
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spaceLg,
  },
  signIn: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.textOnHeader,
    textDecoration: 'none',
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.textOnHeaderMuted,
    backgroundColor: 'transparent',
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.textOnHeader,
      borderColor: tokens.accentActive,
    },
    ':active': {
      color: tokens.textOnHeader,
      borderColor: tokens.accentActive,
    },
  },
});
