'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { tokens } from '../../styles/tokens.stylex';
import { PUBLIC_NAV_ITEMS } from './navigation-items';

type MobileNavigationProps = {
  /** Pathname used to determine the active nav item. */
  activePath?: string;
};

/**
 * Mobile navigation with an accessible menu trigger.
 *
 * - Menu opens and closes via the trigger button.
 * - Escape closes the menu.
 * - Focus moves to the first link when opened, back to trigger when closed.
 * - Clicking a link closes the menu.
 * - Visible only on mobile widths; desktop uses PublicNavigation.
 */
export function MobileNavigation({ activePath }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      // Close if the click is outside the wrapper element.
      const wrapper = triggerRef.current?.parentElement;
      if (wrapper && !wrapper.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen]);

  // Move focus to first link when menu opens.
  useEffect(() => {
    if (isOpen) {
      firstLinkRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div {...stylex.props(styles.wrapper)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((prev) => !prev)}
        {...stylex.props(styles.trigger)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          aria-hidden="true"
        >
          {isOpen ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          id="mobile-nav-menu"
          role="menu"
          aria-label="Mobile navigation"
          {...stylex.props(styles.menu)}
        >
          <ul {...stylex.props(styles.list)}>
            {PUBLIC_NAV_ITEMS.map((item, index) => {
              const isActive = activePath === item.href;
              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                    {...stylex.props(
                      styles.link,
                      isActive && styles.linkActive,
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    position: 'relative',
    display: 'block',
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    padding: 0,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderOnHeader,
    backgroundColor: 'transparent',
    color: tokens.textOnHeader,
    cursor: 'pointer',
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfaceHeaderHover,
    },
    ':active': {
      backgroundColor: tokens.surfaceHeaderHover,
    },
    ':focus-visible': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  menu: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: 0,
    minWidth: '12rem',
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfacePage,
    boxShadow: tokens.shadowResting,
    zIndex: tokens.zIndexOverlay,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'block',
    paddingBlock: tokens.spaceLg,
    paddingInline: tokens.spaceXl,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.textPrimary,
    textDecoration: 'none',
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderThin,
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfaceAccent,
    },
    ':active': {
      backgroundColor: tokens.surfaceAccent,
    },
    ':focus-visible': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: '-2px',
    },
  },
  linkActive: {
    backgroundColor: tokens.surfaceAccent,
    color: tokens.textPrimary,
  },
});
