import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../styles/tokens.stylex';
import type { HomepageData } from '@/lib/homepage-data';

type HomeHeroProps = {
  /**
   * Homepage view data. When `null`, the hero renders without the live
   * content-count badge and topic route — the visual composition and CTAs
   * stay fully usable. This keeps the hero resilient when the CMS is
   * unavailable or has no published content.
   */
  data: HomepageData | null;
};

/**
 * Homepage hero section.
 *
 * A server-rendered, neo-brutalist hero with a distinctive "learning route"
 * visual composition: a connected pathway of modular steps built entirely
 * with CSS (no imagery, gradients, or glassmorphism). The composition uses
 * real core topic labels from the homepage data when available, falling
 * back to a static editorial pathway motif otherwise.
 *
 * Accessibility:
 *   - One `h1` carries the headline.
 *   - The visual pathway is `aria-hidden` (decorative).
 *   - CTA links have visible hover, focus, and pressed states.
 *   - Touch targets meet the 44px mobile minimum.
 */
export function HomeHero({ data }: HomeHeroProps) {
  const hasContent = data !== null && data.counts.featuredPaths > 0;
  // Use up to 4 real topic labels from featured paths for the pathway steps.
  const routeSteps = hasContent
    ? data!.featuredPaths.slice(0, 4).map((path) => path.title)
    : ['Fundamentals', 'Patterns', 'Performance', 'Shipping'];

  return (
    <section {...stylex.props(styles.section)}>
      {/* Forest-green hero field */}
      <div {...stylex.props(styles.field)}>
        <div {...stylex.props(styles.fieldInner)}>
          {/* Warm off-white content panel */}
          <div {...stylex.props(styles.content)}>
            <p {...stylex.props(styles.eyebrow)}>
              <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
              Practical technical learning
            </p>
            <h1 {...stylex.props(styles.headline)}>
              Build sharper product and engineering skills.
            </h1>
            <p {...stylex.props(styles.supporting)}>
              Short, structured learning paths for mobile engineers, product
              builders, and modern technical teams.
            </p>
            <div {...stylex.props(styles.actions)}>
              <Link
                href="/paths"
                {...stylex.props(styles.ctaPrimary)}
              >
                Explore learning paths
              </Link>
              <Link
                href="/explore"
                {...stylex.props(styles.ctaSecondary)}
              >
                Browse lessons
              </Link>
            </div>
            {hasContent && (
              <dl {...stylex.props(styles.stats)}>
                <div {...stylex.props(styles.stat)}>
                  <dt {...stylex.props(styles.statLabel)}>Learning paths</dt>
                  <dd {...stylex.props(styles.statValue)}>
                    {data!.counts.featuredPaths}
                  </dd>
                </div>
                <div {...stylex.props(styles.statDivider)} aria-hidden="true" />
                <div {...stylex.props(styles.stat)}>
                  <dt {...stylex.props(styles.statLabel)}>Guided lessons</dt>
                  <dd {...stylex.props(styles.statValue)}>
                    {data!.counts.lessonsInFeaturedPaths}
                  </dd>
                </div>
              </dl>
            )}
          </div>

          {/* Decorative learning-route composition */}
          <div
            aria-hidden="true"
            {...stylex.props(styles.route)}
          >
            <div {...stylex.props(styles.routePanel)}>
              <div {...stylex.props(styles.routeHeader)}>
                <span {...stylex.props(styles.routeLabel)}>Learning route</span>
                <span {...stylex.props(styles.routeProgress)}>01 → 04</span>
              </div>
              <ol {...stylex.props(styles.routeList)}>
                {routeSteps.map((label, index) => (
                  <li
                    key={label}
                    {...stylex.props(styles.routeStep)}
                  >
                    <span {...stylex.props(styles.routeStepNumber)}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span {...stylex.props(styles.routeStepLabel)}>{label}</span>
                    {index < routeSteps.length - 1 && (
                      <span {...stylex.props(styles.routeStepConnector)} />
                    )}
                  </li>
                ))}
              </ol>
              <div {...stylex.props(styles.routeFooter)}>
                <span {...stylex.props(styles.routeFooterDot)} />
                <span {...stylex.props(styles.routeFooterText)}>
                  Structured · Self-paced
                </span>
              </div>
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
      default: tokens.space3xl,
      '@media (min-width: 768px)': tokens.space4xl,
    },
    gap: tokens.space2xl,
    '@media (min-width: 1024px)': {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: tokens.space3xl,
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
      flex: '1 1 60%',
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
  headline: {
    margin: 0,
    maxWidth: '20ch',
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
    maxWidth: '36rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeLg,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
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
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spaceLg,
    margin: 0,
    marginTop: tokens.spaceLg,
    paddingTop: tokens.spaceLg,
    borderTopWidth: tokens.borderWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderThin,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    margin: 0,
  },
  statLabel: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.textSecondary,
  },
  statValue: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeXl,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: 1,
    color: tokens.textPrimary,
  },
  statDivider: {
    width: '1px',
    height: '2rem',
    backgroundColor: tokens.borderThin,
  },
  // ── Decorative learning-route composition ──────────────────
  route: {
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'flex',
      flex: '1 1 40%',
      maxWidth: '28rem',
    },
  },
  routePanel: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: tokens.spaceXl,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  routeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: tokens.spaceMd,
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderThin,
  },
  routeLabel: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  routeProgress: {
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textPrimary,
  },
  routeList: {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    paddingTop: tokens.spaceLg,
  },
  routeStep: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spaceMd,
    position: 'relative',
    paddingBottom: tokens.spaceLg,
  },
  routeStepNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    flexShrink: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textOnAccent,
    backgroundColor: tokens.surfaceHeader,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
  },
  routeStepLabel: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.textPrimary,
    lineHeight: tokens.lineHeightNormal,
  },
  routeStepConnector: {
    position: 'absolute',
    left: '1rem',
    top: '2rem',
    width: tokens.borderWidthStrong,
    height: tokens.spaceLg,
    backgroundColor: tokens.borderStrong,
    transform: 'translateX(-50%)',
  },
  routeFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spaceSm,
    marginTop: tokens.spaceSm,
    paddingTop: tokens.spaceMd,
    borderTopWidth: tokens.borderWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderThin,
  },
  routeFooterDot: {
    display: 'inline-block',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: tokens.accentActive,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
  },
  routeFooterText: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.textSecondary,
  },
});