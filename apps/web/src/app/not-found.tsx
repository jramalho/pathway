import { PublicShell } from '@/components/public/public-shell';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { ContentState } from '@/components/public/states';

/**
 * Root not-found boundary.
 *
 * Rendered by Next.js when a URL doesn't match any route. Unlike
 * `(public)/not-found.tsx` (which only catches `notFound()` calls
 * inside the public group), this handles truly unmatched URLs.
 *
 * Includes the public shell (header, footer) directly so the 404
 * page is visually consistent with the rest of the site.
 */
export default function NotFound() {
  return (
    <PublicShell>
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
    </PublicShell>
  );
}
