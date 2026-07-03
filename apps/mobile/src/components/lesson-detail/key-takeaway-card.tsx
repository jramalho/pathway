import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";

export type KeyTakeawayCardProps = {
  takeaway: string;
};

/**
 * Key takeaway card — mint background, black border, hard shadow,
 * "KEY TAKEAWAY" label in a black block with green text.
 */
export function KeyTakeawayCard({ takeaway }: KeyTakeawayCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.shadow} />
      <View style={styles.card}>
        <View style={styles.labelBlock}>
          <Text style={styles.labelText}>KEY TAKEAWAY</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.iconRow}>
            <View style={styles.iconBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "bolt.fill", android: "bolt", web: "bolt" }}
                size={18}
                tintColor="#79FF5B"
              />
            </View>
            <ThemedText style={styles.takeawayText}>{takeaway}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
    overflow: "hidden",
  },
  labelBlock: {
    backgroundColor: "#000000",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  labelText: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 12,
    color: "#79FF5B",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  content: {
    padding: Spacing.four,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  iconBox: {
    width: 36,
    height: 36,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  takeawayText: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "500",
    color: "#1B1C1A",
  },
});
