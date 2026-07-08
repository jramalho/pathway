import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabInset, Layout, Spacing } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type ScreenProps = ViewProps & {
  /** Wrap content in a ScrollView (default true). */
  scrollable?: boolean;
  /** Horizontal padding (default content padding 24). */
  paddingHorizontal?: number;
  /**
   * Extra bottom padding to clear the bottom tab bar.
   * When omitted, defaults to BottomTabInset + Spacing.three for tab
   * screens. Detail screens pass a smaller value — the Screen component
   * adds the bottom safe area inset automatically so CTAs stay tappable
   * above the home indicator.
   */
  bottomInset?: number;
};

/**
 * Screen shell: safe-area aware, correct background, content padding,
 * and bottom-nav compensation. Supports ScrollView when needed.
 *
 * The bottom safe area inset is always added to `bottomInset` so content
 * and CTAs are never covered by the home indicator on devices that have one.
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
  const totalBottomPadding = bottomInset + insets.bottom;

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
            { paddingHorizontal, paddingBottom: totalBottomPadding },
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
      <View style={[containerStyle, { paddingHorizontal, paddingBottom: totalBottomPadding }]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.surface,
  maxWidth: Layout.maxContentWidth,
  width: "100%",
  alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: tokens.color.surface,
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
