import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicPageContainer } from '@/components/public/public-page-container';
import {
  LessonHero,
  LessonBodyRenderer,
  LessonMedia,
  LessonTocAside,
  LessonTocInline,
  shouldShowToc,
  LessonPathCta,
  LessonNav,
  LessonRelated,
  LessonShare,
} from '@/components/public/lesson-detail';
import { tokens } from '../../../../styles/tokens.stylex';
import {
  getLessonDetailView,
  getPublishedLessonSlugs,
} from '@/lib/lesson-data';
import { getRelatedLessons, getLessonNav } from '@/lib/lesson-navigation';
import { parseLessonBody, extractTocEntries } from '@/lib/lesson-body-parser';
import { buildLessonMetadata, buildCanonicalUrl } from '@/lib/metadata';

/**
 * Revalidation interval for the lesson route.
 *
 * Matches the homepage, Explore, and path-route convention: published
 * CMS content changes are infrequent, and a 5-minute window keeps
 * lesson pages fresh without hammering Strapi on every request.
 * On-demand revalidation via `revalidateTag` is deferred to a later
 * milestone.
 */
export const revalidate = 300;

/**
 * Prerender known published lessons at build time.
 *
 * Future content (published after a build) is generated on-demand at
 * request time and cached for the revalidation window. If the CMS is
 * unreachable at build time, no lessons are prerendered — on-demand
 * generation handles them when first visited.
 *
 * Lesson slugs are derived from the published learning-path tree (each
 * module's lessons) via the existing `getPublishedLearningPaths` call —
 * no duplicate API implementation.
 */
export async function generateStaticParams() {
  const slugs = await getPublishedLessonSlugs();
  return slugs;
}

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Route-level metadata for a published lesson.
 *
 * Title, description, canonical URL, and Open Graph tags are derived
 * from real Strapi content. If the lesson is missing or unpublished,
 * `notFound()` triggers the public 404 (which carries noindex).
 */
export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getLessonDetailView(slug);

  if (result.status !== 'ok') {
    // Returning minimal metadata; notFound() in the page renders the 404.
    return { title: 'Lesson not found', robots: { index: false } };
  }

  const lesson = result.data;
  return buildLessonMetadata({
    title: lesson.title,
    summary: lesson.summary,
    slug: lesson.slug,
    coverImageUrl: lesson.videoThumbnailUrl,
    publishedAt: lesson.publishedAt,
  });
}

/**
 * Public lesson route — `/lessons/[slug]`.
 *
 * Server-rendered. Loads one published lesson from Strapi through the
 * shared `@pathway/api` package and renders the complete editorial
 * reading experience:
 *
 *   - hero with breadcrumb, title, summary, real metadata, author, and
 *     a link back to the parent learning path
 *   - media area (real video thumbnail, direct video, or decorative fallback)
 *   - responsive two-column layout: article body + sticky table of
 *     contents on desktop; in-flow TOC on mobile/tablet
 *   - safe structured body renderer (typed Markdown → semantic HTML)
 *   - sharing controls (the only Client Component — Web Share API,
 *     Clipboard API, LinkedIn, WhatsApp)
 *   - contextual previous/next lesson navigation within the parent path
 *   - contextual CTA back to the parent learning path
 *   - related lessons based on real content relationships
 *
 * Missing, unpublished, or invalid lessons call `notFound()`, which
 * renders the public 404 within the existing shell. Genuine request
 * failures propagate to the established error boundary.
 *
 * User progress, saved items, authentication, and completion tracking
 * are out of scope — no fake user state is rendered.
 */
export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;

  // ponytail: minimal slug sanity check. Ceiling: a slug with unusual but
  // valid chars still reaches Strapi, which returns no match → notFound().
  // Upgrade path: stricter validation only if Strapi rejects valid slugs.
  if (!slug || !slug.trim()) {
    notFound();
  }

  const result = await getLessonDetailView(slug);

  if (result.status === 'missing') {
    notFound();
  }

  if (result.status === 'error') {
    // Propagate to the nearest error boundary (root error.tsx).
    throw result.error;
  }

  const lesson = result.data;

  // Parse the Markdown body into a typed block tree once — used by both
  // the body renderer and the table of contents.
  const bodyBlocks = parseLessonBody(lesson.body);
  const tocEntries = extractTocEntries(bodyBlocks);
  const showToc = shouldShowToc(tocEntries);

  // Fetch related lessons and previous/next navigation in parallel.
  // Both are server-side, typed, and use only real published Strapi data.
  const [relatedLessons, lessonNav] = await Promise.all([
    getRelatedLessons(
      lesson.slug,
      lesson.category?.slug ?? null,
      lesson.difficulty,
      lesson.learningPath?.slug ?? null,
    ),
    getLessonNav(lesson.slug, lesson.learningPath?.slug ?? null),
  ]);

  // Build the canonical URL for sharing controls.
  const canonicalUrl = buildCanonicalUrl(`/lessons/${lesson.slug}`);

  return (
    <>
      {/* Hero is full-bleed (forest-green field) — outside the page container. */}
      <LessonHero lesson={lesson} />

      <PublicPageContainer>
        {/* Media area — honest video/image/fallback. */}
        <div {...stylex.props(styles.mediaWrap)}>
          <LessonMedia
            thumbnailUrl={lesson.videoThumbnailUrl}
            thumbnailAlt={lesson.videoThumbnailAlt}
            videoUrl={lesson.videoUrl}
            title={lesson.title}
          />
        </div>

        {/* Mobile/tablet in-flow TOC — only when there are enough headings. */}
        {showToc && <LessonTocInline entries={tocEntries} />}

        {/* Two-column layout: article body + sticky TOC on desktop. */}
        <div {...stylex.props(styles.layout)}>
          <div {...stylex.props(styles.articleCol)}>
            <LessonBodyRenderer blocks={bodyBlocks} />

            {/* Sharing controls — the only Client Component on the page. */}
            <div {...stylex.props(styles.shareWrap)}>
              <LessonShare
                url={canonicalUrl}
                title={lesson.title}
                summary={lesson.summary}
              />
            </div>

            {/* Previous/next lesson navigation within the parent path. */}
            {lessonNav && <LessonNav nav={lessonNav} />}
          </div>
          {showToc && <LessonTocAside entries={tocEntries} />}
        </div>

        {/* Contextual CTA back to the parent learning path. */}
        <div {...stylex.props(styles.ctaWrap)}>
          <LessonPathCta learningPath={lesson.learningPath} />
        </div>

        {/* Related lessons — only when alternatives exist. */}
        {relatedLessons.length > 0 && (
          <div {...stylex.props(styles.relatedWrap)}>
            <LessonRelated lessons={relatedLessons} />
          </div>
        )}
      </PublicPageContainer>
    </>
  );
}

const styles = stylex.create({
  mediaWrap: {
    display: 'flex',
    paddingBottom: tokens.space2xl,
  },
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
  articleCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
    minWidth: 0,
    '@media (min-width: 1024px)': {
      flex: '1 1 auto',
      maxWidth: '48rem',
    },
  },
  shareWrap: {
    display: 'flex',
    paddingTop: tokens.spaceLg,
    borderTopWidth: tokens.borderWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderThin,
  },
  ctaWrap: {
    display: 'flex',
    paddingTop: tokens.space2xl,
  },
  relatedWrap: {
    display: 'flex',
    paddingTop: tokens.space2xl,
  },
});
