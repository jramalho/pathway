/**
 * Shared navigation item definitions for the public site.
 * Consumed by both desktop and mobile navigation.
 */

export type NavigationItem = {
  label: string;
  href: string;
};

export const PUBLIC_NAV_ITEMS: readonly NavigationItem[] = [
  { label: 'Explore', href: '/explore' },
  { label: 'Learning Paths', href: '/paths' },
  { label: 'Topics', href: '/topics' },
] as const;
