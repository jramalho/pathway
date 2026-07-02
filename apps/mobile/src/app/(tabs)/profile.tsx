import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

/**
 * Profile scaffold — temporary foundation screen.
 * Full implementation arrives in Part 2.7.
 */
export default function ProfileScreen() {
  return (
    <Screen>
      <ThemedText type="title" style={styles.title}>
        Profile
      </ThemedText>
      <View style={styles.divider} />
      <ThemedText themeColor="textSecondary" style={styles.message}>
        Learning activity overview
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "800",
    fontFamily: "Epilogue",
  },
  divider: {
    height: Border.primary,
    backgroundColor: "#000000",
    width: "100%",
    marginVertical: Spacing.three,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
});
