import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';

type LessonMediaProps = {
  /** Resolved absolute video thumbnail URL, or null. */
  thumbnailUrl: string | null;
  /** Alt text for the thumbnail, or null. */
  thumbnailAlt: string | null;
  /** Direct video URL (e.g. https://...mp4), or null. */
  videoUrl: string | null;
  /** Lesson title — used as a visible label inside the fallback visual. */
  title: string;
};

/**
 * Honest lesson media area.
 *
 * Renders one of the following, in priority order:
 *   1. A native HTML5 video element when a direct, browser-playable
 *      video URL exists (with controls, no autoplay, accessible label).
 *   2. The real Strapi video thumbnail as an image when no direct video
 *      URL exists but a thumbnail is available.
 *   3. A refined Pathway-built geometric fallback (decorative, hidden
 *      from assistive technology) when neither video nor thumbnail
 *      exists.
 *
 * No fake playback controls, no fake duration, no autoplay, no
 * third-party embedded player. External (non-direct) video URLs are
 * not embedded as a player — they would require a provider-specific
 * integration that is deferred to a later milestone.
 */
export function LessonMedia({
  thumbnailUrl,
  thumbnailAlt,
  videoUrl,
  title,
}: LessonMediaProps) {
  // Direct video URL — render a native video element with controls.
  if (videoUrl && isDirectVideoUrl(videoUrl)) {
    return (
      <div {...stylex.props(styles.media)}>
        <video
          src={videoUrl}
          controls
          preload="metadata"
          aria-label={`Video: ${title}`}
          {...stylex.props(styles.video)}
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  // Thumbnail image (with optional external video link).
  if (thumbnailUrl) {
    return (
      <div {...stylex.props(styles.media)}>
        {/* ponytail: next/image deferred until remote image optimization lands in a later M3 slice. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={thumbnailAlt ?? ""}
          {...stylex.props(styles.image)}
        />
      </div>
    );
  }

  // Decorative geometric fallback — hidden from assistive technology.
  return (
    <div aria-hidden="true" {...stylex.props(styles.fallback)}>
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

/**
 * Determine whether a URL is a direct, browser-playable video file.
 *
 * Only direct video file URLs (mp4, webm, ogg) are rendered as a native
 * <video> element. External platform URLs (YouTube, Vimeo, etc.) are
 * not embedded — they would require a provider-specific integration
 * and a privacy review that is deferred to a later milestone.
 */
function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

const styles = stylex.create({
  media: {
    display: "block",
    width: "100%",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceMuted,
  },
  video: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    backgroundColor: "#0F1F18",
  },
  image: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fallback: {
    display: "flex",
    width: "100%",
    aspectRatio: "16 / 9",
    backgroundColor: tokens.surfaceHeader,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    overflow: "hidden",
  },
  fallbackInner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    padding: tokens.spaceXl,
  },
  fallbackHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fallbackLabel: {
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textOnHeader,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  fallbackMark: {
    display: "inline-block",
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  fallbackMotif: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceSm,
    maxWidth: "60%",
  },
  fallbackBar: {
    display: "block",
    height: tokens.spaceSm,
    backgroundColor: tokens.textOnHeaderMuted,
  },
  fallbackBar1: { width: "100%" },
  fallbackBar2: { width: "75%" },
  fallbackBar3: { width: "50%" },
  fallbackTitle: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textOnHeader,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: "-0.02em",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
});
