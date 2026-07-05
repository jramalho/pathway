import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';
import type { PathDetailView } from '@/lib/path-data';
import { Breadcrumbs, type BreadcrumbItem } from '../breadcrumbs';
import { CoverMedia } from './cover-media';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining === 0 ? `${hours} hr` : `${hours} hr ${remaining} min`;
}

type PathHeroProps = {
  path: PathDetailView;
};

/**
 * Full learning-path hero section.
 *
 * Server-rendered. Uses real Strapi content for every visible field.
 * The hero carries the single page h1, breadcrumb navigation, an
 * optional real cover image (with a Pathway-built geometric fallback
 * when none is supplied), the full path description, real metadata,
 * and two CTAs:
 *   - "View curriculum" — an in-page anchor to #curriculum
 *   - "Explore all paths" — links to /paths
 *
 * No CTA implies an account, enrollment, completion tracking, or
 * playback. The hero uses the deep forest-green structural area with
 * warm off-white content surfaces, crisp dark borders, and hard
 * offset shadows — no gradients, glassmorphism, or fake metrics.
 */
export function PathHero({ path }: PathHeroProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Learning paths', href: '/paths' },
    { label: path.title },
  ];

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.field)}>
        <div {...stylex.props(styles.fieldInner)}>
          <div {...stylex.props(styles.breadcrumbs)}>
            <Breadcrumbs items={breadcrumbItems} tone="onHeader" />
          </div>

          <div {...stylex.props(styles.layout)}>
            <div {...stylex.props(styles.content)}>
              <p {...stylex.props(styles.eyebrow)}>
                <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
                Learning path
              </p>
              <h1 {...stylex.props(styles.title)}>{path.title}</h1>
              <p {...stylex.props(styles.description)}>{path.description}</p>

              <dl {...stylex.props(styles.meta)}>
                <div {...stylex.props(styles.metaItem)}>
                  <dt {...stylex.props(styles.metaLabel)}>Difficulty</dt>
                  <dd {...stylex.props(styles.metaValue)}>
                    {DIFFICULTY_LABELS[path.difficulty] ?? path.difficulty}
                  </dd>
                </div>
                <div {...stylex.props(styles.metaDivider)} aria-hidden="true" />
                <div {...stylex.props(styles.metaItem)}>
                  <dt {...stylex.props(styles.metaLabel)}>Duration</dt>
                  <dd {...stylex.props(styles.metaValue)}>
                    {formatDuration(path.estimatedDuration)}
                  </dd>
                </div>
                <div {...stylex.props(styles.metaDivider)} aria-hidden="true" />
                <div {...stylex.props(styles.metaItem)}>
                  <dt {...stylex.props(styles.metaLabel)}>Lessons</dt>
                  <dd {...stylex.props(styles.metaValue)}>
                    {path.lessonCount}{' '}
                    {path.lessonCount === 1 ? 'lesson' : 'lessons'}
                  </dd>
                </div>
                {path.category && (
                  <>
                    <div {...stylex.props(styles.metaDivider)} aria-hidden="true" />
                    <div {...stylex.props(styles.metaItem)}>
                      <dt {...stylex.props(styles.metaLabel)}>Topic</dt>
                      <dd {...stylex.props(styles.metaValue)}>
                        {path.category.name}
                      </dd>
                    </div>
                  </>
                )}
              </dl>

              <div {...stylex.props(styles.actions)}>
                <a href="#curriculum" {...stylex.props(styles.ctaPrimary)}>
                  View curriculum
                </a>
                <Link href="/paths" {...stylex.props(styles.ctaSecondary)}>
                  Explore all paths
                </Link>
              </div>
            </div>

            <div {...stylex.props(styles.media)}>
              <CoverMedia
                src={path.coverImageUrl}
                alt={path.coverImageAlt}
                title={path.title}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    display: 'flex',
    width: '100%',
    backgroundColor: tokens.surfaceHeader,
    borderBottomWidth: tokens.borderWidthStrong,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderStrong,
  },
  fieldInner: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: tokens.contentMaxWidth,
    marginInline: 'auto',
    paddingInline: tokens.contentPaddingInline,
    paddingBlock: {
      default: tokens.space2xl,
      '@media (min-width: 768px)': tokens.space3xl,
    },
    gap: tokens.spaceLg,
  },
  breadcrumbs: {
    // Breadcrumbs sit on the forest-green field — the Breadcrumbs
    // component's `onHeader` tone handles color inversion.
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
    '@media (min-width: 1024px)': {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: tokens.space2xl,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    padding: tokens.space2xl,
    backgroundColor: tokens.surfacePage,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    '@media (min-width: 1024px)': {
      flex: '1 1 58%',
      justifyContent: 'center',
    },
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
  title: {
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
  description: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeLg,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spaceLg,
    margin: 0,
    paddingTop: tokens.spaceLg,
    borderTopWidth: tokens.borderWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderThin,
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    margin: 0,
  },
  metaLabel: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  metaValue: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textPrimary,
  },
  metaDivider: {
    width: '1px',
    height: '1.5rem',
    backgroundColor: tokens.borderThin,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceMd,
    marginTop: tokens.spaceSm,
    '@media (min-width: 480px)': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '2.75rem',
    paddingBlock: tokens.spaceMd,
    paddingInline: tokens.spaceXl,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    backgroundColor: tokens.surfaceAction,
    color: tokens.textOnAccent,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfaceActionHover,
      transform: 'translate(-1px, -1px)',
    },
    ':active': {
      backgroundColor: tokens.surfaceActionPressed,
      transform: 'translate(2px, 2px)',
      boxShadow: tokens.shadowPressed,
    },
    ':focus': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '2.75rem',
    paddingBlock: tokens.spaceMd,
    paddingInline: tokens.spaceXl,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    backgroundColor: tokens.surfaceAccent,
    color: tokens.textPrimary,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfacePage,
      transform: 'translate(-1px, -1px)',
    },
    ':active': {
      backgroundColor: tokens.surfaceMuted,
      transform: 'translate(2px, 2px)',
      boxShadow: tokens.shadowPressed,
    },
    ':focus': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  media: {
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'flex',
      flex: '1 1 42%',
      maxWidth: '26rem',
    },
  },
});