// app/poster/_layout.jsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PosterLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      {/* 1️⃣ Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size ?? 22} />
          ),
        }}
      />

      {/* 2️⃣ Tasks */}
      <Tabs.Screen
        name="task"
        options={{
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size ?? 22} />
          ),
        }}
      />

      {/* 3️⃣ Notifications */}
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size ?? 22} />
          ),
        }}
      />

      {/* 4️⃣ Profile */}
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
  );
}
