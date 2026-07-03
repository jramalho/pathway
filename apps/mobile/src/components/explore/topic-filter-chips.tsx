import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { Border, Shadow, Spacing } from "@/constants/theme";
import type { Topic } from "./explore-filters";

export type TopicFilterChipsProps = {
  topics: Topic[];
  selected: Topic;
  onSelect: (topic: Topic) => void;
};

/**
 * Horizontal scrollable filter chips. Inactive = mint/off-white with 2px
 * border. Active = acid green with 3px border and hard shadow. Press
 * animation shifts 3px and reduces shadow.
 */
export function TopicFilterChips({ topics, selected, onSelect }: TopicFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {topics.map((topic) => {
        const isActive = topic === selected;
        return (
          <Pressable
            key={topic}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Filter by ${topic}`}
            onPress={() => onSelect(topic)}
            style={({ pressed }) => [
              styles.chip,
              isActive && styles.chipActive,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {topic}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.thin,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: "#79FF5B",
    borderWidth: Border.primary,
  },
  chipPressed: {
    transform: [{ translateX: Shadow.offsetPressed }, { translateY: Shadow.offsetPressed }],
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 13,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelActive: {
    fontWeight: "800",
  },
});
