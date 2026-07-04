import { PublicPageContainer } from '@/components/public/public-page-container';
import { SkeletonPage } from '@/components/public/states';

/**
 * Generic public page loading skeleton.
 *
 * Rendered by Next.js App Router while any `(public)` route segment
 * is loading. Provides a meaningful page-shaped skeleton within the
 * public shell so the layout doesn't shift or flash.
 */
export default function PublicLoading() {
  return (
    <PublicPageContainer>
      <SkeletonPage cardCount={3} />
    </PublicPageContainer>
  );
}
