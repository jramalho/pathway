import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/ui/screen";
import { ThemedText } from "@/components/themed-text";
import { Border, Spacing } from "@/constants/theme";

/**
 * Lesson Detail scaffold — temporary.
 * Full implementation arrives in Part 2.5 (consumes getLessonBySlug).
 */
export default function LessonDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <Screen>
      <ThemedText type="title" style={styles.title}>
        Lesson
      </ThemedText>
      <View style={styles.divider} />
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {slug ? `Slug: ${slug}` : "Lesson detail"}
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
