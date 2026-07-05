import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicPageContainer } from '@/components/public/public-page-container';
import { PathHero, PathSummary, PathCurriculum, RelatedPaths } from '@/components/public/path-detail';
import { tokens } from '../../../../styles/tokens.stylex';
import { getPathDetailView, getPublishedPathSlugs, getRelatedPaths } from '@/lib/path-data';
import { buildPathMetadata } from '@/lib/metadata';

/**
 * Revalidation interval for the learning-path route.
 *
 * Matches the homepage and Explore convention: published CMS content
 * changes are infrequent, and a 5-minute window keeps path pages fresh
 * without hammering Strapi on every request. On-demand revalidation
 * via `revalidateTag` is deferred to a later milestone.
 */
export const revalidate = 300;

/**
 * Prerender known published learning paths at build time.
 *
 * Future content (published after a build) is generated on-demand at
 * request time and cached for the revalidation window. If the CMS is
 * unreachable at build time, no paths are prerendered — on-demand
 * generation handles them when first visited.
 */
export async function generateStaticParams() {
  const slugs = await getPublishedPathSlugs();
  return slugs;
}

type PathPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Route-level metadata for a published learning path.
 *
 * Title, description, canonical URL, and Open Graph tags are derived
 * from real Strapi content. If the path is missing or unpublished,
 * `notFound()` triggers the public 404 (which carries noindex).
 */
export async function generateMetadata({
  params,
}: PathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPathDetailView(slug);

  if (result.status !== 'ok') {
    // Returning minimal metadata; notFound() in the page renders the 404.
    return { title: 'Learning path not found', robots: { index: false } };
  }

  return buildPathMetadata({
    title: result.data.title,
    description: result.data.description,
    slug: result.data.slug,
    coverImageUrl: result.data.coverImageUrl,
  });
}

/**
 * Public learning-path route — `/paths/[slug]`.
 *
 * Server-rendered. Loads one published learning path from Strapi
 * through the shared `@pathway/api` package and renders the complete
 * path detail experience:
 *
 *   - full hero with cover media, breadcrumb, title, description, metadata, CTAs
 *   - responsive two-column layout: main curriculum column + sticky summary sidebar
 *   - structured module/lesson curriculum with real content order
 *
 * Missing, unpublished, or invalid paths call `notFound()`, which
 * renders the public 404 within the existing shell. Genuine request
 * failures propagate to the established error boundary.
 */
export default async function PathPage({ params }: PathPageProps) {
  const { slug } = await params;

  // ponytail: minimal slug sanity check. Ceiling: a slug with unusual but
  // valid chars still reaches Strapi, which returns no match → notFound().
  // Upgrade path: stricter validation only if Strapi rejects valid slugs.
  if (!slug || !slug.trim()) {
    notFound();
  }

  const result = await getPathDetailView(slug);

  if (result.status === 'missing') {
    notFound();
  }

  if (result.status === 'error') {
    // Propagate to the nearest error boundary (root error.tsx).
    throw result.error;
  }

  const path = result.data;

  // Fetch related paths (deterministic selection from published paths).
  const relatedPaths = await getRelatedPaths(path);

  return (
    <>
      {/* Hero is full-bleed (forest-green field) — outside the page container. */}
      <PathHero path={path} />

      {/* Two-column layout: curriculum + related paths | sticky summary. */}
      <PublicPageContainer>
        <div {...stylex.props(styles.layout)}>
          <div {...stylex.props(styles.main)}>
            <PathCurriculum path={path} />
            <RelatedPaths paths={relatedPaths} />
          </div>
          <div {...stylex.props(styles.sidebar)}>
            <PathSummary path={path} />
          </div>
        </div>
      </PublicPageContainer>
    </>
  );
}

const styles = stylex.create({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
    '@media (min-width: 1024px)': {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: tokens.space2xl,
    },
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
    minWidth: 0,
    '@media (min-width: 1024px)': {
      flex: '1 1 64%',
    },
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    '@media (min-width: 1024px)': {
      flex: '0 0 20rem',
      position: 'sticky',
      top: '5rem',
      // ponytail: sticky stops when the sidebar's container scrolls past.
      // Ceiling: if the curriculum is shorter than the sidebar, the sticky
      // element rests at top without overlap. No JS scroll tracking needed.
      maxHeight: 'calc(100vh - 6rem)',
      overflowY: 'auto',
    },
  },
});