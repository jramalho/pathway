import { ScrollView, StyleSheet } from "react-native";

import { FilterChip } from "@/components/ui/filter-chip";
import { Spacing } from "@/constants/theme";
import type { Topic } from "./explore-filters";

export type TopicFilterChipsProps = {
  topics: Topic[];
  selected: Topic;
  onSelect: (topic: Topic) => void;
};

/**
 * Horizontal scrollable filter chips. Delegates to the reusable FilterChip
 * primitive. Active chips use acid green with 3px border and a checkmark.
 */
export function TopicFilterChips({ topics, selected, onSelect }: TopicFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {topics.map((topic) => (
        <FilterChip
          key={topic}
          label={topic}
          active={topic === selected}
          onPress={() => onSelect(topic)}
          accessibilityLabel={`Filter by ${topic}`}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
});
