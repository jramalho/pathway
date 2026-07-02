import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabInset, Layout, Spacing } from "@/constants/theme";

export type ScreenProps = ViewProps & {
  /** Wrap content in a ScrollView (default true). */
  scrollable?: boolean;
  /** Horizontal padding (default content padding 24). */
  paddingHorizontal?: number;
  /** Extra bottom padding to clear the bottom tab bar. */
  bottomInset?: number;
};

/**
 * Screen shell: safe-area aware, correct background, content padding,
 * and bottom-nav compensation. Supports ScrollView when needed.
 */
export function Screen({
  scrollable = true,
  paddingHorizontal = Layout.contentPadding,
  bottomInset = BottomTabInset + Spacing.three,
  style,
  children,
  ...rest
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right },
    style,
  ];

  if (scrollable) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal, paddingBottom: bottomInset },
          ]}
          showsVerticalScrollIndicator={false}
          {...(rest as React.ComponentProps<typeof ScrollView>)}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[containerStyle, { paddingHorizontal, paddingBottom: bottomInset }]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAF9F5",
  maxWidth: Layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAF9F5",
  maxWidth: Layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: Spacing.four,
    paddingVertical: Spacing.four,
  },
});
