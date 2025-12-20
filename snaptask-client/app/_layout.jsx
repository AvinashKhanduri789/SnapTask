import { Stack, useRouter, Slot } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "../context/NotificationContext";
import "../global.css";
import { useApi } from "../util/useApi";
import { api } from "../util/requester";
import { Alert } from "react-native";
import { SocketProvider } from "../context/SocketContext"; 


// Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const GlobalAuthState = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Load user from AsyncStorage
        const storedUser = await AsyncStorage.getItem("userData");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        // Validate token directly using api.get
        await api.get("/api/validateToken");

        // If token is valid, restore user
        setUserData(parsedUser);
      } catch (err) {
        console.warn("Token invalid or expired:", err?.detail || err);
        Alert.alert("Session Expired", err?.detail || "Please log in again.");
        await AsyncStorage.removeItem("userData");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      setUserData(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthGate (delayed router access)
const AuthGate = () => {
  const router = useRouter();
  const { userData, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!userData) {
      router.replace("/auth/login");
    } else if (userData.role === "POSTER") {
      router.replace("/poster");
    } else if (userData.role === "SEEKER") {
      router.replace("/seeker");
    }
  }, [loading, userData]);

  return null;
};

// Root Layout
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalAuthState>
        <NotificationProvider>
          <SocketProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="poster" />
              <Stack.Screen name="seeker" />
            </Stack>
            <AuthGate />
          </SocketProvider>
        </NotificationProvider>
      </GlobalAuthState>
    </GestureHandlerRootView>
  );
}
