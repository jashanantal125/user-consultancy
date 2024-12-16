import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: "http://192.168.1.240:8000/api/",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const { apiKey } = useAuthStore.getState();
    const { apiSecret } = useAuthStore.getState();

    if (apiKey) {
      config.headers.Authorization = `token ${apiKey}:${apiSecret}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
