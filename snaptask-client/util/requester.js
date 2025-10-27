// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://<your-server-ip>:4000", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


// --- Attach JWT automatically ---
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("snaptask_jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Normalize all responses ---
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const status = error?.response?.status || 0;
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




