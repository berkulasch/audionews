import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { NewsCategory, CATEGORY_LABELS } from "../lib/types";
import { COLORS } from "../constants/theme";

interface CategoryPillProps {
  category: NewsCategory;
  selected: boolean;
  onPress: () => void;
}

export function CategoryPill({ category, selected, onPress }: CategoryPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.pill, selected && styles.pillSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {CATEGORY_LABELS[category]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: COLORS.cream[200],
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
  pillSelected: {
    backgroundColor: COLORS.charcoal[900],
    borderColor: COLORS.charcoal[900],
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.charcoal[700],
  },
  labelSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
