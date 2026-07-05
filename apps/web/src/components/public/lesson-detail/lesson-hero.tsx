import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';
import type { LessonDetailView } from '@/lib/lesson-data';
import { Breadcrumbs, type BreadcrumbItem } from '../breadcrumbs';

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

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type LessonHeroProps = {
  lesson: LessonDetailView;
};

/**
 * Lesson hero section for `/lessons/[slug]`.
 *
 * Server-rendered. Uses real Strapi content for every visible field.
 * The hero carries the single page h1, breadcrumb navigation
 * (Home → Learning paths → parent path → current lesson), the lesson
 * summary, real metadata (duration, difficulty, author, published
 * date), and a link back to the parent learning path when the
 * relationship exists.
 *
 * No CTA implies an account, enrollment, completion tracking, or
 * playback. The hero uses the deep forest-green structural area with
 * warm off-white content surfaces, crisp dark borders, and hard
 * offset shadows — no gradients, glassmorphism, or fake metrics.
 */
export function LessonHero({ lesson }: LessonHeroProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Learning paths', href: '/paths' },
    ...(lesson.learningPath
      ? [
          {
            label: lesson.learningPath.title,
            href: `/paths/${lesson.learningPath.slug}`,
          },
        ]
      : []),
    { label: lesson.title },
  ];

  const publishedDate = formatDate(lesson.publishedAt);

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.field)}>
        <div {...stylex.props(styles.fieldInner)}>
          <div {...stylex.props(styles.breadcrumbs)}>
            <Breadcrumbs items={breadcrumbItems} tone="onHeader" />
          </div>

          <div {...stylex.props(styles.content)}>
            <p {...stylex.props(styles.eyebrow)}>
              <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
              Lesson
            </p>
            <h1 {...stylex.props(styles.title)}>{lesson.title}</h1>
            {lesson.summary && (
              <p {...stylex.props(styles.summary)}>{lesson.summary}</p>
            )}

            <dl {...stylex.props(styles.meta)}>
              <div {...stylex.props(styles.metaItem)}>
                <dt {...stylex.props(styles.metaLabel)}>Duration</dt>
                <dd {...stylex.props(styles.metaValue)}>
                  {formatDuration(lesson.estimatedDuration)}
                </dd>
              </div>
              <div {...stylex.props(styles.metaDivider)} aria-hidden="true" />
              <div {...stylex.props(styles.metaItem)}>
                <dt {...stylex.props(styles.metaLabel)}>Difficulty</dt>
                <dd {...stylex.props(styles.metaValue)}>
                  {DIFFICULTY_LABELS[lesson.difficulty] ?? lesson.difficulty}
                </dd>
              </div>
              {lesson.category && (
                <>
                  <div {...stylex.props(styles.metaDivider)} aria-hidden="true" />
                  <div {...stylex.props(styles.metaItem)}>
                    <dt {...stylex.props(styles.metaLabel)}>Topic</dt>
                    <dd {...stylex.props(styles.metaValue)}>
                      {lesson.category.name}
                    </dd>
                  </div>
                </>
              )}
              {publishedDate && (
                <>
                  <div {...stylex.props(styles.metaDivider)} aria-hidden="true" />
                  <div {...stylex.props(styles.metaItem)}>
                    <dt {...stylex.props(styles.metaLabel)}>Published</dt>
                    <dd {...stylex.props(styles.metaValue)}>
                      <time dateTime={lesson.publishedAt ?? undefined}>
                        {publishedDate}
                      </time>
                    </dd>
                  </div>
                </>
              )}
            </dl>

            {lesson.author && (
              <div {...stylex.props(styles.author)}>
                {lesson.author.avatarUrl && (
                  // ponytail: next/image deferred until remote image optimization lands.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lesson.author.avatarUrl}
                    alt={lesson.author.avatarAlt ?? `Avatar of ${lesson.author.name}`}
                    {...stylex.props(styles.authorAvatar)}
                  />
                )}
                <div {...stylex.props(styles.authorBody)}>
                  <p {...stylex.props(styles.authorName)}>
                    {lesson.author.name}
                  </p>
                  {lesson.author.shortBio && (
                    <p {...stylex.props(styles.authorBio)}>
                      {lesson.author.shortBio}
                    </p>
                  )}
                </div>
              </div>
            )}

            {lesson.learningPath && (
              <Link
                href={`/paths/${lesson.learningPath.slug}`}
                {...stylex.props(styles.pathLink)}
              >
                <span aria-hidden="true" {...stylex.props(styles.pathLinkMark)}>←</span>
                <span>{lesson.learningPath.title}</span>
              </Link>
            )}
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
  breadcrumbs: {},
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
    maxWidth: '28ch',
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
  summary: {
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
  author: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spaceMd,
    paddingTop: tokens.spaceLg,
    borderTopWidth: tokens.borderWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderThin,
  },
  authorAvatar: {
    display: 'block',
    width: '3rem',
    height: '3rem',
    flexShrink: 0,
    objectFit: 'cover',
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceMuted,
  },
  authorBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    minWidth: 0,
  },
  authorName: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textPrimary,
  },
  authorBio: {
    margin: 0,
    maxWidth: '38rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  pathLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceSm,
    alignSelf: 'flex-start',
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
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
  pathLinkMark: {
    display: 'inline-block',
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
});
