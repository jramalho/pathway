import type { Metadata } from 'next';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { PlaceholderSection } from '@/components/public/placeholder-section';

/**
 * Placeholder route — topic pages arrive in a later milestone.
 * `noindex` keeps this unfinished page out of the index without removing
 * the route (the header links to it).
 */
export const metadata: Metadata = {
  title: 'Topics',
  robots: { index: false, follow: true },
};

export default function TopicsPage() {
  return (
    <PublicPageContainer>
      <PlaceholderSection
        heading="Topics"
        description="Browse learning content by topic. Topic pages arrive soon."
      />
    </PublicPageContainer>
  );
}
