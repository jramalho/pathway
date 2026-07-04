import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { Border, Shadow, Spacing } from "@/constants/theme";

export type NoResultsStateProps = {
  onReset: () => void;
};

/**
 * No-results state: "VOID DETECTED" with a search-off icon in a black
 * bordered box, description, and RESET PARAMETERS button.
 */
export function NoResultsState({ onReset }: NoResultsStateProps) {
  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.card}>
        {/* Icon */}
        <View style={styles.iconBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "magnifyingglass.circle", android: "search_off", web: "search_off" }}
            size={32}
            tintColor="#79FF5B"
          />
        </View>

        {/* Text */}
        <Text style={styles.title}>VOID DETECTED</Text>
        <Text style={styles.description}>
          No learning paths or lessons match your current search.
        </Text>

        {/* Reset button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset search and topic filters"
          onPress={onReset}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonLabel}>RESET PARAMETERS</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignSelf: "center",
    width: "100%",
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
    backgroundColor: "#EFEEEA",
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 20,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#000000",
  },
  description: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
    color: "#424845",
    textAlign: "center",
  },
  button: {
    minHeight: 44,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: "#79FF5B",
    borderWidth: Border.primary,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  buttonLabel: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 13,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
