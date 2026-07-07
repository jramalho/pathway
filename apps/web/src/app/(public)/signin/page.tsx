import type { Metadata } from 'next';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { PlaceholderSection } from '@/components/public/placeholder-section';

/**
 * Non-public route — authentication is out of scope for this milestone.
 * `noindex` keeps this account-related placeholder out of the index
 * without removing the route (the header link points here).
 */
export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <PublicPageContainer>
      <PlaceholderSection
        heading="Sign in"
        description="Authentication is not part of this milestone. This placeholder exists so the header link never leads to a 404."
      />
    </PublicPageContainer>
  );
}
