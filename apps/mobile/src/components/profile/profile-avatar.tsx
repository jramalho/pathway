import { StyleSheet, Text, View } from "react-native";

import { Border, Shadow, Spacing } from "@/constants/theme";

/**
 * Geometric avatar for the demo profile — acid-green square with black
 * border, hard shadow, initials "JR" in Epilogue 800, and a small black
 * geometric detail. No photo, no remote image. Decorative only.
 */
export function ProfileAvatar() {
  return (
    <View style={styles.wrapper} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.avatar}>
        {/* Geometric detail: black bar top-left */}
        <View style={styles.detailBar} />
        {/* Initials */}
        <View style={styles.initialsContainer}>
          <Text style={styles.initials}>JR</Text>
        </View>
        {/* Geometric detail: black square bottom-right */}
        <View style={styles.detailSquare} />
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
  avatar: {
    position: "relative",
    zIndex: 1,
    width: 112,
    height: 112,
    backgroundColor: "#79FF5B",
    borderWidth: Border.primary,
    borderColor: "#000000",
    overflow: "hidden",
  },
  detailBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: Border.primary,
    backgroundColor: "#000000",
  },
  initialsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: "Epilogue",
    fontSize: 40,
    fontWeight: "800",
    color: "#000000",
    lineHeight: 44,
  },
  detailSquare: {
    position: "absolute",
    bottom: Spacing.two,
    right: Spacing.two,
    width: 20,
    height: 20,
    backgroundColor: "#000000",
  },
});
