import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../app/_layout";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { userData, loading } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!userData?.token) return;   
    if (socket) return;

// http://10.191.99.30:4002
    const s = io("https://snaptask-chat.onrender.com", {
      auth: {
        token: userData.token,      
      },
      transports: ["websocket"],
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [loading, userData?.token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
