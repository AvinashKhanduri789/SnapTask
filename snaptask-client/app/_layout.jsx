import { Stack, useRouter, Slot } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

// ========================
// 🔹 Auth Context
// ========================
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const GlobalAuthState = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // const storedUser = await AsyncStorage.getItem("userData");
        // if (storedUser) setUserData(JSON.parse(storedUser));

        // ✅ Mock user for now
        setUserData({
          email: "khanduria11@gmail.com",
          username: "avinash.khanduri",
          role: "POSTER", // or POSTER
          token: "mock-jwt-token",
        });
      } catch (err) {
        console.warn("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (userData) {
      console.log("User data saved:", userData);
      // AsyncStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <AuthContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ========================
// 🔹 AuthGate (delayed router access)
// ========================
const AuthGate = () => {
  const router = useRouter();
  const { userData, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait until user data loads

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

// ========================
// 🔹 Root Layout
// ========================
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalAuthState>
        {/* Stack Router */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="poster" />
          <Stack.Screen name="seeker" />
        </Stack>
        <AuthGate />
      </GlobalAuthState>
    </GestureHandlerRootView>
  );
}
