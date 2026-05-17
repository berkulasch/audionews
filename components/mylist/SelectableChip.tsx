import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  accent?: string;
  initials?: string;
}

export function SelectableChip({
  label,
  selected,
  onPress,
  accent,
  initials,
}: SelectableChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      {initials ? (
        <View
          style={[
            styles.initialsWrap,
            { backgroundColor: (accent ?? COLORS.primary) + "26" },
            selected && { backgroundColor: COLORS.primaryForeground + "22" },
          ]}
        >
          <Text
            style={[
              styles.initialsText,
              { color: accent ?? COLORS.primary },
              selected && { color: COLORS.primaryForeground },
            ]}
          >
            {initials}
          </Text>
        </View>
      ) : accent ? (
        <View
          style={[
            styles.dot,
            { backgroundColor: accent },
            selected && { backgroundColor: COLORS.primaryForeground },
          ]}
        />
      ) : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
      {selected ? (
        <Ionicons
          name="checkmark"
          size={14}
          color={COLORS.primaryForeground}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  initialsWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: COLORS.foreground,
  },
  labelSelected: {
    color: COLORS.primaryForeground,
  },
});
