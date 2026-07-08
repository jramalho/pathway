import { StyleSheet, View } from "react-native";
import { tokens } from "@pathway/ui-tokens";

import { ProfileAvatar } from "./profile-avatar";
import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

/**
 * Profile hero — geometric avatar, name, role tags, and honest
 * description about local learning data. No edit, no sign out,
 * no fake account data.
 */
export function ProfileHero() {
  return (
    <View style={styles.container}>
      <ProfileAvatar />

      <View style={styles.content}>
        <ThemedText style={styles.name}>JONATHAN RAMALHO</ThemedText>

        <View style={styles.tagRow}>
          <Tag backgroundColor={tokens.color.mint}>MOBILE ENGINEER</Tag>
          <Tag backgroundColor={tokens.color.surface}>LEARNING PROFILE</Tag>
        </View>

        <ThemedText themeColor="textSecondary" style={styles.description}>
          This local profile reflects learning activity saved on this device.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  content: {
    gap: Spacing.two,
  },
  name: {
    fontFamily: "Epilogue",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    textTransform: "uppercase",
    color: tokens.color.black,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  description: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
});
