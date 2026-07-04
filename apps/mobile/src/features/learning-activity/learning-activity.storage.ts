import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PersistedLearningActivity } from "./learning-activity.types";

/** Versioned AsyncStorage key for learning activity state. */
export const STORAGE_KEY = "@pathway/learning-activity:v1";

/**
 * Type guard for the persisted payload.
 *
 * Zod is not available in the mobile app (no dependency), so we use an
 * explicit, small type guard that validates version, arrays of strings,
 * and removes duplicates deterministically (preserving first occurrence).
 */
export function isPersistedLearningActivity(value: unknown): value is PersistedLearningActivity {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return false;
  if (!Array.isArray(v.completedLessonSlugs) || !v.completedLessonSlugs.every((s) => typeof s === "string")) return false;
  if (!Array.isArray(v.savedLessonSlugs) || !v.savedLessonSlugs.every((s) => typeof s === "string")) return false;
  if (!Array.isArray(v.savedPathSlugs) || !v.savedPathSlugs.every((s) => typeof s === "string")) return false;
  return true;
}

/** Remove duplicates from a string array, preserving first occurrence. */
function dedupe(slugs: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of slugs) {
    if (s && !seen.has(s)) {
      seen.add(s);
      result.push(s);
    }
  }
  return result;
}

/** Read and validate the persisted payload from AsyncStorage. */
export async function readLearningActivity(): Promise<PersistedLearningActivity | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt JSON — ignore, start fresh.
    return null;
  }

  if (!isPersistedLearningActivity(parsed)) return null;

  // Sanitize: remove empty strings and duplicates deterministically.
  return {
    version: 1,
    completedLessonSlugs: dedupe(parsed.completedLessonSlugs),
    savedLessonSlugs: dedupe(parsed.savedLessonSlugs),
    savedPathSlugs: dedupe(parsed.savedPathSlugs),
  };
}

/** Write the persisted payload to AsyncStorage. */
export async function writeLearningActivity(payload: PersistedLearningActivity): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
