import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { Border, Layout } from "@/constants/theme";

export type LessonDetailHeaderProps = {
  lessonTitle: string;
  isSaved: boolean;
  onToggleSave: () => void;
  /** Fallback path slug for back navigation. */
  pathSlug?: string;
};

/**
 * Lesson detail header — back button (left), PATHWAY brand (center),
 * bookmark button (right). No menu, no search.
 */
export function LessonDetailHeader({ lessonTitle, isSaved, onToggleSave, pathSlug }: LessonDetailHeaderProps) {
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
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.iconSlot}
          onPress={handleBack}
        >
          <SymbolView
            name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
            size={24}
            tintColor="#000000"
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
          hitSlop={12}
          style={styles.iconSlot}
          onPress={onToggleSave}
        >
          <SymbolView
            name={
              isSaved
                ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
            }
            size={24}
            tintColor="#000000"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAF9F5",
    borderBottomWidth: Border.primary,
    borderBottomColor: "#000000",
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
    color: "#000000",
  },
});
