import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { PublicShell } from '@/components/public/public-shell';

/**
 * Public site shell layout.
 *
 * Wraps all public routes with the shared shell (skip link, header,
 * main, footer) via `PublicShell`. Reads the request pathname from
 * middleware to determine the active navigation item.
 */
export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const activePath = headerList.get('x-pathway-pathname') ?? undefined;

  return <PublicShell activePath={activePath}>{children}</PublicShell>;
}
