/**
 * Runnable self-check for the lesson body Markdown parser.
 *
 * Uses Node's built-in `node:test` — no framework, no fixtures beyond
 * inline strings. Run with:
 *   node --experimental-strip-types --test apps/web/src/lib/lesson-body-parser.test.ts
 *
 * This is the smallest thing that fails if the parsing logic breaks.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  parseLessonBody,
  parseInline,
  toPlainText,
  slugifyHeading,
  extractTocEntries,
} from "./lesson-body-parser.ts";

test("parseLessonBody: empty string returns empty array", () => {
  assert.deepEqual(parseLessonBody(""), []);
  assert.deepEqual(parseLessonBody("   "), []);
});

test("parseLessonBody: parses headings, paragraphs, and lists", () => {
  const md = "## Why re-renders matter\n\nEvery re-render runs your component function.\n\n## Common triggers\n\n- Parent re-renders\n- New object literals";
  const blocks = parseLessonBody(md);
  assert.equal(blocks.length, 4);
  assert.equal(blocks[0].type, "heading");
  assert.equal(blocks[0].level, 2);
  assert.equal(blocks[0].text, "Why re-renders matter");
  assert.equal(blocks[1].type, "paragraph");
  assert.equal(blocks[2].type, "heading");
  assert.equal(blocks[3].type, "list");
  if (blocks[3].type === "list") {
    assert.equal(blocks[3].ordered, false);
    assert.equal(blocks[3].items.length, 2);
  }
});

test("parseLessonBody: heading anchor IDs are deterministic and deduplicated", () => {
  const md = "## Same Heading\n\nText.\n\n## Same Heading\n\nMore text.";
  const blocks = parseLessonBody(md);
  assert.equal(blocks[0].type, "heading");
  assert.equal(blocks[2].type, "heading");
  if (blocks[0].type === "heading" && blocks[2].type === "heading") {
    assert.equal(blocks[0].anchorId, "same-heading");
    assert.equal(blocks[2].anchorId, "same-heading-2");
  }
});

test("parseLessonBody: parses ordered lists", () => {
  const md = "1. First step\n2. Second step\n3. Third step";
  const blocks = parseLessonBody(md);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, "list");
  if (blocks[0].type === "list") {
    assert.equal(blocks[0].ordered, true);
    assert.equal(blocks[0].items.length, 3);
  }
});

test("parseLessonBody: parses block quotes", () => {
  const md = "> This is a quote.";
  const blocks = parseLessonBody(md);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, "quote");
});

test("parseLessonBody: parses fenced code blocks with language", () => {
  const md = "```ts\nconst x = 1;\nconst y = 2;\n```";
  const blocks = parseLessonBody(md);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, "code");
  if (blocks[0].type === "code") {
    assert.equal(blocks[0].language, "ts");
    assert.equal(blocks[0].text, "const x = 1;\nconst y = 2;");
  }
});

test("parseLessonBody: parses fenced code blocks without language", () => {
  const md = "```\nplain code\n```";
  const blocks = parseLessonBody(md);
  assert.equal(blocks.length, 1);
  if (blocks[0].type === "code") {
    assert.equal(blocks[0].language, null);
    assert.equal(blocks[0].text, "plain code");
  }
});

test("parseInline: bold, italic, code, and link", () => {
  const nodes = parseInline("This is **bold** and *italic* and `code` and [a link](https://example.com).");
  assert.ok(nodes.length >= 4);
  const bold = nodes.find((n) => n.type === "bold");
  assert.ok(bold, "should find bold node");
  const italic = nodes.find((n) => n.type === "italic");
  assert.ok(italic, "should find italic node");
  const code = nodes.find((n) => n.type === "code");
  assert.ok(code, "should find code node");
  const link = nodes.find((n) => n.type === "link");
  assert.ok(link, "should find link node");
  if (link.type === "link") {
    assert.equal(link.url, "https://example.com");
  }
});

test("parseInline: treats raw HTML as plain text", () => {
  const nodes = parseInline("<script>alert(1)</script>");
  const text = toPlainText(nodes);
  assert.equal(text, "<script>alert(1)</script>");
});

test("toPlainText: extracts plain text from inline nodes", () => {
  const nodes = parseInline("Hello **world** and `code`");
  assert.equal(toPlainText(nodes), "Hello world and code");
});

test("slugifyHeading: produces URL-safe slugs", () => {
  const used = new Set<string>();
  assert.equal(slugifyHeading("Why Re-renders Matter", used), "why-re-renders-matter");
  assert.equal(slugifyHeading("Common Triggers!", used), "common-triggers");
  assert.equal(slugifyHeading("What to do?", used), "what-to-do");
});

test("slugifyHeading: deduplicates with numeric suffix", () => {
  const used = new Set<string>();
  assert.equal(slugifyHeading("Heading", used), "heading");
  assert.equal(slugifyHeading("Heading", used), "heading-2");
  assert.equal(slugifyHeading("Heading", used), "heading-3");
});

test("extractTocEntries: returns only headings with anchor IDs", () => {
  const md = "## First\n\nText.\n\n## Second\n\nMore text.\n\nParagraph.";
  const blocks = parseLessonBody(md);
  const entries = extractTocEntries(blocks);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].text, "First");
  assert.equal(entries[0].anchorId, "first");
  assert.equal(entries[1].text, "Second");
  assert.equal(entries[1].anchorId, "second");
});

test("parseLessonBody: handles multi-line paragraphs", () => {
  const md = "Line one.\nLine two.\nLine three.\n\nNew paragraph.";
  const blocks = parseLessonBody(md);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].type, "paragraph");
  assert.equal(blocks[1].type, "paragraph");
  if (blocks[0].type === "paragraph") {
    const text = toPlainText(blocks[0].children);
    assert.equal(text, "Line one. Line two. Line three.");
  }
});
