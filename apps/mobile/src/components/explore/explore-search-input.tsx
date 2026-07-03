import { StyleSheet, TextInput, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { Border, Shadow, Spacing } from "@/constants/theme";

export type ExploreSearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

/**
 * Neo-brutalist search input: 3px black border, hard shadow, search icon
 * on the left, Inter 16px text. No rounded corners, no glow.
 */
export function ExploreSearchInput({ value, onChangeText }: ExploreSearchInputProps) {
  return (
    <View style={styles.wrapper}>
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.container}>
        {/* Search icon (decorative) */}
        <View style={styles.iconSlot} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={20}
            tintColor="#000000"
          />
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search paths, lessons, and skills..."
          placeholderTextColor="#424845"
          accessibilityLabel="Search learning paths and lessons"
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
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
  container: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF9F5",
    borderWidth: Border.primary,
    borderColor: "#000000",
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  iconSlot: {
    minWidth: 28,
    minHeight: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#1B1C1A",
    paddingVertical: Spacing.two,
    minWidth: 44,
  },
});
