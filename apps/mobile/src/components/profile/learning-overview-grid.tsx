import { StyleSheet, Text, View } from "react-native";
import { tokens } from "@pathway/ui-tokens";

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
      backgroundColor: tokens.color.black,
      valueColor: tokens.color.accentGreen,
      labelColor: tokens.color.surface,
    },
    {
      label: "SAVED ITEMS",
      value: overview.savedItems,
      backgroundColor: tokens.color.accentGreen,
      valueColor: tokens.color.black,
      labelColor: tokens.color.black,
    },
    {
      label: "ACTIVE PATHS",
      value: overview.activePaths,
      backgroundColor: tokens.color.mint,
      valueColor: tokens.color.black,
      labelColor: tokens.color.black,
    },
    {
      label: "COMPLETED PATHS",
      value: overview.completedPaths,
      backgroundColor: tokens.color.surfaceContainer,
      valueColor: tokens.color.black,
      labelColor: tokens.color.black,
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
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  card: {
    position: "relative",
    zIndex: 1,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
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
