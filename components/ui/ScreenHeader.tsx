import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { COLORS } from "../../constants/theme";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  leading,
  trailing,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.text}>
        <ThemedText variant="title">{title}</ThemedText>
        {subtitle ? (
          <ThemedText
            variant="caption"
            color={COLORS.mutedForeground}
            style={styles.subtitle}
          >
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  leading: {},
  text: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  trailing: {},
});
