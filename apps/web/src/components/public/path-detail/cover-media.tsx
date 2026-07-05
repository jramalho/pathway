import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';

type CoverMediaProps = {
  /** Absolute cover image URL, or null when no image is supplied. */
  src: string | null;
  /** Alt text from Strapi, or null. */
  alt: string | null;
  /** Path title — used as a visible label inside the fallback visual. */
  title: string;
};

/**
 * Cover media for a learning-path hero.
 *
 * Renders the real Strapi cover image when available. When no image is
 * supplied, renders a Pathway-built geometric fallback (no imagery,
 * gradients, or glassmorphism) that communicates the path title and
 * a structured-learning motif. The fallback is decorative — the title
 * is already present as the page h1 — so it is hidden from assistive
 * technology.
 */
export function CoverMedia({ src, alt, title }: CoverMediaProps) {
  if (src) {
    return (
      <div {...stylex.props(styles.media)}>
        {/* ponytail: next/image deferred until remote image optimization lands in a later M3 slice. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ''}
          {...stylex.props(styles.image)}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      {...stylex.props(styles.fallback)}
    >
      <div {...stylex.props(styles.fallbackInner)}>
        <div {...stylex.props(styles.fallbackHeader)}>
          <span {...stylex.props(styles.fallbackLabel)}>Pathway</span>
          <span {...stylex.props(styles.fallbackMark)}>▍</span>
        </div>
        <div {...stylex.props(styles.fallbackMotif)}>
          <span {...stylex.props(styles.fallbackBar, styles.fallbackBar1)} />
          <span {...stylex.props(styles.fallbackBar, styles.fallbackBar2)} />
          <span {...stylex.props(styles.fallbackBar, styles.fallbackBar3)} />
        </div>
        <p {...stylex.props(styles.fallbackTitle)}>{title}</p>
      </div>
    </div>
  );
}

const styles = stylex.create({
  media: {
    display: 'block',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceMuted,
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  fallback: {
    display: 'flex',
    width: '100%',
    aspectRatio: '16 / 9',
    backgroundColor: tokens.surfaceHeader,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    overflow: 'hidden',
  },
  fallbackInner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    padding: tokens.spaceXl,
  },
  fallbackHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fallbackLabel: {
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textOnHeader,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  fallbackMark: {
    display: 'inline-block',
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  fallbackMotif: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    maxWidth: '60%',
  },
  fallbackBar: {
    display: 'block',
    height: tokens.spaceSm,
    backgroundColor: tokens.textOnHeaderMuted,
  },
  fallbackBar1: { width: '100%' },
  fallbackBar2: { width: '75%' },
  fallbackBar3: { width: '50%' },
  fallbackTitle: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textOnHeader,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.02em',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
});