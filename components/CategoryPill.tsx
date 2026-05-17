import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { NewsCategory, CATEGORY_LABELS } from "../lib/types";
import { COLORS, FONTS, RADIUS, CATEGORY_COLORS } from "../constants/theme";

interface CategoryPillProps {
  category: NewsCategory;
  selected: boolean;
  onPress: () => void;
  showDot?: boolean;
}

export function CategoryPill({
  category,
  selected,
  onPress,
  showDot = true,
}: CategoryPillProps) {
  const accent = CATEGORY_COLORS[category];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.pill, selected && styles.pillSelected]}
    >
      {showDot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: accent },
            selected && { backgroundColor: COLORS.primaryForeground },
          ]}
        />
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {CATEGORY_LABELS[category]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: COLORS.foreground,
  },
  labelSelected: {
    color: COLORS.primaryForeground,
    fontFamily: FONTS.sansSemiBold,
  },
});
