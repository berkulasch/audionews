import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";

interface PreferenceSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PreferenceSection({
  title,
  description,
  children,
}: PreferenceSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 17,
    color: COLORS.foreground,
  },
  description: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.mutedForeground,
    marginTop: 4,
    lineHeight: 18,
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 4,
  },
});
