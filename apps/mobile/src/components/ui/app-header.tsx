import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { Border, Layout } from "@/constants/theme";

export type AppHeaderProps = {
  /** Show the menu (left) affordance. Decorative only in this stage. */
  showMenu?: boolean;
  /** Show the search (right) button. Navigates to Explore. */
  showSearch?: boolean;
};

/**
 * Shared app header: 64px visual height + safe area top, off-white
 * background, 3px bottom black border. Menu icon left (decorative),
 * PATHWAY brand centered (Epilogue 800), search icon right.
 *
 * The menu icon is a visual affordance only — not exposed as an
 * accessible control until a real drawer exists. The search icon
 * navigates to the Explore tab.
 */
export function AppHeader({ showMenu = true, showSearch = true }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        {/* Left: menu affordance (decorative, not an accessible button) */}
        <View style={styles.side}>
          {showMenu && (
            <View style={styles.iconSlot} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <SymbolView
                name={{ ios: "line.3.horizontal", android: "menu", web: "menu" }}
                size={24}
                tintColor="#000000"
              />
            </View>
          )}
        </View>

        {/* Center: brand */}
        <View style={styles.brand}>
          <Text style={styles.brandText}>PATHWAY</Text>
        </View>

        {/* Right: search */}
        <View style={styles.side}>
          {showSearch && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search"
              hitSlop={12}
              style={styles.iconSlot}
              onPress={() => router.navigate("/explore")}
            >
              <SymbolView
                name={{ ios: "magnifyingglass", android: "search", web: "search" }}
                size={24}
                tintColor="#000000"
              />
            </Pressable>
          )}
        </View>
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
  side: {
    minWidth: Layout.touchTarget,
    alignItems: "center",
    justifyContent: "center",
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
