import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { Border, Layout } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type LessonDetailHeaderProps = {
  lessonTitle: string;
  isSaved: boolean;
  onToggleSave: () => void;
  /** Fallback path slug for back navigation. */
  pathSlug?: string;
  /** Disable save button (e.g. during hydration). */
  disabled?: boolean;
};

/**
 * Lesson detail header — back button (left), PATHWAY brand (center),
 * bookmark button (right). No menu, no search. Bookmark is disabled
 * while local state is being restored from AsyncStorage.
 */
export function LessonDetailHeader({ lessonTitle, isSaved, onToggleSave, pathSlug, disabled }: LessonDetailHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (pathSlug) {
      router.navigate(`/paths/${pathSlug}`);
    } else {
      router.navigate("/explore");
    }
  };

  const saveLabel = isSaved
    ? `Remove lesson ${lessonTitle} from saved items`
    : `Save lesson ${lessonTitle}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        {/* Left: back */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
          hitSlop={12}
          style={styles.iconSlot}
          onPress={handleBack}
        >
          <SymbolView
            name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
            size={24}
            tintColor={tokens.color.black}
          />
        </Pressable>

        {/* Center: brand */}
        <View style={styles.brand}>
          <Text style={styles.brandText}>PATHWAY</Text>
        </View>

        {/* Right: bookmark */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saveLabel}
          accessibilityState={{ selected: isSaved, disabled: !!disabled }}
          hitSlop={12}
          style={[styles.iconSlot, disabled && styles.iconDisabled]}
          onPress={onToggleSave}
          disabled={disabled}
        >
          <SymbolView
            name={
              isSaved
                ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
            }
            size={24}
            tintColor={tokens.color.black}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.color.surface,
    borderBottomWidth: Border.primary,
    borderBottomColor: tokens.color.black,
  },
  bar: {
    height: Layout.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.contentPadding,
  },
  iconSlot: {
    minWidth: Layout.touchTarget,
    minHeight: Layout.touchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  iconDisabled: {
    opacity: 0.4,
  },
  brand: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontFamily: "Epilogue",
    fontWeight: "800",
    fontSize: 22,
    letterSpacing: 1.5,
    color: tokens.color.black,
  },
});
