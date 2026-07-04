import { StyleSheet, Text, View } from "react-native";

import type { LearningOverview } from "@/lib/profile-learning.utils";
import { Border, Shadow, Spacing } from "@/constants/theme";

export type LearningOverviewGridProps = {
  overview: LearningOverview;
};

type CardConfig = {
  label: string;
  value: number;
  backgroundColor: string;
  valueColor: string;
  labelColor: string;
};

/**
 * Learning overview grid — 4 metric cards in a 2-column layout.
 * Each card shows a real metric derived from published content and
 * local activity state. Cards are informational, not pressable.
 */
export function LearningOverviewGrid({ overview }: LearningOverviewGridProps) {
  const cards: CardConfig[] = [
    {
      label: "COMPLETED LESSONS",
      value: overview.completedLessons,
      backgroundColor: "#000000",
      valueColor: "#79FF5B",
      labelColor: "#FAF9F5",
    },
    {
      label: "SAVED ITEMS",
      value: overview.savedItems,
      backgroundColor: "#79FF5B",
      valueColor: "#000000",
      labelColor: "#000000",
    },
    {
      label: "ACTIVE PATHS",
      value: overview.activePaths,
      backgroundColor: "#D4E7DD",
      valueColor: "#000000",
      labelColor: "#000000",
    },
    {
      label: "COMPLETED PATHS",
      value: overview.completedPaths,
      backgroundColor: "#EFEEEA",
      valueColor: "#000000",
      labelColor: "#000000",
    },
  ];

  return (
    <View style={styles.grid}>
      {cards.map((card) => (
        <OverviewCard key={card.label} config={card} />
      ))}
    </View>
  );
}

function OverviewCard({ config }: { config: CardConfig }) {
  const a11yLabel = `${config.label.toLowerCase()}: ${config.value}`;

  return (
    <View style={styles.cardWrapper} accessibilityRole="summary" accessibilityLabel={a11yLabel}>
      {/* Hard shadow */}
      <View style={styles.cardShadow} />
      <View style={[styles.card, { backgroundColor: config.backgroundColor }]}>
        <Text style={[styles.value, { color: config.valueColor }]}>{config.value}</Text>
        <Text style={[styles.label, { color: config.labelColor }]}>{config.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  cardWrapper: {
    position: "relative",
    width: "48%",
    flexGrow: 1,
  },
  cardShadow: {
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
    borderWidth: Border.primary,
    borderColor: "#000000",
    padding: Spacing.three,
    gap: Spacing.one,
    minHeight: 100,
    justifyContent: "center",
  },
  value: {
    fontFamily: "Epilogue",
    fontSize: 40,
    fontWeight: "800",
    lineHeight: 44,
  },
  label: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
