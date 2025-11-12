  // api.js
  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";

  export const api = axios.create({
   baseURL: "http://10.241.53.30:4000", 
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // --- Attach JWT automatically ---
  api.interceptors.request.use(async (config) => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        const token = parsedUser?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn("Error reading token from AsyncStorage:", error);
    }
    return config;
  });

// --- Normalize all responses ---
api.interceptors.response.use(
  (response) => {
   
    if (response.status === 304) {
      return {
        ...response,
        data: response.data || { message: "No changes detected" },
        status: 200 
      };
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status || 0;
    console.log("inside requester interceptor error is --->", error);
    if (status === 304) {
      const successResponse = {
        ok: true,
        status: 200,
        data: { message: "No changes needed" }
      };
      return Promise.resolve(successResponse);
    }
    
    const data = error?.response?.data || {};
    const normalized = {
      ok: false,
      status,
      title: data.title || "Error",
      detail:
        data.detail ||
        data.message ||
        "Something went wrong. Please try again later.",
      path: data.path || "N/A",
      timestamp: data.timestamp || new Date().toISOString(),
    };

    return Promise.reject(normalized);
  }
);
  export default api;


