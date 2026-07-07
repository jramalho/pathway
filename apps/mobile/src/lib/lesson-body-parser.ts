/**
 * Typed Markdown parser for the Pathway lesson body (mobile).
 *
 * Mirrors the web parser in apps/web/src/lib/lesson-body-parser.ts.
 * The Strapi `body` field is a richtext field configured with the
 * default Markdown editor — Strapi returns it as a plain Markdown
 * string. This parser converts that string into a typed block tree
 * so the mobile renderer can produce semantic React Native views
 * without injecting raw HTML.
 *
 * Supported Markdown subset (matches the actual seed content):
 *   - ATX headings: `## Heading` (level 1–4)
 *   - Paragraphs (separated by blank lines)
 *   - Unordered lists: `- item` or `* item`
 *   - Ordered lists: `1. item`
 *   - Block quotes: `> quote`
 *   - Fenced code blocks: ``` ``` (with optional language)
 *   - Inline emphasis: **bold**, *italic*, `code`, [link](url)
 *
 * Not supported (intentionally — not in the content model):
 *   - Raw HTML (never injected — treated as plain text)
 *   - Tables, footnotes, images, nested blockquotes
 */

/** Inline content within a paragraph, heading, list item, or quote. */
export type InlineNode =
  | { type: "text"; text: string }
  | { type: "bold"; children: InlineNode[] }
  | { type: "italic"; children: InlineNode[] }
  | { type: "code"; text: string }
  | { type: "link"; url: string; children: InlineNode[] };

/** A heading block. Level is 1–4. */
export interface HeadingBlock {
  type: "heading";
  level: number;
  children: InlineNode[];
  text: string;
}

/** A paragraph block. */
export interface ParagraphBlock {
  type: "paragraph";
  children: InlineNode[];
}

/** A list block (ordered or unordered). */
export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: InlineNode[][];
}

/** A block quote. */
export interface QuoteBlock {
  type: "quote";
  children: InlineNode[];
}

/** A fenced code block. */
export interface CodeBlock {
  type: "code";
  language: string | null;
  text: string;
}

/** A parsed lesson body block. */
export type LessonBodyBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | QuoteBlock
  | CodeBlock;

/** Parse a Markdown string into a typed block tree. */
export function parseLessonBody(markdown: string): LessonBodyBlock[] {
  if (!markdown || !markdown.trim()) return [];
  const lines = markdown.split("\n");
  const blocks: LessonBodyBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines between blocks.
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block: ``` or ~~~
    const fenceMatch = line.match(/^(`{3,}|~{3,})\s*(.*)$/);
    if (fenceMatch) {
      const fence = fenceMatch[1][0];
      const language = fenceMatch[2].trim() || null;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(fence.repeat(3))) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({ type: "code", language, text: codeLines.join("\n") });
      continue;
    }

    // ATX heading: # Heading, ## Heading, etc.
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawText = headingMatch[2].trim();
      const inline = parseInline(rawText);
      blocks.push({ type: "heading", level, children: inline, text: toPlainText(inline) });
      i++;
      continue;
    }

    // Block quote: > text
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", children: parseInline(quoteLines.join(" ")) });
      continue;
    }

    // Unordered list: - item or * item
    if (line.match(/^\s*[-*]\s+/)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s+/)) {
        items.push(parseInline(lines[i].replace(/^\s*[-*]\s+/, "")));
        i++;
      }
      blocks.push({ type: "list", ordered: false, items });
      continue;
    }

    // Ordered list: 1. item
    if (line.match(/^\s*\d+\.\s+/)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
        items.push(parseInline(lines[i].replace(/^\s*\d+\.\s+/, "")));
        i++;
      }
      blocks.push({ type: "list", ordered: true, items });
      continue;
    }

    // Paragraph: collect consecutive non-blank, non-block-start lines.
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^(#{1,4})\s+/) &&
      !lines[i].startsWith(">") &&
      !lines[i].match(/^\s*[-*]\s+/) &&
      !lines[i].match(/^\s*\d+\.\s+/) &&
      !lines[i].match(/^(`{3,}|~{3,})/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", children: parseInline(paraLines.join(" ")) });
    }
  }

  return blocks;
}

/**
 * Parse inline Markdown into typed inline nodes.
 * Supports: **bold**, *italic*, `code`, [link](url).
 * Raw HTML is treated as plain text (never injected).
 */
export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      nodes.push({ type: "code", text: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      nodes.push({ type: "bold", children: parseInline(boldMatch[1]) });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      nodes.push({ type: "italic", children: parseInline(italicMatch[1]) });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      nodes.push({ type: "link", url: linkMatch[2], children: parseInline(linkMatch[1]) });
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/[`*\[]/);
    if (nextSpecial === -1) {
      nodes.push({ type: "text", text: remaining });
      break;
    }
    if (nextSpecial === 0) {
      nodes.push({ type: "text", text: remaining[0] });
      remaining = remaining.slice(1);
      continue;
    }
    nodes.push({ type: "text", text: remaining.slice(0, nextSpecial) });
    remaining = remaining.slice(nextSpecial);
  }

  return nodes;
}

/** Convert inline nodes to plain text. */
export function toPlainText(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
          return node.text;
        case "code":
          return node.text;
        case "bold":
        case "italic":
        case "link":
          return toPlainText(node.children);
      }
    })
    .join("");
}
