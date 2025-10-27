// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { View } from "react-native";
// export default function SeekerLayout() {
//   return (
//     <View style={{ flex: 1 }}>
//     <Tabs
//       initialRouteName="s_tasks"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: true,
//         tabBarActiveTintColor: "#6366F1",
//         tabBarInactiveTintColor: "#9ca3af",
//       }}
//     >
//       {/* Tasks 1 */}
//       <Tabs.Screen
//         name="s_tasks"
//         options={{
//           tabBarLabel: "Tasks",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="list-outline" color={color} size={size ?? 22} />
//           ),
//         }}
//       />
//       {/* 2️ Notifications */}
//       <Tabs.Screen
//         name="notifications"
//         options={{
//           tabBarLabel: "Notifications",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="notifications-outline" color={color} size={size ?? 22} />
//           ),
//         }}
//       />
//       {/* 3 Profile */}
//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarLabel: "Profile",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-circle-outline" color={color} size={size ?? 22} />
//           ),
//         }}
//       />
//     </Tabs>
//     </View>
//   );
// }


import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Alert,Text } from "react-native";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext"; // adjust path if needed

export default function SeekerLayout() {
  const { expoPushToken, notification, error } = useNotification();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (error) {
      console.error("❌ Notification Error:", error);
      Alert.alert("Notification Error", error.message || "Something went wrong with notifications");
    }

    if (expoPushToken) {
      console.log("✅ Expo Push Token from context:", expoPushToken);
    }
  }, [expoPushToken, error]);

  useEffect(() => {
    if (notification) {
      console.log("🔔 New Notification Received:", notification);
      // Increment unread count only when user is *not* on Notifications tab
      setUnreadCount((prev) => prev + 1);
    }
  }, [notification]);

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
        {/* 1️⃣ Tasks */}
        <Tabs.Screen
          name="s_tasks"
          options={{
            tabBarLabel: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" color={color} size={size ?? 22} />
            ),
          }}
        />

        {/* 2️⃣ Notifications */}
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarLabel: "Notifications",
            tabBarIcon: ({ color, size, focused }) => (
              <View>
                <Ionicons
                  name={focused ? "notifications" : "notifications-outline"}
                  color={color}
                  size={size ?? 22}
                />
                {unreadCount > 0 && !focused && (
                  <View
                    style={{
                      position: "absolute",
                      right: -4,
                      top: -2,
                      backgroundColor: "#EF4444",
                      borderRadius: 8,
                      minWidth: 14,
                      height: 14,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 2,
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
            tabPress: () => {
              // Reset badge when user opens Notifications tab
              setUnreadCount(0);
            },
          }}
        />

        {/* 3️⃣ Profile */}
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

