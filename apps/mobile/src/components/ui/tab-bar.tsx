import { Pressable, StyleSheet, Text, View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import bold from "expo-symbols/androidWeights/bold";
import { type TabTriggerSlotProps } from "expo-router/ui";

import { Border, Layout, Shadow, Spacing } from "@/constants/theme";

export type TabBarProps = ViewProps & {
  children: React.ReactNode;
};

/**
 * Neo-brutalist bottom navigation bar. Fixed at the bottom, off-white
 * background, 3px top black border, hard black shadow above the bar.
 *
 * Used as the asChild target for TabList — receives ViewProps from
 * TabList and renders the TabTrigger children inside.
 */
export function TabBar({ children, style, ...rest }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.outer} {...rest}>
      {/* Hard shadow above the bar */}
      <View style={styles.shadowStrip} />
      <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
        <View style={styles.tabsRow}>{children}</View>
      </View>
    </View>
  );
}

export type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  /** Full accessibility label (defaults to label if not provided). */
  accessibilityLabel?: string;
  icon: React.ComponentProps<typeof SymbolView>["name"];
};

/**
 * Individual tab button. Inactive = dark gray icon + label, no background.
 * Active = green block, 3px border, hard shadow, lifted up, black icon
 * and bold label.
 */
export function TabButton({ label, accessibilityLabel, icon, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: !!isFocused }}
      hitSlop={0}
      style={styles.tabPressable}
    >
      <View
        style={[
          styles.tabInner,
          isFocused && styles.tabActive,
          isFocused && {
            borderWidth: Border.primary,
            borderColor: "#000000",
          },
        ]}
      >
        <SymbolView
          name={icon}
          size={24}
          tintColor={isFocused ? "#000000" : "#424845"}
          weight={isFocused ? { ios: "bold", android: bold } : undefined}
        />
        <Text
          style={[
            styles.label,
            { color: isFocused ? "#000000" : "#424845" },
            isFocused && styles.labelActive,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  shadowStrip: {
    height: Shadow.offset,
    backgroundColor: "#000000",
    width: "100%",
  },
  bar: {
    backgroundColor: "#FAF9F5",
    borderTopWidth: Border.primary,
    borderTopColor: "#000000",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    minHeight: Layout.touchTarget + 16,
    paddingHorizontal: Spacing.one,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: Layout.touchTarget,
    minHeight: Layout.touchTarget,
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingBottom: Spacing.two,
    paddingTop: Spacing.two,
    minWidth: Layout.touchTarget,
    minHeight: Layout.touchTarget,
    marginBottom: 4,
  },
  tabActive: {
    backgroundColor: "#38FE13",
    transform: [{ translateY: -8 }],
  },
  label: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "600",
  },
  labelActive: {
    fontWeight: "700",
  },
});
