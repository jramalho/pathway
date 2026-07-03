import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

export type LessonContextLinkProps = {
  pathTitle: string;
  pathSlug: string;
};

/**
 * Context link — "FROM PATH" label with the learning path title.
 * Pressable, navigates to /paths/[slug].
 */
export function LessonContextLink({ pathTitle, pathSlug }: LessonContextLinkProps) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open learning path ${pathTitle}`}
      onPress={() => router.navigate(`/paths/${pathSlug}`)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.icon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <SymbolView
          name={{ ios: "square.stack.3d.up", android: "layers", web: "layers" }}
          size={16}
          tintColor="#000000"
        />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="smallBold" style={styles.label}>FROM PATH</ThemedText>
        <ThemedText style={styles.pathName}>{pathTitle}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: Border.primary,
    borderBottomColor: "#000000",
  },
  pressed: {
    opacity: 0.6,
  },
  icon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: "Inter",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#424845",
  },
  pathName: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
