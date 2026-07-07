import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { LessonBody } from "@pathway/api";

import {
  parseLessonBody,
  toPlainText,
  type InlineNode,
  type LessonBodyBlock,
} from "@/lib/lesson-body-parser";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LessonBodyRendererProps = {
  /** Lesson body as Markdown (Strapi richtext default editor). */
  body: LessonBody;
};

/**
 * Safe, structured lesson-body renderer for mobile.
 *
 * Parses the Markdown body string into a typed block tree (via
 * parseLessonBody) and renders each block as semantic React Native
 * views with the neo-brutalist editorial style. No raw HTML injection.
 *
 * Reading comfort: comfortable line height, adequate spacing between
 * blocks, headings with clear hierarchy, code blocks in a dark surface
 * with horizontal scroll, block quotes in mint with a strong left border.
 */
export function LessonBodyRenderer({ body }: LessonBodyRendererProps) {
  const blocks = useMemo(() => parseLessonBody(body), [body]);

  if (!blocks || blocks.length === 0) return null;

  return (
    <View style={styles.article} accessibilityRole="summary">
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </View>
  );
}

function BlockView({ block }: { block: LessonBodyBlock }) {
  switch (block.type) {
    case "heading":
      return <HeadingView block={block} />;
    case "paragraph":
      return (
        <Text style={styles.paragraph}>
          <InlineView nodes={block.children} />
        </Text>
      );
    case "list":
      return <ListView block={block} />;
    case "quote":
      return (
        <View style={styles.quote}>
          <Text style={styles.quoteText}>
            <InlineView nodes={block.children} />
          </Text>
        </View>
      );
    case "code":
      return <CodeView block={block} />;
  }
}

function HeadingView({ block }: { block: Extract<LessonBodyBlock, { type: "heading" }> }) {
  const style = block.level <= 2 ? styles.h2 : block.level === 3 ? styles.h3 : styles.h4;
  return (
    <Text style={style} accessibilityRole="header">
      <InlineView nodes={block.children} />
    </Text>
  );
}

function ListView({ block }: { block: Extract<LessonBodyBlock, { type: "list" }> }) {
  return (
    <View style={styles.list}>
      {block.items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listBullet}>{block.ordered ? `${index + 1}.` : "•"}</Text>
          <Text style={styles.listText}>
            <InlineView nodes={item} />
          </Text>
        </View>
      ))}
    </View>
  );
}

function CodeView({ block }: { block: Extract<LessonBodyBlock, { type: "code" }> }) {
  return (
    <View style={styles.codeWrap}>
      {block.language && (
        <Text style={styles.codeLang}>{block.language}</Text>
      )}
      <Text style={styles.codeText}>{block.text}</Text>
    </View>
  );
}

/**
 * Renders inline nodes as nested Text spans. Links are pressable and
 * navigate via expo-router (external links open in the app's in-app
 * browser via expo-web-browser when wired; for now they navigate
 * within the router which handles http(s) URLs on web, and is a no-op
 * visual affordance on native — the URL is exposed to assistive tech).
 */
function InlineView({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        switch (node.type) {
          case "text":
            return <Text key={index}>{node.text}</Text>;
          case "bold":
            return (
              <Text key={index} style={styles.bold}>
                <InlineView nodes={node.children} />
              </Text>
            );
          case "italic":
            return (
              <Text key={index} style={styles.italic}>
                <InlineView nodes={node.children} />
              </Text>
            );
          case "code":
            return <Text key={index} style={styles.inlineCode}>{node.text}</Text>;
          case "link":
            return <LinkView key={index} node={node} />;
        }
      })}
    </>
  );
}

function LinkView({ node }: { node: Extract<InlineNode, { type: "link" }> }) {
  const label = toPlainText([node]);
  // ponytail: external URLs are not opened in an in-app browser yet.
  // Ceiling: on native, http(s) links render as styled text but do not
  // navigate — Expo Router typed routes reject external URLs.
  // Upgrade path: wire expo-web-browser openBrowserAsync for external URLs.
  const handlePress = () => {
    // No-op until expo-web-browser is wired; the URL is exposed to
    // assistive tech via accessibilityLabel so it remains discoverable.
  };

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label} — ${node.url}`}
      onPress={handlePress}
      style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
    >
      <Text style={styles.linkText}>
        <InlineView nodes={node.children} />
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  article: {
    gap: Spacing.four,
  },
  h2: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeXl,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 30,
    letterSpacing: -0.3,
    color: tokens.color.text,
    marginTop: Spacing.two,
  },
  h3: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeLg,
    fontWeight: String(Typography.headingWeightBlack) as "800",
    lineHeight: 26,
    color: tokens.color.text,
    marginTop: Spacing.two,
  },
  h4: {
    fontFamily: Typography.headingFamily,
    fontSize: Typography.fontSizeMd,
    fontWeight: String(Typography.headingWeightBold) as "700",
    lineHeight: 22,
    color: tokens.color.text,
    marginTop: Spacing.two,
  },
  paragraph: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 26,
    fontWeight: String(Typography.bodyWeightRegular) as "400",
    color: tokens.color.text,
  },
  list: {
    gap: Spacing.two,
  },
  listItem: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  listBullet: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 26,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    color: tokens.color.text,
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 26,
    fontWeight: String(Typography.bodyWeightRegular) as "400",
    color: tokens.color.text,
  },
  quote: {
    backgroundColor: tokens.color.mint,
    borderLeftWidth: Border.primary,
    borderLeftColor: tokens.color.black,
    padding: Spacing.four,
  },
  quoteText: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 26,
    fontStyle: "italic",
    fontWeight: String(Typography.bodyWeightMedium) as "500",
    color: tokens.color.text,
  },
  codeWrap: {
    // ponytail: darker than surfaceHeader for code blocks — no token yet.
    // Ceiling: this is the only place this value appears.
    // Upgrade path: add a surfaceCode token to foundation if more code surfaces appear.
    backgroundColor: "#0F1F18",
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
  },
  codeLang: {
    backgroundColor: tokens.color.surfaceHeaderHover,
    borderBottomWidth: Border.thin,
    borderBottomColor: tokens.color.black,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeXs,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: tokens.color.textOnHeaderMuted,
    alignSelf: "flex-start",
  },
  codeText: {
    padding: Spacing.four,
    fontFamily: "monospace",
    fontSize: Typography.fontSizeSm,
    lineHeight: 21,
    color: tokens.color.surfaceContainerHigh,
  },
  bold: {
    fontWeight: String(Typography.bodyWeightBold) as "700",
  },
  italic: {
    fontStyle: "italic",
  },
  inlineCode: {
    fontFamily: "monospace",
    fontSize: Typography.fontSizeSm,
    backgroundColor: tokens.color.surfaceContainerHigh,
    paddingHorizontal: 4,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
  },
  link: {
    alignSelf: "flex-start",
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkText: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 26,
    fontWeight: String(Typography.bodyWeightSemibold) as "600",
    color: tokens.color.text,
    textDecorationLine: "underline",
    textDecorationColor: tokens.color.activeGreen,
    textDecorationStyle: "solid",
  },
});
