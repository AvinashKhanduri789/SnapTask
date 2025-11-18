import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {useApi} from "../util/useApi";
import {api} from "../util/requester";
import { useAuth } from "@/app/_layout";



const NotificationContext = createContext(undefined);




export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const {data, request,isLoading} = useApi();
  const {userData} = useAuth();
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  const userRole = userData?.role;
  console.log("userrole in notification context is ---> ", userRole);
  const profileEndpointPrefix = userRole === "POSTER" ? "poster" : "seeker";
   console.log("profile endpoint prefix is  ---> ", profileEndpointPrefix);
  


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

        
        console.log("endpoint to register fcm is --> ",`/${profileEndpointPrefix}/profile/fcm` )
        const result = await request(api.post(`/${profileEndpointPrefix}/profile/fcm`, {token}));

        if (result.ok) {
          console.log("Notification registered successfully");
        } else {
          console.log("Failed to register notification-->", result.error);
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

  
    return () => {
      isMounted = false;
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [userRole]);

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



