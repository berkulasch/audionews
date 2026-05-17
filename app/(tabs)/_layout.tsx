import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { COLORS } from "../../constants/theme";

function TabIcon({ focused, icon, label }: { focused: boolean; icon: string; label: string }) {
  return (
    <View className="items-center justify-center pt-1">
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 10,
          marginTop: 2,
          color: focused ? COLORS.gold[500] : COLORS.muted,
          fontWeight: focused ? "600" : "400",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.cream[100],
          borderTopColor: COLORS.cream[300],
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🏠" label="Ana Sayfa" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🔍" label="Keşfet" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="👤" label="Profil" />
          ),
        }}
      />
    </Tabs>
  );
}
