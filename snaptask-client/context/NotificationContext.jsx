import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {useApi} from "../util/useApi";
import {api} from "../util/requester";


// =========================
// 🔹 Create Context
// =========================
const NotificationContext = createContext(undefined);



// =========================
// 🔹 Custom Hook
// =========================
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

// =========================
// 🔹 Provider Component
// =========================
export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const {data, request,isLoading} = useApi();

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  //  Configure global notification behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    let isMounted = true;

    const setupNotifications = async () => {
      try {
        //  Request permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Push notification permission not granted");
          return;
        }

        //  Get Expo Push Token
        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
          })
        ).data;

        if (isMounted) setExpoPushToken(token);
        console.log(" Expo Push Token:", token);

        

        const result = await request(api.post("/poster/profile/fcm", {token}));

        if (result.ok) {
          console.log("Notification registered successfully");
        } else {
          console.log("Failed to register notification-->", result.error.detail);
        }

      } catch (err) {
        if (isMounted) setError(err);
        console.error(" Notification setup error:", err);
      }
    };

    setupNotifications();

    //  Listener: Notification received in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification Received:", notification);
      if (isMounted) setNotification(notification);
    });

    // Listener: User interaction with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification Response:", JSON.stringify(response, null, 2));
      // You can handle navigation or custom logic here
    });

    //  Cleanup on unmount (new Expo API)
    return () => {
      isMounted = false;
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const value = {
    expoPushToken,
    notification,
    error,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};



