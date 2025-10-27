import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../../../context/NotificationContext"; // ✅ use your notification hook

export default function PosterLayout() {
  const { notification } = useNotification();
  const [unreadCount, setUnreadCount] = useState(0);

  // Increment badge count when a new notification arrives
  useEffect(() => {
    if (notification) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [notification]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#6366F1",
          tabBarInactiveTintColor: "#9ca3af",
        }}
      >
        {/* 🏠 Home */}
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size ?? 22} />
            ),
          }}
        />

        {/* 📋 Tasks */}
        <Tabs.Screen
          name="task"
          options={{
            tabBarLabel: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" color={color} size={size ?? 22} />
            ),
          }}
        />

        {/* 🔔 Notifications with badge */}
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarLabel: "Notifications",
            tabBarIcon: ({ color, size }) => (
              <View>
                <Ionicons
                  name="notifications-outline"
                  color={color}
                  size={size ?? 22}
                />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -3,
                      backgroundColor: "red",
                      borderRadius: 10,
                      width: 16,
                      height: 16,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 9,
                        fontWeight: "bold",
                      }}
                    >
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
          listeners={{
            focus: () => {
              // 👇 Reset the badge count when user opens Notifications tab
              setUnreadCount(0);
            },
          }}
        />

        {/* 👤 Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                color={color}
                size={size ?? 22}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
