import { PublicPageContainer } from '@/components/public/public-page-container';
import { ContentState } from '@/components/public/states';

/**
 * Public not-found boundary.
 *
 * Rendered when a route within the `(public)` group calls `notFound()`
 * or when a visitor hits a URL that doesn't match any public route.
 * Preserves the public shell (header, footer) and links back to the
 * homepage and Explore.
 */
export default function PublicNotFound() {
  return (
    <PublicPageContainer>
      <ContentState
        variant="not-found"
        eyebrow="404"
        title="Page not found"
        description="The page you're looking for doesn't exist or may have been moved."
        primaryAction={{
          label: 'Back to home',
          href: '/',
        }}
        secondaryAction={{
          label: 'Explore',
          href: '/explore',
          variant: 'secondary',
        }}
      />
    </PublicPageContainer>
  );
}
