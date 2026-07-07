import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { ContentState } from '@/components/public/states';
import { ExploreWorkbench } from '@/components/explore/explore-workbench';
import { getExploreContent } from '@/lib/explore-data';
import {
  parseExploreFilters,
  hasActiveFilters,
  type ExploreSearchParams,
} from '@/lib/explore-filters';
import { buildCanonicalUrl } from '@/lib/metadata';
import { tokens } from '../../../styles/tokens.stylex';

/**
 * Revalidation interval for the Explore page.
 *
 * Matches the homepage convention: published CMS content changes are
 * infrequent, and a 5-minute window keeps discovery fresh without
 * hammering Strapi on every request. On-demand revalidation via
 * `revalidateTag` is deferred to a later milestone.
 */
export const revalidate = 300;

/**
 * Route-level metadata for Explore.
 *
 * The base `/explore` URL (no query params) is indexable with a
 * self-referencing canonical. Any URL with active query params
 * (`q`, `topic`, `difficulty`) represents a filtered/search state —
 * an unbounded set of indexable URLs — so those variants carry
 * `noindex, follow` and canonicalize to `/explore`. The visible
 * browser URL is preserved (query params are not stripped); only
 * the canonical and robots directives consolidate indexing.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ExploreSearchParams>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const filters = parseExploreFilters(raw);
  const canonical = buildCanonicalUrl('/explore');

  if (hasActiveFilters(filters)) {
    return {
      title: 'Explore',
      description:
        'Browse published learning paths and focused lessons on Pathway. Search by text and filter by topic or difficulty.',
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }

  return {
    title: 'Explore',
    description:
      'Browse published learning paths and focused lessons on Pathway. Search by text and filter by topic or difficulty.',
    alternates: { canonical },
  };
}

/**
 * Explore page — public content discovery.
 *
 * Server-rendered. Fetches published Strapi content at the page boundary
 * via the shared `@pathway/api` client and maps it into a compact Explore
 * view model. URL query params (`q`, `topic`, `difficulty`) are parsed
 * into a typed initial filter state and passed to the narrow Client
 * Component workbench, which handles local filtering and synchronizes
 * the current filters back to the URL.
 *
 * Direct URLs with valid or invalid `q`, `topic`, and `difficulty`
 * values never crash: invalid values are silently ignored by the
 * filter parser, and a CMS failure renders a graceful error state
 * within the public shell.
 */
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<ExploreSearchParams>;
}) {
  const raw = await searchParams;
  const initialFilters = parseExploreFilters(raw);
  const result = await getExploreContent();

  return (
    <>
      <PublicPageContainer>
        <section {...stylex.props(styles.intro)}>
          <p {...stylex.props(styles.eyebrow)}>
            <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
            Discover Pathway
          </p>
          <h1 {...stylex.props(styles.headline)}>
            Explore practical technical learning
          </h1>
          <p {...stylex.props(styles.supporting)}>
            Browse structured learning paths and focused lessons from the
            Pathway catalog. Search by text, or filter by topic and difficulty
            to find the right starting point.
          </p>
          <p {...stylex.props(styles.hint)}>
            Paths group related lessons; lessons are short, focused readings
            you can open individually.
          </p>
        </section>
      </PublicPageContainer>

      <PublicPageContainer>
        {result.status === 'error' ? (
          <ContentState
            variant="error"
            eyebrow="Explore"
            title="Couldn't load the catalog"
            description="We couldn't reach the content source right now. Please try again in a moment."
            primaryAction={{ label: 'Try again', href: '/explore' }}
            secondaryAction={{ label: 'Back to home', href: '/', variant: 'secondary' }}
          />
        ) : result.status === 'empty' ? (
          <ContentState
            variant="empty"
            eyebrow="Explore"
            title="No content published yet"
            description="The learning catalog will appear here once learning paths and lessons are published."
            primaryAction={{ label: 'Back to home', href: '/' }}
          />
        ) : (
          <ExploreWorkbench
            data={result.data}
            initialFilters={initialFilters}
          />
        )}
      </PublicPageContainer>
    </>
  );
}

const styles = stylex.create({
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    paddingBottom: tokens.space2xl,
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceSm,
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  eyebrowMark: {
    display: 'inline-block',
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  headline: {
    margin: 0,
    maxWidth: '24ch',
    fontFamily: tokens.fontFamilyHeading,
    fontSize: {
      default: tokens.fontSize2xl,
      '@media (min-width: 768px)': tokens.fontSize3xl,
    },
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.03em',
    color: tokens.textPrimary,
  },
  supporting: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeLg,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  hint: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
});
