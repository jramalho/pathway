import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { tokens } from '../../../styles/tokens.stylex';
import type {
  InlineNode,
  LessonBodyBlock,
} from '@/lib/lesson-body-parser';

type LessonBodyRendererProps = {
  blocks: LessonBodyBlock[];
};

/**
 * Safe, structured lesson-body renderer.
 *
 * Renders a typed block tree (parsed from the Markdown body string by
 * `parseLessonBody`) as semantic HTML. No `dangerouslySetInnerHTML`,
 * no raw HTML injection — every block and inline node is rendered
 * through typed React elements with StyleX styles.
 *
 * The renderer preserves readable line length, editorial spacing,
 * and accessible heading hierarchy. Code blocks scroll horizontally
 * inside their own bounded region so long lines never cause
 * page-level overflow.
 */
export function LessonBodyRenderer({ blocks }: LessonBodyRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <article {...stylex.props(styles.article)}>
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </article>
  );
}

function BlockRenderer({ block }: { block: LessonBodyBlock }) {
  switch (block.type) {
    case "heading":
      return <HeadingRenderer block={block} />;
    case "paragraph":
      return (
        <p {...stylex.props(styles.paragraph)}>
          <InlineRenderer nodes={block.children} />
        </p>
      );
    case "list":
      return <ListRenderer block={block} />;
    case "quote":
      return (
        <blockquote {...stylex.props(styles.quote)}>
          <InlineRenderer nodes={block.children} />
        </blockquote>
      );
    case "code":
      return (
        <div {...stylex.props(styles.codeWrap)}>
          {block.language && (
            <span aria-hidden="true" {...stylex.props(styles.codeLang)}>
              {block.language}
            </span>
          )}
          <pre {...stylex.props(styles.codePre)}>
            <code {...stylex.props(styles.codeText)}>{block.text}</code>
          </pre>
        </div>
      );
  }
}

function HeadingRenderer({ block }: { block: Extract<LessonBodyBlock, { type: "heading" }> }) {
  const content = <InlineRenderer nodes={block.children} />;
  const anchorStyle = stylex.props(styles.headingAnchor);

  switch (block.level) {
    case 1:
      return (
        <h2 id={block.anchorId} {...stylex.props(styles.heading, styles.h2)}>
          {content}
          <a href={`#${block.anchorId}`} aria-label={`Permalink to ${block.text}`} {...anchorStyle}>
            <span aria-hidden="true">#</span>
          </a>
        </h2>
      );
    case 2:
      return (
        <h2 id={block.anchorId} {...stylex.props(styles.heading, styles.h2)}>
          {content}
          <a href={`#${block.anchorId}`} aria-label={`Permalink to ${block.text}`} {...anchorStyle}>
            <span aria-hidden="true">#</span>
          </a>
        </h2>
      );
    case 3:
      return (
        <h3 id={block.anchorId} {...stylex.props(styles.heading, styles.h3)}>
          {content}
          <a href={`#${block.anchorId}`} aria-label={`Permalink to ${block.text}`} {...anchorStyle}>
            <span aria-hidden="true">#</span>
          </a>
        </h3>
      );
    default:
      return (
        <h4 id={block.anchorId} {...stylex.props(styles.heading, styles.h4)}>
          {content}
          <a href={`#${block.anchorId}`} aria-label={`Permalink to ${block.text}`} {...anchorStyle}>
            <span aria-hidden="true">#</span>
          </a>
        </h4>
      );
  }
}

function ListRenderer({ block }: { block: Extract<LessonBodyBlock, { type: "list" }> }) {
  const Tag = block.ordered ? "ol" : "ul";
  return (
    <Tag {...stylex.props(styles.list)}>
      {block.items.map((item, index) => (
        <li key={index} {...stylex.props(styles.listItem)}>
          <InlineRenderer nodes={item} />
        </li>
      ))}
    </Tag>
  );
}

function InlineRenderer({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        switch (node.type) {
          case "text":
            return <span key={index}>{node.text}</span>;
          case "bold":
            return (
              <strong key={index}>
                <InlineRenderer nodes={node.children} />
              </strong>
            );
          case "italic":
            return (
              <em key={index}>
                <InlineRenderer nodes={node.children} />
              </em>
            );
          case "code":
            return (
              <code key={index} {...stylex.props(styles.inlineCode)}>
                {node.text}
              </code>
            );
          case "link": {
            const isExternal = /^https?:\/\//i.test(node.url);
            return (
              <Link
                key={index}
                href={node.url}
                {...stylex.props(styles.link)}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <InlineRenderer nodes={node.children} />
                {isExternal && (
                  <span aria-hidden="true" {...stylex.props(styles.linkExternal)}>↗</span>
                )}
              </Link>
            );
          }
        }
      })}
    </>
  );
}

const styles = stylex.create({
  article: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceXl,
    maxWidth: "44rem",
  },
  heading: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: "-0.02em",
    color: tokens.textPrimary,
    scrollMarginTop: "5rem",
    display: "flex",
    alignItems: "baseline",
    gap: tokens.spaceSm,
  },
  h2: {
    fontSize: {
      default: tokens.fontSizeXl,
      "@media (min-width: 768px)": tokens.fontSize2xl,
    },
    marginTop: tokens.spaceXl,
  },
  h3: {
    fontSize: tokens.fontSizeLg,
    marginTop: tokens.spaceLg,
  },
  h4: {
    fontSize: tokens.fontSizeMd,
    marginTop: tokens.spaceLg,
  },
  headingAnchor: {
    textDecoration: "none",
    color: tokens.textSecondary,
    opacity: 0,
    transition: tokens.transitionFast,
    fontSize: tokens.fontSizeSm,
    ":focus-visible": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  paragraph: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textPrimary,
  },
  list: {
    margin: 0,
    paddingLeft: tokens.spaceXl,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spaceSm,
  },
  listItem: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textPrimary,
    paddingLeft: tokens.spaceSm,
  },
  quote: {
    margin: 0,
    paddingBlock: tokens.spaceLg,
    paddingInline: tokens.spaceXl,
    backgroundColor: tokens.surfaceAccent,
    borderLeftWidth: tokens.borderWidthStrong,
    borderLeftStyle: "solid",
    borderLeftColor: tokens.borderStrong,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textPrimary,
    fontStyle: "italic",
  },
  codeWrap: {
    display: "flex",
    flexDirection: "column",
    borderWidth: tokens.borderWidthStrong,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    backgroundColor: "#0F1F18",
    overflow: "hidden",
  },
  codeLang: {
    display: "block",
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceMd,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#C9D6CF",
    backgroundColor: "#14503B",
    borderBottomWidth: tokens.borderWidthThin,
    borderBottomStyle: "solid",
    borderBottomColor: "#000000",
  },
  codePre: {
    margin: 0,
    padding: tokens.spaceLg,
    overflowX: "auto",
    // ponytail: horizontal scroll inside the code block only.
    // Ceiling: very long single lines scroll horizontally within the block.
    // Upgrade path: none needed — this is the correct behavior for code.
  },
  codeText: {
    margin: 0,
    fontFamily: "monospace",
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightNormal,
    color: "#E9E8E4",
    whiteSpace: "pre",
  },
  inlineCode: {
    fontFamily: "monospace",
    fontSize: "0.85em",
    backgroundColor: tokens.surfaceMuted,
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceSm,
    borderWidth: tokens.borderWidthThin,
    borderStyle: "solid",
    borderColor: tokens.borderThin,
  },
  link: {
    color: tokens.textPrimary,
    textDecoration: "underline",
    textDecorationColor: tokens.accentActive,
    textDecorationThickness: "2px",
    textUnderlineOffset: "2px",
    fontWeight: tokens.fontWeightSemibold,
    display: "inline-flex",
    alignItems: "baseline",
    gap: tokens.spaceXs,
    ":focus-visible": {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: "solid",
      outlineColor: tokens.accentFocus,
      outlineOffset: tokens.spaceXs,
    },
  },
  linkExternal: {
    fontSize: "0.75em",
    opacity: 0.7,
  },
});
