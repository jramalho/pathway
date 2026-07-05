import { StyleSheet, Text, View } from "react-native";

import type { LessonBody } from "@pathway/api";

import { Spacing } from "@/constants/theme";

export type LessonBodyRendererProps = {
  /**
   * Lesson body as Markdown (Strapi richtext default editor returns a
   * plain Markdown string). The mobile renderer currently surfaces the
   * raw Markdown text; a structured Markdown renderer is deferred to a
   * separate mobile task.
   */
  body: LessonBody;
};

/**
 * Safe rich-text renderer for the lesson body.
 *
 * The Strapi `body` field is a richtext field configured with the default
 * Markdown editor, so Strapi returns it as a plain Markdown string. This
 * renderer surfaces the raw Markdown text without injecting HTML. A
 * structured Markdown renderer (headings, lists, code, links) is deferred
 * to a separate mobile task — this keeps the type contract honest while
 * avoiding unsafe HTML rendering.
 */
export function LessonBodyRenderer({ body }: LessonBodyRendererProps) {
  if (!body || body.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{body}</Text>
    </View>
  );
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
});
