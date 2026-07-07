import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type KeyTakeawayCardProps = {
  takeaway: string;
};

/**
 * Key takeaway card — mint background, black border, hard shadow,
 * "KEY TAKEAWAY" label in a black block with green text. Part of the
 * system, not a random card — uses the same border/shadow language
 * as the rest of the detail screens.
 */
export function KeyTakeawayCard({ takeaway }: KeyTakeawayCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.shadow} />
      <View style={styles.card}>
        <View style={styles.labelBlock}>
          <View style={styles.labelIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "bolt.fill", android: "bolt", web: "bolt" }}
              size={14}
              tintColor={tokens.color.accentGreen}
            />
          </View>
          <Text style={styles.labelText}>KEY TAKEAWAY</Text>
        </View>
        <View style={styles.content}>
          <ThemedText style={styles.takeawayText}>{takeaway}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
  shadow: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    overflow: "hidden",
  },
  labelBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: tokens.color.black,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  labelIcon: {
    width: 24,
    height: 24,
    backgroundColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontFamily: Typography.bodyFamily,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    fontSize: Typography.fontSizeXs,
    color: tokens.color.accentGreen,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  content: { padding: Spacing.four },
  takeawayText: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    lineHeight: 26,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
    color: tokens.color.text,
  },
});
