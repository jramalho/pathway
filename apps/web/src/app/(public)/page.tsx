import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { HomeHero } from '@/components/home/home-hero';
import { getHomepageData } from '@/lib/homepage-data';

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
 * Pathway homepage — public discovery entry point.
 *
 * Server-rendered. Fetches homepage data at the page boundary via the
 * shared `@pathway/api` client and passes the view model to `HomeHero`.
 * The hero is always rendered; when the CMS is unavailable or empty the
 * hero retains its visual strength and CTAs without misleading stats.
 */
export default async function HomePage() {
  const result = await getHomepageData();
  const data = result.status === 'error' ? null : result.data;

  return (
    <>
      <HomeHero data={data} />
      <PublicPageContainer>
        <div {...stylex.props(styles.transition)}>
          <div {...stylex.props(styles.transitionLine)} aria-hidden="true" />
          <p {...stylex.props(styles.transitionText)}>
            More learning content is being surfaced below.
          </p>
          <div {...stylex.props(styles.transitionLine)} aria-hidden="true" />
        </div>
      </PublicPageContainer>
    </>
  );
}

const styles = stylex.create({
  transition: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spaceLg,
    paddingTop: tokens.space2xl,
  },
  transitionLine: {
    flex: 1,
    height: tokens.borderWidthThin,
    backgroundColor: tokens.borderThin,
  },
  transitionText: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
    whiteSpace: 'nowrap',
  },
});
