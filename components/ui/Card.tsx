import { View, ViewProps, StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOW } from "../../constants/theme";

interface CardProps extends ViewProps {
  variant?: "flat" | "elevated" | "outline";
  padding?: number;
}

export function Card({
  variant = "flat",
  padding = 16,
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      {...rest}
      style={[
        styles.base,
        variant === "elevated" && styles.elevated,
        variant === "outline" && styles.outline,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  elevated: {
    backgroundColor: COLORS.cardElevated,
    ...SHADOW.card,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: COLORS.border,
  },
});
