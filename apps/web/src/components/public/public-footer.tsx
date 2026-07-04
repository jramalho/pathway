import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import { PUBLIC_NAV_ITEMS } from './navigation-items';

/**
 * Compact public site footer.
 *
 * Includes the Pathway name, a one-sentence product statement,
 * navigation links matching the public navigation, an architecture
 * statement, and a programmatically generated copyright year.
 */
export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer {...stylex.props(styles.footer)}>
      <div {...stylex.props(styles.inner)}>
        <div {...stylex.props(styles.brand)}>
          <p {...stylex.props(styles.name)}>Pathway</p>
          <p {...stylex.props(styles.statement)}>
            Short, structured learning paths for mobile engineers, product
            builders, and modern technical teams.
          </p>
        </div>

        <nav aria-label="Footer navigation" {...stylex.props(styles.nav)}>
          <ul {...stylex.props(styles.list)}>
            {PUBLIC_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} {...stylex.props(styles.link)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div {...stylex.props(styles.meta)}>
          <p {...stylex.props(styles.architecture)}>
            Built with Expo, Next.js, and Strapi.
          </p>
          <p {...stylex.props(styles.copyright)}>
            © {year} Pathway. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = stylex.create({
  footer: {
    display: 'flex',
    marginTop: 'auto',
    borderTopWidth: tokens.borderWidthStrong,
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceRaised,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
    width: '100%',
    maxWidth: tokens.contentMaxWidth,
    marginInline: 'auto',
    paddingInline: tokens.contentPaddingInline,
    paddingBlock: tokens.space2xl,
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: tokens.space3xl,
    },
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    maxWidth: '32rem',
  },
  name: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textPrimary,
    letterSpacing: '-0.02em',
  },
  statement: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightNormal,
    color: tokens.textSecondary,
  },
  nav: {
    display: 'block',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'inline-block',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.textPrimary,
    textDecoration: 'none',
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.accentActive,
      textDecoration: 'underline',
    },
    ':active': {
      color: tokens.accentActive,
    },
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
  },
  architecture: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    color: tokens.textSecondary,
  },
  copyright: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    color: tokens.textSecondary,
  },
});
