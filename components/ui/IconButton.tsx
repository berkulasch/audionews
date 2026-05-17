import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

type Variant = "filled" | "ghost" | "primary" | "outline";

interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  iconSize?: number;
  variant?: Variant;
  color?: string;
}

export function IconButton({
  icon,
  size = 40,
  iconSize,
  variant = "filled",
  color,
  style,
  ...rest
}: IconButtonProps) {
  const variantStyle = variants[variant];
  const finalIconSize = iconSize ?? Math.round(size * 0.5);
  const finalIconColor = color ?? variantStyle.iconColor;

  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.8}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variantStyle.container,
        style,
      ]}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Ionicons name={icon} size={finalIconSize} color={finalIconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const variants = {
  filled: {
    container: {
      backgroundColor: COLORS.card,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    iconColor: COLORS.foreground,
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    iconColor: COLORS.mutedForeground,
  },
  primary: {
    container: { backgroundColor: COLORS.primary },
    iconColor: COLORS.primaryForeground,
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    iconColor: COLORS.foreground,
  },
};
