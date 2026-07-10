import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ComponentRef,
  type ReactNode,
} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import bold from "expo-symbols/androidWeights/bold";
import type { TabTriggerSlotProps } from "expo-router/ui";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { tokens } from "@pathway/ui-tokens";

const GLASS_RADIUS = 22;
const BAR_RADIUS = 30;
const ACTIVE_DURATION = 380;

function canUseLiquidGlass(): boolean {
  return (
    Platform.OS === "ios" &&
    isLiquidGlassAvailable() &&
    isGlassEffectAPIAvailable()
  );
}

type TabPosition = {
  x: number;
  width: number;
};

type TabBarContextValue = {
  registerTab: (id: string, position: TabPosition) => void;
  activateTab: (id: string) => void;
};

const TabBarContext = createContext<TabBarContextValue | null>(
  null,
);

function useTabBarContext(): TabBarContextValue {
  const context = useContext(TabBarContext);

  if (!context) {
    throw new Error("TabButton must be rendered inside TabBar.");
  }

  return context;
}

export type TabBarProps = ViewProps & {
  children: ReactNode;
};

export const TabBar = forwardRef<
  ComponentRef<typeof View>,
  TabBarProps
>(function TabBar(
  {
    children,
    style,
    ...props
  },
  ref,
) {
  const insets = useSafeAreaInsets();
  const glassAvailable = canUseLiquidGlass();

  const [positions, setPositions] = useState<
    Record<string, TabPosition>
  >({});
  const [activeId, setActiveId] = useState<string | null>(
    null,
  );

  const glowX = useSharedValue(0);
  const glowWidth = useSharedValue(120);
  const glowOpacity = useSharedValue(0);

  const registerTab = useCallback(
    (id: string, position: TabPosition) => {
      setPositions((current) => {
        const existing = current[id];

        if (
          existing?.x === position.x &&
          existing.width === position.width
        ) {
          return current;
        }

        return {
          ...current,
          [id]: position,
        };
      });
    },
    [],
  );

  const activateTab = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  useEffect(() => {
    if (!activeId) {
      return;
    }

    const activePosition = positions[activeId];

    if (!activePosition) {
      return;
    }

    const targetWidth = Math.max(
      activePosition.width * 2,
      130,
    );

    glowX.value = withSpring(
      activePosition.x +
        activePosition.width / 2 -
        targetWidth / 2,
      {
        damping: 20,
        stiffness: 180,
        mass: 0.8,
      },
    );

    glowWidth.value = withTiming(targetWidth, {
      duration: ACTIVE_DURATION,
    });

    glowOpacity.value = withTiming(1, {
      duration: ACTIVE_DURATION,
    });
  }, [
    activeId,
    positions,
    glowOpacity,
    glowWidth,
    glowX,
  ]);

  const glowStyle = useAnimatedStyle(() => ({
    width: glowWidth.value,
    opacity: glowOpacity.value * 0.34,
    transform: [
      {
        translateX: glowX.value,
      },
    ],
  }));

  const contextValue = useMemo<TabBarContextValue>(
    () => ({
      registerTab,
      activateTab,
    }),
    [activateTab, registerTab],
  );

  return (
    <TabBarContext.Provider value={contextValue}>
      <View
        ref={ref}
        {...props}
        style={[
          styles.barOuter,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
          style,
        ]}
      >
        <View style={styles.barShadow} />

        <View style={styles.barShell}>
          <Animated.View
            pointerEvents="none"
            style={[styles.greenLight, glowStyle]}
          />

          {glassAvailable ? (
            <GlassView
              pointerEvents="none"
              colorScheme="light"
              isInteractive={false}
              glassEffectStyle="regular"
              tintColor="rgba(255,255,255,0.12)"
              style={styles.barGlass}
            />
          ) : (
            <View
              pointerEvents="none"
              style={styles.barFallback}
            />
          )}

          <View
            pointerEvents="none"
            style={styles.barTopReflection}
          />

          <View
            pointerEvents="none"
            style={styles.barBottomReflection}
          />

          <View style={styles.tabsRow}>
            {children}
          </View>
        </View>
      </View>
    </TabBarContext.Provider>
  );
});

export type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  tabId?: string;
  accessibilityLabel?: string;
  icon: ComponentProps<typeof SymbolView>["name"];
};

export const TabButton = forwardRef<
  ComponentRef<typeof Pressable>,
  TabButtonProps
>(function TabButton(
  {
    label,
    tabId = label,
    accessibilityLabel,
    icon,
    isFocused,
    style: triggerStyle,
    onLayout: triggerOnLayout,
    ...props
  },
  ref,
) {
  const active = Boolean(isFocused);
  const glassAvailable = canUseLiquidGlass();

  const {
    registerTab,
    activateTab,
  } = useTabBarContext();

  useEffect(() => {
    if (active) {
      activateTab(tabId);
    }
  }, [active, activateTab, tabId]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      triggerOnLayout?.(event);

      const { x, width } = event.nativeEvent.layout;

      registerTab(tabId, {
        x,
        width,
      });
    },
    [registerTab, tabId, triggerOnLayout],
  );

  return (
    <Pressable
      ref={ref}
      {...props}
      onLayout={handleLayout}
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{
        selected: active,
      }}
      hitSlop={4}
      style={(state) => [
        typeof triggerStyle === "function"
          ? triggerStyle(state)
          : triggerStyle,
        styles.pressable,
        state.pressed && styles.pressed,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.externalShadow,
          active && styles.externalShadowActive,
        ]}
      />

      <View style={styles.lensOuter}>
        <View style={styles.lensClip}>
          {glassAvailable ? (
            <GlassView
              pointerEvents="none"
              colorScheme="light"
              isInteractive={false}
              glassEffectStyle={{
                style: "clear",
                animate: true,
                animationDuration: 0.28,
              }}
              tintColor={
                active
                  ? "rgba(162,255,40,0.07)"
                  : "rgba(255,255,255,0.07)"
              }
              style={styles.glassSurface}
            />
          ) : (
            <View
              pointerEvents="none"
              style={styles.fallbackSurface}
            />
          )}

          <View
            pointerEvents="none"
            style={styles.milkyLayer}
          />

          <View
            pointerEvents="none"
            style={styles.bottomInnerShadow}
          />

          <View
            pointerEvents="none"
            style={styles.rightInnerShadow}
          />

          <View
            pointerEvents="none"
            style={styles.leftInnerShadow}
          />

          <View
            pointerEvents="none"
            style={styles.topSpecular}
          />

          <View
            pointerEvents="none"
            style={styles.topSpecularSoft}
          />

          <View
            pointerEvents="none"
            style={styles.cornerSpark}
          />

          <View
            pointerEvents="none"
            style={styles.leftSpecular}
          />

          <View
            pointerEvents="none"
            style={styles.rightSpecular}
          />

          <View
            pointerEvents="none"
            style={styles.bottomRefraction}
          />

          <View
            pointerEvents="none"
            style={styles.bottomGlint}
          />

          <View
            pointerEvents="none"
            style={styles.innerStroke}
          />

          {active ? (
            <View
              pointerEvents="none"
              style={styles.activeInnerStroke}
            />
          ) : null}

          <View
            pointerEvents="none"
            style={styles.content}
          >
            <SymbolView
              name={icon}
              size={27}
              tintColor={tokens.color.black}
              weight={
                active
                  ? {
                      ios: "bold",
                      android: bold,
                    }
                  : undefined
              }
            />

            <Text
              numberOfLines={1}
              style={[
                styles.label,
                active && styles.labelActive,
              ]}
            >
              {label}
            </Text>
          </View>
        </View>

        <View
          pointerEvents="none"
          style={[
            styles.outerStroke,
            active && styles.outerStrokeActive,
          ]}
        />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  barOuter: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,

    paddingTop: 10,
    paddingHorizontal: 18,

    backgroundColor: "transparent",
  },

  barShadow: {
    position: "absolute",
    top: 16,
    right: 14,
    bottom: 4,
    left: 22,

    borderRadius: BAR_RADIUS + 2,

    backgroundColor: "rgba(20,28,20,0.1)",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,

    elevation: 8,
  },

  barShell: {
    position: "relative",
    width: "100%",
    minHeight: 98,
    overflow: "hidden",

    padding: 9,

    borderWidth: 1,
    borderColor: "rgba(16,22,16,0.16)",
    borderRadius: BAR_RADIUS,

    backgroundColor: "rgba(255,255,255,0.04)",
  },

  greenLight: {
    position: "absolute",
    top: -12,

    height: 124,
    borderRadius: 999,

    backgroundColor: tokens.color.activeGreen,

    shadowColor: tokens.color.activeGreen,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 25,
  },

  barGlass: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    borderRadius: BAR_RADIUS - 1,
  },

  barFallback: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    borderRadius: BAR_RADIUS - 1,

    backgroundColor: "rgba(247,249,246,0.92)",
  },

  barTopReflection: {
    position: "absolute",
    top: 4,
    right: 24,
    left: 24,

    height: 2,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.92)",
  },

  barBottomReflection: {
    position: "absolute",
    right: 22,
    bottom: 4,
    left: 22,

    height: 2,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.46)",
  },

  tabsRow: {
    width: "100%",
    minHeight: 78,

    flexDirection: "row",
    alignItems: "stretch",

    gap: 9,
  },

  pressable: {
    flex: 1,
    minWidth: 0,
    minHeight: 76,

    position: "relative",

    marginVertical: 2,
  },

  pressed: {
    transform: [
      {
        scale: 0.975,
      },
      {
        translateY: 1,
      },
    ],
  },

  externalShadow: {
    position: "absolute",
    top: 3,
    right: 1,
    bottom: -5,
    left: 1,

    borderRadius: GLASS_RADIUS + 1,

    backgroundColor: "rgba(255,255,255,0.14)",

    shadowColor: "#132013",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.14,
    shadowRadius: 10,

    elevation: 5,
  },

  externalShadowActive: {
    shadowColor: tokens.color.activeGreen,
    shadowOpacity: 0.22,
    shadowRadius: 15,
  },

  lensOuter: {
    flex: 1,
    width: "100%",
    minHeight: 76,

    position: "relative",

    borderRadius: GLASS_RADIUS,
  },

  lensClip: {
    flex: 1,
    width: "100%",
    minHeight: 76,

    position: "relative",
    overflow: "hidden",

    alignItems: "center",
    justifyContent: "center",

    borderRadius: GLASS_RADIUS,

    backgroundColor: "rgba(255,255,255,0.018)",
  },

  glassSurface: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    borderRadius: GLASS_RADIUS,
  },

  fallbackSurface: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    borderRadius: GLASS_RADIUS,

    backgroundColor: "rgba(248,250,247,0.72)",
  },

  milkyLayer: {
    position: "absolute",
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,

    borderRadius: GLASS_RADIUS - 1,

    backgroundColor: "rgba(255,255,255,0.055)",
  },

  bottomInnerShadow: {
    position: "absolute",
    right: 7,
    bottom: -5,
    left: 7,

    height: 24,
    borderRadius: 999,

    backgroundColor: "rgba(20,28,20,0.052)",

    shadowColor: "#141c14",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },

  rightInnerShadow: {
    position: "absolute",
    top: 12,
    right: -4,
    bottom: 12,

    width: 17,
    borderRadius: 999,

    backgroundColor: "rgba(18,24,18,0.032)",
  },

  leftInnerShadow: {
    position: "absolute",
    top: 13,
    bottom: 13,
    left: -5,

    width: 14,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.16)",
  },

  topSpecular: {
    position: "absolute",
    top: 5,
    right: 10,
    left: 10,

    height: 10,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.56)",

    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.24,
    shadowRadius: 6,
  },

  topSpecularSoft: {
    position: "absolute",
    top: 12,
    right: 18,
    left: 18,

    height: 8,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.16)",
  },

  cornerSpark: {
    position: "absolute",
    top: 7,
    left: 8,

    width: 21,
    height: 20,

    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 13,

    transform: [
      {
        rotate: "-9deg",
      },
    ],
  },

  leftSpecular: {
    position: "absolute",
    top: 17,
    bottom: 18,
    left: 5,

    width: 3,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.34)",
  },

  rightSpecular: {
    position: "absolute",
    top: 19,
    right: 5,
    bottom: 20,

    width: 2,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.13)",
  },

  bottomRefraction: {
    position: "absolute",
    right: 10,
    bottom: 5,
    left: 10,

    height: 5,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.37)",

    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  bottomGlint: {
    position: "absolute",
    right: 25,
    bottom: 6,
    left: 25,

    height: 2,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.62)",
  },

  innerStroke: {
    position: "absolute",
    top: 2,
    right: 2,
    bottom: 2,
    left: 2,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.52)",
    borderRadius: GLASS_RADIUS - 2,
  },

  activeInnerStroke: {
    position: "absolute",
    top: 3,
    right: 3,
    bottom: 3,
    left: 3,

    borderWidth: 1,
    borderColor: "rgba(153,255,42,0.22)",
    borderRadius: GLASS_RADIUS - 3,
  },

  outerStroke: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    borderWidth: 1,
    borderColor: "rgba(16,22,16,0.11)",
    borderRadius: GLASS_RADIUS,
  },

  outerStrokeActive: {
    borderColor: "rgba(123,218,25,0.34)",
  },

  content: {
    zIndex: 10,

    alignItems: "center",
    justifyContent: "center",

    gap: 5,

    paddingTop: 4,
    paddingHorizontal: 4,
  },

  label: {
    maxWidth: "100%",

    color: tokens.color.black,

    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.25,
  },

  labelActive: {
    fontWeight: "800",
  },
});