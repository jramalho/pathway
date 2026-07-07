import { Tag } from "./tag";
import { tokens } from "@pathway/ui-tokens";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type DifficultyBadgeProps = {
  /** Difficulty level from the domain model. */
  level: DifficultyLevel | string;
  /** Optional background override. Defaults to mint. */
  backgroundColor?: string;
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/**
 * Difficulty badge — a Tag variant that maps domain difficulty values
 * to human-readable labels. Uses the mint accent surface by default.
 */
export function DifficultyBadge({ level, backgroundColor }: DifficultyBadgeProps) {
  const label = DIFFICULTY_LABELS[level] ?? level;
  return (
    <Tag backgroundColor={backgroundColor ?? tokens.color.mint}>
      {label}
    </Tag>
  );
}
