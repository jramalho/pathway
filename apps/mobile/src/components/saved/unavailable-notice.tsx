import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

/**
 * Discrete notice shown when some saved slugs no longer match published
 * content. Does not delete the persisted state — just informs the user.
 */
export function UnavailableSavedContentNotice({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.color.surfaceContainer,
    borderWidth: Border.thin,
    borderColor: tokens.color.black,
    padding: Spacing.two,
  },
  text: {
    fontFamily: Typography.bodyFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
  },
});
