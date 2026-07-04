import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import type { LessonPreview } from "@pathway/api";

import { Tag } from "@/components/ui/tag";
import { ThemedText } from "@/components/themed-text";
import { Border, Shadow, Spacing } from "@/constants/theme";

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export type SavedLessonCardProps = {
  lesson: LessonPreview;
  pathTitle: string;
  pathSlug: string;
  isCompleted: boolean;
  onRemove: () => void;
};

/**
 * Saved lesson card — off-white surface, 3px black border, hard 6px shadow,
 * acid-green top stripe. Content area navigates to the lesson; bookmark
 * button is separate and only removes from saved.
 */
export function SavedLessonCard({ lesson, pathTitle, pathSlug, isCompleted, onRemove }: SavedLessonCardProps) {
  const router = useRouter();

  const tagLabel = difficultyLabels[lesson.difficulty] ?? lesson.difficulty;

  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.card}>
        {/* Acid-green top stripe */}
        <View style={styles.stripe} />

        <View style={styles.body}>
          {/* Top row: tag + remove bookmark */}
          <View style={styles.topRow}>
            <View style={styles.tagRow}>
              <Tag backgroundColor="#79FF5B">{tagLabel}</Tag>
              {isCompleted && <Tag backgroundColor="#38FE13">COMPLETED</Tag>}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove lesson ${lesson.title} from saved items`}
              hitSlop={12}
              style={styles.bookmark}
              onPress={onRemove}
            >
              <SymbolView
                name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                size={22}
                tintColor="#000000"
              />
            </Pressable>
          </View>

          {/* Content area — navigates to lesson */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${lesson.title} from ${pathTitle}. Opens lesson.`}
            onPress={() => router.navigate(`/lessons/${lesson.slug}`)}
            style={({ pressed }) => [styles.contentArea, pressed && styles.contentPressed]}
          >
            {/* Title */}
            <ThemedText style={styles.title}>{lesson.title}</ThemedText>

            {/* Summary */}
            {lesson.summary ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.summary} numberOfLines={3}>
                {lesson.summary}
              </ThemedText>
            ) : null}

            {/* Footer */}
            <View style={styles.footer}>
              {lesson.estimatedDuration > 0 && (
                <ThemedText type="small" themeColor="textSecondary">
                  {lesson.estimatedDuration} min
                </ThemedText>
              )}
              <ThemedText type="small" themeColor="textSecondary">
                {pathTitle}
              </ThemedText>
              <View style={styles.resumeButton}>
                <Text style={styles.resumeLabel}>RESUME</Text>
                <View style={styles.resumeIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <SymbolView
                    name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                    size={14}
                    tintColor="#000000"
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  shadow: {
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
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
    overflow: "hidden",
  },
  stripe: {
    height: 6,
    backgroundColor: "#79FF5B",
    borderBottomWidth: Border.primary,
    borderBottomColor: "#000000",
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    flex: 1,
  },
  bookmark: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contentArea: {
    gap: Spacing.two,
  },
  contentPressed: {
    opacity: 0.7,
  },
  title: {
    fontFamily: "Epilogue",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
    color: "#000000",
    borderBottomWidth: Border.primary,
    borderBottomColor: "#000000",
    paddingBottom: Spacing.two,
  },
  summary: {
    fontFamily: "Inter",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    backgroundColor: "#D4E7DD",
    borderWidth: Border.primary,
    borderColor: "#000000",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginLeft: "auto",
  },
  resumeLabel: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#000000",
  },
  resumeIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
