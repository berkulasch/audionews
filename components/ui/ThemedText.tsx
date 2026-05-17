import { Text, TextProps, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../constants/theme";

type Variant =
  | "display"
  | "title"
  | "headline"
  | "subtitle"
  | "body"
  | "caption"
  | "overline"
  | "label";

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export function ThemedText({
  variant = "body",
  color,
  style,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        styles[variant],
        color ? { color } : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: COLORS.foreground,
  },
  display: {
    fontFamily: FONTS.serif,
    fontSize: 32,
    lineHeight: 40,
    color: COLORS.foreground,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    lineHeight: 30,
    color: COLORS.foreground,
  },
  headline: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.foreground,
  },
  subtitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.foreground,
  },
  body: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.foreground,
  },
  caption: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.subtleForeground,
  },
  overline: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLORS.primary,
  },
  label: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.foreground,
  },
});
