import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import { tokens } from '../../styles/tokens.stylex';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { HomeHero } from '@/components/home/home-hero';
import { FeaturedPathsSection } from '@/components/home/featured-paths-section';
import { PopularLessonsSection } from '@/components/home/popular-lessons-section';
import { TopicsSection } from '@/components/home/topics-section';
import { PracticalLearningSection } from '@/components/home/practical-learning-section';
import { getHomepageData } from '@/lib/homepage-data';
import { buildCanonicalUrl } from '@/lib/metadata';

/**
 * Revalidation interval for the homepage.
 *
 * Published CMS content changes are infrequent. A 5-minute window keeps
 * the homepage fresh for visitors without hammering Strapi on every
 * request. On-demand revalidation via `revalidateTag` is deferred to a
 * later milestone — this time-based interval is the modest, explainable
 * default for published content.
 */
export const revalidate = 300;

/**
 * Homepage metadata — indexable with a self-referencing canonical.
 * Title and description are inherited from the root metadata; the
 * canonical and Open Graph URL are made explicit here.
 */
export const metadata: Metadata = {
  alternates: { canonical: buildCanonicalUrl('/') },
  openGraph: {
    url: buildCanonicalUrl('/'),
  },
};

/**
 * Pathway homepage — public discovery entry point.
 *
 * Server-rendered. Fetches homepage data at the page boundary via the
 * shared `@pathway/api` client and passes the view model to the hero
 * and the content sections. The hero is always rendered; when the CMS
 * is unavailable or empty the hero retains its visual strength and
 * CTAs without misleading stats, and the content sections are omitted
 * gracefully (each returns null when its data is empty).
 */
export default async function HomePage() {
  const result = await getHomepageData();
  const data = result.status === 'error' ? null : result.data;

  return (
    <>
      <HomeHero data={data} />
      {data && (
        <PublicPageContainer>
          <div {...stylex.props(styles.sections)}>
            <FeaturedPathsSection paths={data.featuredPaths} />
            <PopularLessonsSection lessons={data.recommendedLessons} />
            <TopicsSection topics={data.topics} />
            <PracticalLearningSection />
          </div>
        </PublicPageContainer>
      )}
    </>
  );
}

const styles = stylex.create({
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space4xl,
  },
});
