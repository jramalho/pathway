import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /**
   * Visual tone. `page` (default) uses ink colors for the warm off-white
   * page surface. `onHeader` uses off-white colors for the forest-green
   * hero field.
   */
  tone?: 'page' | 'onHeader';
};

/**
 * Semantic breadcrumb navigation for public content routes.
 *
 * The last item represents the current page and is marked with
 * `aria-current="page"`. It renders as plain text (no link) since a
 * page should not link to itself. The nav element carries an
 * accessible label so screen readers announce it as a breadcrumb
 * region.
 */
export function Breadcrumbs({ items, tone = 'page' }: BreadcrumbsProps) {
  const lastIndex = items.length - 1;
  const toneStyles = tone === 'onHeader' ? onHeaderStyles : pageStyles;

  return (
    <nav aria-label="Breadcrumb" {...stylex.props(styles.nav)}>
      <ol {...stylex.props(styles.list)}>
        {items.map((item, index) => {
          const isCurrent = index === lastIndex;
          return (
            <li key={`${item.label}-${index}`} {...stylex.props(styles.item)}>
              {index > 0 && (
                <span aria-hidden="true" {...stylex.props(styles.separator, toneStyles.separator)}>
                  /
                </span>
              )}
              {isCurrent || !item.href ? (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  {...stylex.props(styles.current, toneStyles.current)}
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} {...stylex.props(styles.link, toneStyles.link)}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const styles = stylex.create({
  nav: {
    display: 'block',
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spaceXs,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceXs,
  },
  separator: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
  },
  link: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightSemibold,
    textDecoration: 'none',
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    transition: tokens.transitionFast,
    ':focus': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineOffset: tokens.spaceXs,
    },
  },
  current: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
  },
});

/** Tone variants for the warm off-white page surface. */
const pageStyles = stylex.create({
  separator: {
    color: tokens.textSecondary,
  },
  link: {
    color: tokens.textSecondary,
    ':hover': {
      color: tokens.textPrimary,
      borderBottomColor: tokens.accentActive,
    },
    ':focus': {
      outlineColor: tokens.accentFocus,
    },
  },
  current: {
    color: tokens.textPrimary,
  },
});

/** Tone variants for the deep forest-green hero field. */
const onHeaderStyles = stylex.create({
  separator: {
    color: tokens.textOnHeaderMuted,
  },
  link: {
    color: tokens.textOnHeaderMuted,
    ':hover': {
      color: tokens.textOnHeader,
      borderBottomColor: tokens.accentActive,
    },
    ':focus': {
      outlineColor: tokens.accentActive,
    },
  },
  current: {
    color: tokens.textOnHeader,
  },
});