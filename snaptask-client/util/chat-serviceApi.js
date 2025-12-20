  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  // http://10.241.53.30:4000
  export const chatApi = axios.create({
   baseURL: "http://10.191.99.30:4002", 
    // timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // --- Attach JWT automatically ---
  chatApi.interceptors.request.use(async (config) => {
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

chatApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error?.response;

    const normalizedError = {
      status: response?.status || 500,
      message:
        response?.data?.message ||
        "Something went wrong. Please try again.",
      data: response?.data || null,
    };

    return Promise.reject(normalizedError);
  }
);
  export default chatApi;


