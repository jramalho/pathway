import type { Metadata } from 'next';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { PlaceholderSection } from '@/components/public/placeholder-section';

/**
 * Placeholder route — the full path listing arrives in a later milestone.
 * `noindex` keeps this unfinished page out of the index without removing
 * the route (the header links to it). Individual published paths at
 * `/paths/[slug]` remain indexable.
 */
export const metadata: Metadata = {
  title: 'Learning Paths',
  robots: { index: false, follow: true },
};

export default function LearningPathsPage() {
  return (
    <PublicPageContainer>
      <PlaceholderSection
        heading="Learning Paths"
        description="Structured learning paths from Strapi. The full path listing arrives soon."
      />
    </PublicPageContainer>
  );
}
