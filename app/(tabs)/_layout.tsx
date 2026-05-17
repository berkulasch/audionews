import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  focused,
  icon,
}: {
  focused: boolean;
  icon: IconName;
}) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? COLORS.primary : COLORS.subtleForeground}
      />
      <View
        style={[
          styles.indicator,
          focused && { backgroundColor: COLORS.primary },
        ]}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.sidebar,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 78,
          paddingBottom: 18,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={focused ? "home" : "home-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="mylist"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? "list" : "list-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? "compass" : "compass-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? "person" : "person-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: "transparent",
  },
});
