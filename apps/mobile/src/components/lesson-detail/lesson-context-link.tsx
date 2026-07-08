import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { Border, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LessonContextLinkProps = {
  pathTitle: string;
  pathSlug: string;
  /** Parent module title, when available. */
  moduleTitle?: string | null;
};

/**
 * Context breadcrumb — compact "FROM PATH › MODULE" label linking back
 * to the learning path. Shows the path title and, when available, the
 * module title, giving the learner immediate context without consuming
 * much vertical space.
 */
export function LessonContextLink({ pathTitle, pathSlug, moduleTitle }: LessonContextLinkProps) {
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
          size={14}
          tintColor={tokens.color.black}
        />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="smallBold" style={styles.label}>FROM PATH</ThemedText>
        <View style={styles.breadcrumbRow}>
          <ThemedText style={styles.pathName} numberOfLines={1}>{pathTitle}</ThemedText>
          {moduleTitle && (
            <>
              <ThemedText style={styles.separator} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">›</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.moduleName} numberOfLines={1}>
                {moduleTitle}
              </ThemedText>
            </>
          )}
        </View>
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
    borderBottomColor: tokens.color.black,
    minHeight: 44,
  },
  pressed: { opacity: 0.6 },
  icon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: { flex: 1, gap: 2 },
  label: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeXs,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: tokens.color.textSecondary,
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  pathName: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    fontWeight: String(Typography.bodyWeightSemibold) as "600",
    color: tokens.color.black,
    flexShrink: 1,
  },
  separator: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    fontWeight: String(Typography.bodyWeightBold) as "700",
    color: tokens.color.textSecondary,
  },
  moduleName: {
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeSm,
    fontWeight: String(Typography.bodyWeightMedium) as "500",
    flexShrink: 1,
  },
});
