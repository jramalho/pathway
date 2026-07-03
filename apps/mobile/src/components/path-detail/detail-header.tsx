import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { Border, Layout } from "@/constants/theme";

/**
 * Detail header — same visual style as AppHeader but with a back button
 * on the left instead of menu, and no search button on the right.
 * PATHWAY brand stays centered.
 */
export function DetailHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    // router.back() with fallback to Explore
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/explore");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        {/* Left: back button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back to learning paths"
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

        {/* Right: empty spacer to keep brand centered */}
        <View style={styles.side} />
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
  side: {
    minWidth: Layout.touchTarget,
  },
  brandText: {
    fontFamily: "Epilogue",
    fontWeight: "800",
    fontSize: 22,
    letterSpacing: 1.5,
    color: "#000000",
  },
});
