import { useUserStore } from "@/stores/userStore";
import api from "../apiClient";

export const updateProfile = async (payload) => {
  const { email } = payload;
  const response = await api.put(`resource/User/${email}`, { ...payload });
  return response;
};
