import { StyleSheet, TextInput, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { Border, Shadow, Spacing, Typography } from "@/constants/theme";
import { tokens } from "@pathway/ui-tokens";

export type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
};

/**
 * Neo-brutalist search input: 3px black border, hard shadow, search icon
 * on the left, Inter 16px text. No rounded corners, no glow.
 * Replaces the inline ExploreSearchInput pattern with a reusable primitive.
 */
export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
  accessibilityLabel = "Search",
}: SearchInputProps) {
  return (
    <View style={styles.wrapper} accessibilityRole="search">
      {/* Hard shadow */}
      <View style={styles.shadow} />
      <View style={styles.container}>
        {/* Search icon (decorative) */}
        <View style={styles.iconSlot} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={20}
            tintColor={tokens.color.black}
          />
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tokens.color.textSecondary}
          accessibilityLabel={accessibilityLabel}
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
    backgroundColor: tokens.color.black,
    transform: [{ translateX: Shadow.offset }, { translateY: Shadow.offset }],
  },
  container: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.color.surface,
    borderWidth: Border.primary,
    borderColor: tokens.color.black,
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
    fontFamily: Typography.bodyFamily,
    fontSize: Typography.fontSizeMd,
    color: tokens.color.text,
    paddingVertical: Spacing.two,
    minWidth: 44,
  },
});
