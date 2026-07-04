import { PublicPageContainer } from '@/components/public/public-page-container';
import { PlaceholderSection } from '@/components/public/placeholder-section';

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
