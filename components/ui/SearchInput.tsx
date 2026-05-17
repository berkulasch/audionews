import { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";

interface SearchInputProps extends Omit<TextInputProps, "style"> {
  onClear?: () => void;
}

export function SearchInput({
  value,
  onClear,
  onFocus,
  onBlur,
  placeholder = "Ara...",
  placeholderTextColor = COLORS.subtleForeground,
  ...rest
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Ionicons name="search" size={18} color={COLORS.subtleForeground} />
      <TextInput
        {...rest}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={styles.input}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
      />
      {!!value && onClear && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={COLORS.subtleForeground}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  focused: {
    borderColor: COLORS.ring,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.foreground,
    paddingVertical: 0,
  },
});
