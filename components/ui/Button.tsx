import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.85}
      disabled={isDisabled}
      style={[
        styles.base,
        sizeStyles[size].container,
        variantStyles[variant].container,
        fullWidth && { alignSelf: "stretch" },
        isDisabled && { opacity: 0.45 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].label.color} />
      ) : (
        <View style={styles.row}>
          {leftIcon}
          <Text
            style={[
              styles.label,
              sizeStyles[size].label,
              variantStyles[variant].label,
            ]}
          >
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontFamily: FONTS.sansSemiBold,
    textAlign: "center",
  },
});

const sizeStyles = {
  sm: StyleSheet.create({
    container: { paddingVertical: 8, paddingHorizontal: 16 },
    label: { fontSize: 13 },
  }),
  md: StyleSheet.create({
    container: { paddingVertical: 12, paddingHorizontal: 20 },
    label: { fontSize: 14 },
  }),
  lg: StyleSheet.create({
    container: { paddingVertical: 16, paddingHorizontal: 24 },
    label: { fontSize: 15 },
  }),
};

const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: COLORS.primary },
    label: { color: COLORS.primaryForeground },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: COLORS.card, borderColor: COLORS.border },
    label: { color: COLORS.foreground },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: "transparent" },
    label: { color: COLORS.mutedForeground },
  }),
  outline: StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      borderColor: COLORS.primary,
    },
    label: { color: COLORS.primary },
  }),
  destructive: StyleSheet.create({
    container: { backgroundColor: COLORS.destructive },
    label: { color: COLORS.destructiveForeground },
  }),
};
