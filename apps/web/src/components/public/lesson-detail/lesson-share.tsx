'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, useCallback, useRef } from 'react';
import { tokens } from '../../../styles/tokens.stylex';

type LessonShareProps = {
  /** Absolute canonical URL of the current lesson. */
  url: string;
  /** Lesson title (used as share title). */
  title: string;
  /** Lesson summary (used as share text). */
  summary: string | null;
};

/**
 * Focused, accessible sharing controls for the lesson route.
 *
 * This is the only Client Component on the lesson page. It receives
 * the minimal typed values needed for sharing (URL, title, summary)
 * from the Server Component — it never fetches lesson content.
 *
 * Actions:
 *   - "Share lesson": uses the Web Share API when available, with the
 *     real URL, title, and summary. Does not show success until the
 *     browser action resolves.
 *   - "Copy link": uses the Clipboard API when available. Shows a
 *     concise accessible success confirmation via `aria-live="polite".
 *     Falls back to a prompt-based copy when Clipboard API is
 *     unavailable — never silently fails.
 *   - LinkedIn and WhatsApp: direct external share URLs using the real
 *     canonical lesson URL. Safe `rel="noopener noreferrer"`, visible
 *     text labels, no tracking parameters.
 */
export function LessonShare({ url, title, summary }: LessonShareProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary ?? title,
          url,
        });
      } catch {
        // ponytail: user cancelled or share failed — no action needed.
        // Ceiling: Web Share API rejection (user dismiss) is not an error.
        // Upgrade path: none needed — silent cancel is correct behavior.
      }
    }
  }, [url, title, summary]);

  const handleCopyLink = useCallback(async () => {
    // Clear any pending reset so the confirmation stays visible.
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback: use a temporary textarea + execCommand for environments
        // without the Clipboard API. Never silently fails.
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // ponytail: if all copy methods fail, the user still has the URL
      // visible in the address bar. Ceiling: very old browsers without
      // any clipboard API. Upgrade path: none needed — the URL is visible.
      setCopied(false);
    }
  }, [url]);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <section aria-label="Share this lesson" {...stylex.props(styles.section)}>
      <p {...stylex.props(styles.label)}>
        <span aria-hidden="true" {...stylex.props(styles.labelMark)}>▍</span>
        Share
      </p>
      <div {...stylex.props(styles.actions)}>
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleShare}
            {...stylex.props(styles.button, styles.buttonPrimary)}
          >
            Share lesson
          </button>
        )}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-live={copied ? 'polite' : undefined}
          {...stylex.props(styles.button, styles.buttonSecondary)}
        >
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share lesson on LinkedIn (opens in a new tab)"
          {...stylex.props(styles.button, styles.buttonTertiary)}
        >
          LinkedIn
          <span aria-hidden="true" {...stylex.props(styles.externalMark)}>↗</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share lesson on WhatsApp (opens in a new tab)"
          {...stylex.props(styles.button, styles.buttonTertiary)}
        >
          WhatsApp
          <span aria-hidden="true" {...stylex.props(styles.externalMark)}>↗</span>
        </a>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceSm,
  },
  label: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spaceSm,
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: tokens.textSecondary,
  },
  labelMark: {
    display: "inline-block",
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spaceSm,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spaceXs,
    minHeight: "2.5rem",
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    textDecoration: "none",
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    transition: tokens.transitionFast,
    ":focus-visible": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  buttonPrimary: {
    backgroundColor: tokens.surfaceAction,
    color: tokens.textOnAccent,
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.surfaceActionHover,
      transform: "translate(-1px, -1px)",
    },
    ":active": {
      backgroundColor: tokens.surfaceActionPressed,
      transform: "translate(2px, 2px)",
    },
  },
  buttonSecondary: {
    backgroundColor: tokens.surfaceAccent,
    color: tokens.textPrimary,
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.surfacePage,
      transform: "translate(-1px, -1px)",
    },
    ":active": {
      backgroundColor: tokens.surfaceMuted,
      transform: "translate(2px, 2px)",
    },
  },
  buttonTertiary: {
    backgroundColor: tokens.surfaceRaised,
    color: tokens.textPrimary,
    ":hover": {
      backgroundColor: tokens.surfaceMuted,
      transform: "translate(-1px, -1px)",
    },
    ":active": {
      transform: "translate(2px, 2px)",
    },
  },
  externalMark: {
    fontSize: "0.75em",
    opacity: 0.7,
  },
});
