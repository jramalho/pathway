import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { PUBLIC_NAV_ITEMS } from './navigation-items';

type PublicNavigationProps = {
  /** Pathname used to determine the active nav item. */
  activePath?: string;
};

/**
 * Desktop top navigation. Renders the main nav links inline.
 * Hidden on mobile widths — the MobileNavigation handles small screens.
 */
export function PublicNavigation({ activePath }: PublicNavigationProps) {
  return (
    <nav aria-label="Main navigation" {...stylex.props(styles.nav)}>
      <ul {...stylex.props(styles.list)}>
        {PUBLIC_NAV_ITEMS.map((item) => {
          const isActive = activePath === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                {...stylex.props(styles.link, isActive && styles.linkActive)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const styles = stylex.create({
  nav: {
    display: 'none',
    '@media (min-width: 768px)': {
      display: 'block',
    },
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spaceXl,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'inline-block',
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceMd,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.textOnHeaderMuted,
    textDecoration: 'none',
    borderBottomWidth: tokens.borderWidthStrong,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.textOnHeader,
      borderBottomColor: tokens.accentActive,
    },
    ':active': {
      color: tokens.textOnHeader,
      borderBottomColor: tokens.accentActive,
    },
  },
  linkActive: {
    color: tokens.textOnHeader,
    borderBottomColor: tokens.accentActive,
  },
});
