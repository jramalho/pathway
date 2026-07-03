import { StyleSheet, Text, View } from "react-native";

import type { LessonBodyBlock } from "@pathway/api";

import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

export type LessonBodyRendererProps = {
  body: LessonBodyBlock[];
};

/**
 * Safe rich-text renderer for Strapi blocks format.
 * No HTML, no dangerouslySetInnerHTML — renders typed blocks.
 */
export function LessonBodyRenderer({ body }: LessonBodyRendererProps) {
  if (!body || body.length === 0) return null;

  return (
    <View style={styles.container}>
      {body.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </View>
  );
}

function BlockRenderer({ block }: { block: LessonBodyBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <Text style={styles.paragraph}>
          {block.children.map((child, i) => (
            <Text
              key={i}
              style={[
                styles.text,
                child.bold && styles.bold,
                child.italic && styles.italic,
                child.code && styles.inlineCode,
              ]}
            >
              {child.text}
            </Text>
          ))}
        </Text>
      );

    case "heading":
      return (
        <ThemedText style={[styles.heading, { fontSize: getHeadingSize(block.level) }]}>
          {block.children.map((c) => c.text).join("")}
        </ThemedText>
      );

    case "list":
      return (
        <View style={styles.list}>
          {block.children.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <View style={styles.listMarker} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
              <Text style={styles.listText}>
                {item.children.map((c) => c.text).join("")}
              </Text>
            </View>
          ))}
        </View>
      );

    case "quote":
      return (
        <View style={styles.quote}>
          <Text style={styles.quoteText}>
            {block.children.map((c) => c.text).join("")}
          </Text>
        </View>
      );

    case "code":
      return (
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {block.children.map((c) => c.text).join("")}
          </Text>
        </View>
      );

    case "link":
      return (
        <Text style={styles.link} onPress={() => { /* Links handled externally in future */ }}>
          {block.children.map((c) => c.text).join("")}
        </Text>
      );

    default:
      return null;
  }
}

function getHeadingSize(level: number): number {
  switch (level) {
    case 1: return 28;
    case 2: return 24;
    case 3: return 20;
    default: return 18;
  }
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  paragraph: {
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 26,
    color: "#1B1C1A",
  },
  text: {
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 26,
    color: "#1B1C1A",
  },
  bold: {
    fontWeight: "700",
  },
  italic: {
    fontStyle: "italic",
  },
  inlineCode: {
    fontFamily: "monospace",
    fontSize: 15,
    backgroundColor: "#EFEEEA",
    paddingHorizontal: 4,
  },
  heading: {
    fontFamily: "Epilogue",
    fontWeight: "800",
    lineHeight: 32,
    color: "#000000",
    marginTop: Spacing.two,
  },
  list: {
    gap: Spacing.two,
    paddingLeft: Spacing.two,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  listMarker: {
    width: 8,
    height: 8,
    backgroundColor: "#79FF5B",
    borderWidth: Border.thin,
    borderColor: "#000000",
    marginTop: 8,
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 26,
    color: "#1B1C1A",
  },
  quote: {
    backgroundColor: "#D4E7DD",
    borderLeftWidth: Border.primary,
    borderLeftColor: "#000000",
    padding: Spacing.three,
  },
  quoteText: {
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 26,
    fontStyle: "italic",
    color: "#1B1C1A",
  },
  codeBlock: {
    backgroundColor: "#0F1F18",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 15,
    lineHeight: 22,
    color: "#E9E8E4",
  },
  link: {
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 26,
    color: "#000000",
    textDecorationLine: "underline",
  },
});
