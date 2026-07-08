import { StyleSheet, View } from "react-native";
import { tokens } from "@pathway/ui-tokens";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";

/**
 * Local learning data notice — honest informational card explaining
 * that progress is stored locally. No sync promises, no sign out,
 * no reset button, no technical jargon.
 */
export function LocalLearningDataNotice() {
  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconBlock} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "iphone", android: "phone_iphone", web: "phone_iphone" }}
              size={20}
              tintColor={tokens.color.black}
            />
          </View>
          <ThemedText style={styles.heading}>LOCAL LEARNING DATA</ThemedText>
        </View>

        <ThemedText style={styles.primaryText}>
          Saved items and lesson progress are stored on this device.
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.secondaryText}>
          Sign-in and cross-device sync are intentionally outside this version of Pathway.
        </ThemedText>
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
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconBlock: {
    width: 36,
    height: 36,
    backgroundColor: tokens.color.mint,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontFamily: "Epilogue",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
    textTransform: "uppercase",
    color: tokens.color.black,
  },
  primaryText: {
    fontFamily: "Inter",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: tokens.color.black,
  },
  secondaryText: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
});
