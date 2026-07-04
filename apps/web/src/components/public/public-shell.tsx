import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';
import { PublicHeader } from './public-header';
import { PublicFooter } from './public-footer';

type PublicShellProps = {
  children: ReactNode;
  /** Pathname used to determine the active nav item. */
  activePath?: string;
  /** Show the skip-to-content link. Defaults to true. */
  skipLink?: boolean;
};

/**
 * Public site shell — skip link, header, main, footer.
 *
 * Shared by the `(public)` route group layout and the root not-found
 * boundary so both render the same visual shell without duplicating
 * the structure.
 */
export function PublicShell({
  children,
  activePath,
  skipLink = true,
}: PublicShellProps) {
  return (
    <div {...stylex.props(styles.shell)}>
      {skipLink && (
        <a href="#main-content" {...stylex.props(styles.skipLink)}>
          Skip to content
        </a>
      )}
      <PublicHeader activePath={activePath} />
      <main {...stylex.props(styles.main)}>{children}</main>
      <PublicFooter />
    </div>
  );
}

const styles = stylex.create({
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.surfacePage,
    color: tokens.textPrimary,
    fontFamily: tokens.fontFamilyBody,
  },
  skipLink: {
    position: 'absolute',
    top: '-100%',
    left: 0,
    zIndex: tokens.zIndexOverlay,
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textOnAccent,
    backgroundColor: tokens.surfaceAction,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    textDecoration: 'none',
    ':focus': {
      top: 0,
    },
  },
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
});
