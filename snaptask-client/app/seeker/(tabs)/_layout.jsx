import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
export default function SeekerLayout() {
  return (
    <View style={{ flex: 1 }}>
    <Tabs
      initialRouteName="s_tasks"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      {/* Tasks 1 */}
      <Tabs.Screen
        name="s_tasks"
        options={{
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size ?? 22} />
          ),
        }}
      />
      {/* 2️ Notifications */}
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size ?? 22} />
          ),
        }}
      />
      {/* 3 Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size ?? 22} />
          ),
        }}
      />
    </Tabs>
    </View>
  );
}
