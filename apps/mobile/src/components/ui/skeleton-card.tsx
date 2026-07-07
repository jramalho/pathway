import { StyleSheet, View } from "react-native";

import { Border, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type SkeletonCardProps = {
  /** Show a media/cover block at the top. Defaults to true. */
  withMedia?: boolean;
  /** Number of text lines below the media. Defaults to 3. */
  textLines?: number;
  /** Height of the card. Defaults to undefined (auto). */
  height?: number;
};

/**
 * Skeleton card — a bordered neo-brutalist card with optional media
 * block and text lines. Generic enough to approximate a learning-path
 * card, lesson card, or topic card without hardcoding their layouts.
 *
 * Screen readers: the wrapper is marked aria-hidden via accessibilityElementsHidden.
 */
export function SkeletonCard({
  withMedia = true,
  textLines = 3,
  height,
}: SkeletonCardProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.card, height !== undefined && { height }]}
    >
      {withMedia && <View style={styles.media} />}
      <View style={styles.body}>
        <View style={styles.titleLine} />
        {Array.from({ length: textLines }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.textLine,
              i === textLines - 1 && styles.textLineLast,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: 120,
    backgroundColor: tokens.color.surfaceContainerHigh,
    borderBottomWidth: Border.primary,
    borderBottomColor: tokens.color.black,
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  titleLine: {
    height: 18,
    width: "70%",
    backgroundColor: tokens.color.surfaceContainerHigh,
  },
  textLine: {
    height: 12,
    width: "100%",
    backgroundColor: tokens.color.surfaceContainerHigh,
  },
  textLineLast: {
    width: "60%",
  },
});
